import { isNone, isSome, none, Option, some } from 'fp-ts/lib/Option';
import { drawDisc, pathPolyline } from '../lib/ctx-util';
import { Morphism, Transformation, Vector2, Vector3 } from '../lib/types';
import * as Vec3 from '../lib/vec3';
import { OrbitCamera, toRegularCamera } from './camera/orbit-camera';
import { CameraSettings, PerspectiveCamera } from './camera/perspective-camera';
import { findFirstZero, raycastSurfaceNormal } from './smooth-equation-casting';
import { worldPointToCamPoint, worldPointToScreenPoint } from './space-conversion';
import { interpolate } from './util';
import { createPerspectiveRayFromMouse, Ray } from './voxel/raycasting';

//setup canvas ###

function createCtx(){
	const canvas = document.createElement("canvas");
	Object.assign(canvas.style, {
		"position": "absolute"
	});
	document.body.appendChild(canvas);
	return canvas.getContext("2d");
}

function getCanvasSize(ctx: CanvasRenderingContext2D): Vector2 {
	const { canvas } = ctx;
	return [
		canvas.clientWidth, 
		canvas.clientHeight
	]
}

const backgroundCtx = createCtx();
const ctx = createCtx();

const updateCanvasSize = (ctx: CanvasRenderingContext2D) => {
	const { canvas } = ctx;
	const widthPx = window.innerWidth;
	const heightPx = window.innerHeight;
	const scalePx = window.devicePixelRatio || 1;
	Object.assign(canvas.style, {
		width: `${widthPx}px`,
		height: `${heightPx}px`
	});
	Object.assign(canvas, {
		width: widthPx * scalePx,
		height: heightPx * scalePx
	});
	ctx.resetTransform();
	ctx.scale(scalePx, scalePx);
};

const onresize = () => {
	updateCanvasSize(ctx);
	updateCanvasSize(backgroundCtx)
	const [w, h] = [window.innerWidth, window.innerHeight];
	camera = {
		...camera,
		settings: {
			...camera.settings,
			planeWidthHalf: w / 2,
			planeHeightHalf: h / 2,
		}
	};
	prepareAndRender();
};
window.onresize = onresize;


function renderCheckerboardPattern(ctx: CanvasRenderingContext2D, cellSize: number){
	const darkColor = "#262626";
	const lightColor = "#5c5c5c";
	const [w, h] = getCanvasSize(ctx);
	const cellCountX = Math.ceil(w / cellSize);
	const cellCountY = Math.ceil(h / cellSize);
	const gridSize = [cellCountX * cellSize, cellCountY * cellSize];
	ctx.save();
	ctx.translate(
		(w - gridSize[0]) / 2, 
		(h - gridSize[1]) / 2
	);
	for (let x = 0; x < cellCountX; x++){
		for (let y = 0; y < cellCountY; y++) {
			ctx.fillStyle = (x + y) % 2 === 0 ? darkColor : lightColor;
			ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
		}
	}
	ctx.restore();
}


//camera ###

type PerspectiveOrbitCamera = OrbitCamera & { settings: CameraSettings };

function orthoOrbitToPerspective(cam: PerspectiveOrbitCamera) {
	return {
		...toRegularCamera(cam),
		settings: cam.settings
	} as PerspectiveCamera;
}

let camera: PerspectiveOrbitCamera = {
	radius: 60,
	latitude: 0.52,
	longitude: -0.82,
	settings: {
		planeWidthHalf: window.innerWidth / 2,
		planeHeightHalf: window.innerHeight / 2,
		zScale: 2000
	}
};

function setupOrbitCameraControl() {
	const { canvas } = ctx;
	canvas.addEventListener("mousemove", e => {
		if (e.buttons !== 1) return;
		const s = 0.01;
		camera = {
			...camera,
			longitude: camera.longitude + e.movementX * s,
			latitude: camera.latitude + e.movementY * s
		};
		prepareAndRender();
	});
	canvas.addEventListener("wheel", e => {
		camera = {
			...camera,
			radius: camera.radius * (1 + e.deltaY * 0.001)
		}
		prepareAndRender();
	});
}






