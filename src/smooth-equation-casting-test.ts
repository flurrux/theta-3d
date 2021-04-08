import { filter, map } from 'fp-ts/lib/Array';
import { identity, pipe } from 'fp-ts/lib/function';
import { isNone, isSome, none, Option, some } from 'fp-ts/lib/Option';
import { drawDisc, pathPolygon, pathPolyline } from '../lib/ctx-util';
import { Morphism, Vector2, Vector3 } from '../lib/types';
import * as Vec3 from '../lib/vec3';
import * as Vec2 from '../lib/vec2';
import { OrbitCamera, toRegularCamera } from './camera/orbit-camera';
import { CameraSettings, PerspectiveCamera } from './camera/perspective-camera';
import { interpolate } from './util';
import { isVoxelBehindCamera } from './voxel/frustum-culling';
import { createVoxelArraySortFunctionWithCamPosition } from './voxel/occlusion-sorting';
import { projectVoxelFace } from './voxel/rendering';
import { VoxelFaceNormal, voxelFaceNormals } from './voxel/voxel-face';
import { createCameraRay, createPerspectiveRayFromMouse, Ray, raycastVoxel, raycastVoxels } from './voxel/raycasting';
import { worldPointToScreenPoint } from './space-conversion';
import { findFirstZero, getIntersectionLine, raycastSurfaceNormal } from './smooth-equation-casting';

//setup canvas ###

const canvas = document.body.querySelector("canvas");
const ctx = canvas.getContext("2d");
const updateCanvasSize = () => {
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
	// ctx.setTransform(scalePx, 0, 0, scalePx, 0, 0);
};

const onresize = () => {
	updateCanvasSize();
	camera = {
		...camera,
		settings: {
			...camera.settings,
			planeWidthHalf: canvas.width / 2,
			planeHeightHalf: canvas.height / 2,
		}
	};
	// prepareAndRender();
};
window.onresize = onresize;



//camera ###

type PerspectiveOrbitCamera = OrbitCamera & { settings: CameraSettings };

function orthoOrbitToPerspective(cam: PerspectiveOrbitCamera) {
	return {
		...toRegularCamera(cam),
		settings: cam.settings
	} as PerspectiveCamera;
}

let camera: PerspectiveOrbitCamera = {
	radius: 170,
	latitude: 0.52,
	longitude: -0.82,
	settings: {
		planeWidthHalf: canvas.width / 2,
		planeHeightHalf: canvas.height / 2,
		zScale: 2000
	}
};

function setupOrbitCameraControl() {
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
let boxSize = 10;

function prepareAndRender() {
	const { canvas } = ctx;
	const [w, h] = [canvas.width, canvas.height];

	ctx.save();
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, w, h);
	ctx.translate(w / 2, h / 2);
	ctx.scale(window.devicePixelRatio, -window.devicePixelRatio);

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

function renderWireBox(ctx: CanvasRenderingContext2D, boxSize: number, cam: PerspectiveCamera){
	ctx.save();
	ctx.lineWidth = 4;
	ctx.strokeStyle = "white";
	const boxSideLength = boxSize * 2 + 1;
	const boxVerts = unitBoxVerts.map(v => Vec3.multiply(v, boxSideLength));
	const projectedBoxVerts = boxVerts.map(worldPointToScreenPoint(ctx, cam));
	for (const edgeInds of boxWireIndices) {
		pathPolyline(ctx, edgeInds.map(i => projectedBoxVerts[i]));
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

async function fillPixelsByRaytracing(
	ctx: CanvasRenderingContext2D, camera: PerspectiveCamera, raycastFunc: Morphism<Ray, Option<Vector3>>){
	
	const canvas = ctx.canvas;
	const surfaceColor = [255, 255, 255] as Vector3;
	const lightDirection: Vector3 = Vec3.normalize([0.3, -1, -0.2]);
	const [w, h] = [canvas.width, canvas.height];
	let prevWorkStartTime = window.performance.now();
	for (let x = 0; x < w; x++){
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
			ctx.fillRect(x, y, 1, 1);
		}
	}
}


type OptVector3 = [Option<number>, Option<number>, Option<number>];
type SurfaceEquationAndDeriv = {
	equationFunc: Morphism<Vector3, Option<number>>,
	derivFunc: Morphism<Vector3, OptVector3>
};

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
	const rSqrd = 160;
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

function createNormalFunc(){
	const funcs: SurfaceEquationAndDeriv = blobsFunc;
	const boxSize = 10;
	const normalFunc = raycastSurfaceNormal(boxSize, funcs.equationFunc, funcs.derivFunc);
	return normalFunc;
}

function setupRaycastingControl() {
	const normalFunc = createNormalFunc();
	document.addEventListener("keypress", e => {
		fillPixelsByRaytracing(ctx, orthoOrbitToPerspective(camera), normalFunc)
	});
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

const main = () => {
	updateCanvasSize();
	onresize();
	setupOrbitCameraControl();
	setupRaycastingControl();
};
main();