const backgroundColor = "#252729";// "#d4d3d2";
let boxSize = 2;

function prepareAndRender() {
	renderCheckerboardPattern(backgroundCtx, 100);

	const { canvas } = ctx;
	const [w, h] = [canvas.clientWidth, canvas.clientHeight];

	ctx.save();
	// ctx.fillStyle = backgroundColor;
	// ctx.fillRect(0, 0, w, h);
	ctx.clearRect(0, 0, w, h);
	ctx.translate(w / 2, h / 2);
	ctx.scale(1, -1);

	render();

	ctx.restore();
}

const unitBoxVerts: Vector3[] = [
	[+1, +1, +1],
	[-1, +1, +1],
	[+1, -1, +1],
	[-1, -1, +1],
	[+1, +1, -1],
	[-1, +1, -1],
	[+1, -1, -1],
	[-1, -1, -1],
];
const boxWireIndices: [number, number][] = [
	[0, 1], [2, 3], [4, 5], [6, 7],
	[0, 2], [1, 3], [4, 6], [5, 7],
	[0, 4], [1, 5], [2, 6], [3, 7]
];



let boxIntersectionLine: Option<[Vector3, Vector3]> = none;
function renderIntersectionLine(ctx: CanvasRenderingContext2D, cam: PerspectiveCamera) {
	if (isNone(boxIntersectionLine)) return;
	ctx.save();
	ctx.lineWidth = 4;
	ctx.strokeStyle = "orange";
	const screenPoints = boxIntersectionLine.value.map(worldPointToScreenPoint(ctx, cam));
	pathPolyline(ctx, screenPoints);
	ctx.stroke();
	ctx.restore();
}


const isOcclusionEdge = (worldToCam: Transformation<Vector3>, cubeCenter: Vector3) => (vert1: Vector3, vert2: Vector3): boolean => {
	const edgeCenter = Vec3.interpolate(vert1, vert2, 0.5);
	let occlusionCount = 0;
	for (let i = 0; i < 3; i++){
		const val = edgeCenter[i];
		if (Math.abs(val) < 1e-5) continue;
		
		const faceCenterLocal = [0, 0, 0] as Vector3;
		faceCenterLocal[i] = val;
		const faceCenterGlobal = worldToCam(faceCenterLocal);
		const normalVector = Vec3.subtract(faceCenterGlobal, cubeCenter);
		if (Vec3.dot(normalVector, faceCenterGlobal) < 0){
			occlusionCount++;
		}
	}
	return occlusionCount > 1;
}

function renderWireBox(ctx: CanvasRenderingContext2D, boxSize: number, cam: PerspectiveCamera){
	ctx.save();
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#fcba03";
	const boxSideLength = boxSize * 2 + 1;
	const boxVerts = unitBoxVerts.map(v => Vec3.multiply(v, boxSideLength));
	const projectedBoxVerts = boxVerts.map(worldPointToScreenPoint(ctx, cam));
	// const skipEdge = isOcclusionEdge(cam.transform.position);
	const skipEdge = isOcclusionEdge(
		worldPointToCamPoint(cam), 
		worldPointToCamPoint(cam)([0, 0, 0]),
	);
	for (const edgeInds of boxWireIndices) {
		const edgeVerts = edgeInds.map(i => projectedBoxVerts[i]);
		if (skipEdge(boxVerts[edgeInds[0]], boxVerts[edgeInds[1]])) continue;
		pathPolyline(ctx, edgeVerts);
		ctx.stroke();
	}
	ctx.restore();
}

const render = () => {
	const perspectiveCam = orthoOrbitToPerspective(camera);
	
	renderIntersectionLine(ctx, perspectiveCam);
	renderWireBox(ctx, boxSize, perspectiveCam);
};


function graphFunction(x: number): Option<number> {
	if (x === 0) return none;
	return some(Math.log(Math.sin(x)) + 1);
}
function renderZeroStuff(){
	ctx.save();
	
	ctx.lineWidth = 2;
	ctx.strokeStyle = "black";
	pathPolyline(ctx, [[-500, 0], [+500, 0]]);

	ctx.stroke();
	for (let x = 0; x < 1; x += 0.02){
		const yOpt = graphFunction(x);
		if (isNone(yOpt)) continue;
		const y = yOpt.value;
		const screenX = x * 200;
		const screenY = y * 200;
		ctx.fillStyle = "black";
		drawDisc(ctx, [screenX, screenY], 4);
	}
	
	const firstZeroOpt = findFirstZero(graphFunction);
	if (isSome(firstZeroOpt)){
		const x = firstZeroOpt.value;
		ctx.fillStyle = "red";
		drawDisc(ctx, [x * 200, 0], 4);
	}
	
	ctx.restore();
}


function nextFramePromise(){
	return new Promise((resolve) => requestAnimationFrame(resolve));
}

function renderBackgroundProgressStrip(stripWidth: number, height: number, ctx: CanvasRenderingContext2D){
	ctx.fillStyle = "teal";
	ctx.strokeStyle = "white";
	ctx.fillRect(0, 0, stripWidth, height);
	ctx.beginPath();
	ctx.moveTo(stripWidth, 0);
	ctx.lineTo(stripWidth, height);
	ctx.lineWidth = 2;
	ctx.stroke();
}

async function fillPixelsByRaytracing(
	ctx: CanvasRenderingContext2D, backgroundCtx: CanvasRenderingContext2D, 
	camera: PerspectiveCamera, raycastFunc: Morphism<Ray, Option<Vector3>>){
	
	const surfaceColor = [255, 255, 255] as Vector3;
	const lightDirection: Vector3 = Vec3.normalize([0.3, -1, -0.2]);
	const [w, h] = getCanvasSize(ctx);
	let prevWorkStartTime = window.performance.now();
	const pixelSize = 1.5;

	for (let x = 0; x < w; x++){
		renderBackgroundProgressStrip(x, h, backgroundCtx);
		for (let y = 0; y < h; y++){
			const workTimeDelta = window.performance.now() - prevWorkStartTime;
			if (workTimeDelta > 0.2) await nextFramePromise();
			prevWorkStartTime = window.performance.now()

			const screenPoint = [x, y] as Vector2;
			
			const ray = createPerspectiveRayFromMouse(screenPoint, camera);
			const normalOpt = raycastFunc(ray);
			if (isNone(normalOpt)) continue;

			const normal = normalOpt.value;
			const brightness = interpolate(
				1, 0.3,
				Math.max(0, Vec3.dot(normal, lightDirection))
			);
			const adjustedColor = surfaceColor.map(c => Math.round(c * brightness)) as Vector3;
			ctx.fillStyle = `rgb(${adjustedColor.join(",")})`;
			ctx.fillRect(x, y, pixelSize, pixelSize);
		}
	}
}


type OptVector3 = [Option<number>, Option<number>, Option<number>];
type OptVector2 = [Option<number>, Option<number>];

type Vec3Func = Morphism<Vector3, Option<number>>;
type Vec3DerivFunc = Morphism<Vector3, OptVector3>;

type SurfaceEquationAndDeriv = {
	equationFunc: Vec3Func,
	derivFunc: Vec3DerivFunc
};

const measureDerivatives = (func: Vec3Func): Vec3DerivFunc => {
	const d = 0.0001;
	return (v: Vector3) => {
		const measuredDerivs = [none, none, none] as OptVector3;
		for (let i = 0; i < 3; i++){
			const p = v.slice() as Vector3;
			p[i] += d;
			const [v1, v2] = [func(v), func(p)];
			if (isNone(v1) || isNone(v2)) continue;
			const deriv = (v2.value - v1.value) / d;
			measuredDerivs[i] = some(deriv);
		}
		return measuredDerivs;
	};
};


type ScalarField = (p: Vector2) => Option<number>;
type ScalarFieldDeriv = (p: Vector2) => OptVector2;

function makeSurfaceEquationAndDerivByScalarField(scalarField: ScalarField, scalarFieldDeriv: ScalarFieldDeriv): SurfaceEquationAndDeriv {
	const equationFunc = ([x, y, z]: Vector3): Option<number> => {
		const scalar = scalarField([x, z]);
		if (isNone(scalar)) return none;
		return some(scalar.value - y);
	};
	const derivFunc = ([x, y, z]: Vector3): OptVector3 => {
		const subDeriv = scalarFieldDeriv([x, z]);
		return [
			subDeriv[0], 
			some(-1), 
			subDeriv[1]
		]
	};
	
	return { equationFunc, derivFunc }
}

const { sin, cos } = Math;

const sineFuncs: SurfaceEquationAndDeriv = (() => {
	const [a, f] = [2.5, 0.5];
	const func: Morphism<Vector3, Option<number>> = (p: Vector3) => {
		const r = Math.hypot(p[0], p[2]);
		return some(a * Math.cos(r * f) - p[1]);
	};
	const deriv: Morphism<Vector3, [Option<number>, Option<number>, Option<number>]> = (p: Vector3) => {
		if (p[0] === 0 && p[2] === 0){
			return [some(0), some(-1), some(0)]
		}
		const rSqrd = p[0]**2 + p[2]**2;
		const r = Math.sqrt(rSqrd);
		const s1 = -a / rSqrd * Math.sin(r * f);
		return [
			some(s1 * p[0]),
			some(s1 * p[2]),
			some(-1)
		]
	};
	return { equationFunc: func, derivFunc: deriv };
})();

const inverseProdFuncs: SurfaceEquationAndDeriv = (() => {
	const [a, f] = [2.5, 0.5];
	const func: Morphism<Vector3, Option<number>> = (p: Vector3) => {
		return some(p[0] * p[1] * p[2] - 2);
	};
	const deriv: Morphism<Vector3, [Option<number>, Option<number>, Option<number>]> = (p: Vector3) => {
		const [x, y, z] = p;
		if (x === 0 || y === 0 || z === 0) {
			return [
				none, none, none
			]
		}
		return [
			some(y * z),
			some(z * x),
			some(x * y)
		]
	};
	return { equationFunc: func, derivFunc: deriv };
})();

const sphereFuncs: SurfaceEquationAndDeriv = (() => {
	const rSqrd = 10;
	const func: Morphism<Vector3, Option<number>> = (p: Vector3) => {
		const [x, y, z] = p;
		return some(x**2 + y**2 + z**2 - rSqrd);
	};
	const deriv: Morphism<Vector3, [Option<number>, Option<number>, Option<number>]> = (p: Vector3) => {
		const [x, y, z] = p;
		return [
			some(2 * x),
			some(2 * y),
			some(2 * z)
		]
	};
	return { equationFunc: func, derivFunc: deriv };
})();

const metaBall: SurfaceEquationAndDeriv = (() => {
	const separation = 2;
	const func: Morphism<Vector3, Option<number>> = (p: Vector3) => {
		const [x, y, z] = p;
		const y2 = y**2;
		const z2 = z**2;

		const dist1 = (x + separation)**2 + y2 + z2;
		const dist2 = (x - separation)**2 + y2 + z2;
		return some((dist1 * dist2) - 18);
	};
	return { 
		equationFunc: func, 
		derivFunc: measureDerivatives(func) 
	};
})();

const blobsFunc: SurfaceEquationAndDeriv = (() => {
	const c = 1.4;
	const func: Morphism<Vector3, Option<number>> = (p: Vector3) => {
		const [x, y, z] = p;
		return some(
			sin(x) + sin(y) + sin(z) - c
		);
	};
	const deriv: Morphism<Vector3, [Option<number>, Option<number>, Option<number>]> = (p: Vector3) => {
		const [x, y, z] = p;
		return [
			some(cos(x)),
			some(cos(y)),
			some(cos(z)),
		]
	};
	return { equationFunc: func, derivFunc: deriv };
})();

const testFunc1: SurfaceEquationAndDeriv = (() => {
	const c = 1;
	const func: Morphism<Vector3, Option<number>> = (p: Vector3) => {
		const [x, y, z] = p;
		return some(
			cos(x**3) + cos(y**3) + cos(z**3) - Vec3.magnitude(p)
		);
	};
	const deriv: Morphism<Vector3, OptVector3> = (p: Vector3) => {
		const r = Vec3.magnitude(p);
		return [0, 1, 2].map(i => some(-3 * p[i]**2 * sin(p[i]**3) - p[i] / r)) as OptVector3;
	};
	return { equationFunc: func, derivFunc: deriv };
})();

const hillFuncs: SurfaceEquationAndDeriv = (() => {
	const func: Morphism<Vector3, Option<number>> = (p: Vector3) => {
		return some(
			(1 + Vec3.sqrdMagnitude(p))**(-2)
		);
	};
	const deriv: Morphism<Vector3, OptVector3> = (p: Vector3) => {
		const r = Vec3.magnitude(p);
		const t = -4 * (1 + Vec3.sqrdMagnitude(p))**(-3);
		return [0, 1, 2].map(i => some(t * p[i])) as OptVector3;
	};
	return { equationFunc: func, derivFunc: deriv };
})();

const flatSurfaceFuncs: SurfaceEquationAndDeriv = (() => {
	const coeffs: Vector3 = [0, 1, 2].map(n => Math.random() - 0.5) as Vector3;
	const func: Morphism<Vector3, Option<number>> = (p: Vector3) => {
		return some(
			coeffs[0] * p[0] + 
			coeffs[1] * p[1] +
			coeffs[2] * p[2]
		);
	};
	const deriv: Morphism<Vector3, OptVector3> = (p: Vector3) => {
		return coeffs.map(some) as OptVector3
	};
	return { equationFunc: func, derivFunc: deriv };
})();

const cylinderFuncs: SurfaceEquationAndDeriv = (() => {
	const rSqrd = 40;
	const func: Morphism<Vector3, Option<number>> = (p: Vector3) => {
		const [x, y, z] = p;
		return some(
			x**2 + z**2 - rSqrd
		);
	};
	const deriv: Morphism<Vector3, OptVector3> = (p: Vector3) => {
		return [
			some(2 * p[0]),
			some(0), 
			some(2 * p[2])
		]
	};
	return { equationFunc: func, derivFunc: deriv };
})();

const scalarFieldFuncs1: SurfaceEquationAndDeriv = (() => {
	const a = 1;
	const field: ScalarField = ([x, y]) => some(a * Math.sin(x) * Math.sin(y));
	const deriv: ScalarFieldDeriv = ([x, y]) => [
		some(a * Math.cos(x) * Math.sin(y)),
		some(a * Math.sin(x) * Math.cos(y))
	];
	return makeSurfaceEquationAndDerivByScalarField(field, deriv);
})();

const scalarFieldFuncs2: SurfaceEquationAndDeriv = (() => {
	const a = -2;
	const field: ScalarField = ([x, y]) => some(a * Math.log(Math.hypot(x, y)) - 0.8);
	//log((x^2 + y^2)^0.5) -> x * (x^2 + y^2)^(-1)
	const deriv: ScalarFieldDeriv = ([x, y]) => {
		const s = a / (x**2 + y**2);
		return [
			some(x * s),
			some(y * s)
		]
	};
	return makeSurfaceEquationAndDerivByScalarField(field, deriv);
})();


let selectedFuncs: SurfaceEquationAndDeriv = metaBall;

(window as any).setEquationFunc = (untypedFunc: any) => {
	if (typeof(untypedFunc) !== "function"){
		console.error("supplied argument is not a function!");
		return;
	}
	const safeFunc: Vec3Func = (v) => {
		const untypedOutput = untypedFunc(v);
		if (typeof(untypedOutput) !== "number") return none;
		return some(untypedOutput);
	};
	selectedFuncs = {
		equationFunc: safeFunc,
		derivFunc: measureDerivatives(safeFunc)
	};
	normalFunc = createNormalFunc();
}

function createNormalFunc(){
	const funcs: SurfaceEquationAndDeriv = selectedFuncs;
	const normalFunc = raycastSurfaceNormal(boxSize, funcs.equationFunc, funcs.derivFunc);
	return normalFunc;
}

let normalFunc: Morphism<Ray, Option<Vector3>> = createNormalFunc();
let raytracingActive = false;

function setupRaycastingControl() {
	document.addEventListener("keypress", e => {
		if (raytracingActive) return;
		if (e.key !== " ") return;
		prepareAndRender();
		raytracingActive = true;
		fillPixelsByRaytracing(
			ctx, backgroundCtx,
			orthoOrbitToPerspective(camera), normalFunc
		).then(
			() => raytracingActive = false
		)
	});
	const { canvas } = ctx;
	canvas.addEventListener("mousemove", e => {
		if (!e.ctrlKey) return;
		const perspectiveCam = orthoOrbitToPerspective(camera);
		const mousePoint: Vector2 = [e.offsetX, e.offsetY];
		const ray = createPerspectiveRayFromMouse(mousePoint, perspectiveCam);
		const normalOpt = normalFunc(ray);
		if (isNone(normalOpt)) return;
		const normal = normalOpt.value;
		const surfaceColor = [255, 255, 255] as Vector3;
		const lightDirection: Vector3 = Vec3.normalize([0.3, -1, -0.2]);
		const brightness = interpolate(
			1, 0.3,
			Math.max(0, Vec3.dot(normal, lightDirection))
		);
		const adjustedColor = surfaceColor.map(c => Math.round(c * brightness)) as Vector3;
		ctx.fillStyle = `rgb(${adjustedColor.join(",")})`;
		ctx.fillRect(mousePoint[0], mousePoint[1], 1, 1);
	});
}

function addInstructions(){
	document.body.insertAdjacentHTML(
		"beforeend",
		`
			<div 
				id="instructions" 
				style="
					position: absolute; 
					top: 0px; left: 0px; right: 0px; 
					color: #e7e7e7; font-size: 24px;
					text-align: center;
				"
			>
				<p>
					you can supply your own equation in the developer console!
				</p>
				<p>
					press space to start rendering
				</p>
			</div>
		`
	);

	//remove instructions when space is pressed
	document.addEventListener("keydown", e => {
		if (e.key === " "){
			const instructionsDiv = document.querySelector("#instructions");
			if (!instructionsDiv) return;
			instructionsDiv.remove();
		}
	});
}

function addConsoleInstructions(){
	console.log(`here is an example how to write a function.\nlet's say you want to plot the equation x * x = y - z\nsimply subtract the right side from the left and write x * x - (y - z).\nthen call this global function:\nsetEquationFunc(([x, y, z]) => x * x - y + z);
	`);
}

const main = () => {
	addInstructions();
	addConsoleInstructions();
	updateCanvasSize(ctx);
	updateCanvasSize(backgroundCtx);
	onresize();
	setupOrbitCameraControl();
	setupRaycastingControl();
	prepareAndRender();
};
main();
