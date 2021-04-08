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
	prepareAndRender();
};
window.onresize = onresize;


//voxel line ###

type Vec3Index = 0 | 1 | 2;

type Sign = -1 | 0 | 1;
function sign(n: number): Sign {
	return Math.sign(n) as Sign;
}

//use this to check if the vector is to the right, left or colinear with the refVector
//returns +1 if to the right, -1 if to the left and 0 if colinear
function calculateOrthoDotSign(refVector: Vector2, vector: Vector2): Sign {
	return Math.sign(
		Vec2.dot([refVector[1], -refVector[0]] as Vector2, vector)
	) as Sign;
}

type Voxel2DNormal = [1, 0] | [-1, 0] | [0, 1] | [0, -1];

//the actual corners have components of 1/2, not 1, but this is easier to work with
type Voxel2DCorner = [1, 1] | [-1, 1] | [1, -1] | [-1, -1];
const voxel2DCorners: Voxel2DCorner[] = [
	[1, 1], [-1, 1], [1, -1], [-1, -1]
];

//normInCellPosition is in the range -1 to +1, not -0.5 to +0.5!
function findInsideOutIntersectionDirection(normInCellPosition: Vector2, vector: Vector2): Option<Voxel2DNormal> {
	if (Vec2.isZero(vector)) return none;
	
	if (vector[0] === 0) return some([0, sign(vector[1])] as Voxel2DNormal);
	if (vector[1] === 0) return some([sign(vector[0]), 0] as Voxel2DNormal);

	const basis1 = [sign(vector[0]), 0] as Voxel2DNormal;
	const basis2 = [0, sign(vector[1])] as Voxel2DNormal;
	const absVector = vector.map(Math.abs) as Vector2;
	const corner = Vec2.add(basis1, basis2) as Voxel2DCorner;
	const relCorner = Vec2.subtract(corner, normInCellPosition);
	const relAbsCorner = relCorner.map(Math.abs) as Vector2;
	const dirSign = calculateOrthoDotSign(relAbsCorner, absVector);
	if (dirSign === +1) return some(basis1);
	if (dirSign === -1) return some(basis2);
	return some(basis1);
}

const setComponentAt = (index: Vec3Index, component: number) => (vec: Vector3): Vector3 => {
	let newVec = vec.slice() as Vector3;
	newVec[index] = component;
	return newVec;
};
const setVoxelNormalComponentFlipped = (normal: VoxelFaceNormal) => {
	const index = normal.findIndex(c => c !== 0) as Vec3Index;
	return setComponentAt(index, -normal[index]);
};
function createVoxel3Normal(normalIndex: Vec3Index, sign: 1 | -1): VoxelFaceNormal {
	return setComponentAt(normalIndex, sign)([0, 0, 0]) as VoxelFaceNormal;
}

//let the boundaryPosition be in the range -1 to +1, not -0.5 to +0.5. again, easier to work with that way
type VoxelBoundaryIntersectionResult = {
	nextBoundaryPosition: Vector3, 
	voxelStride: VoxelFaceNormal
};
function calculateNextLocalVoxelLocation(normBoundaryPosition: Vector3, vector: Vector3): Option<VoxelBoundaryIntersectionResult> {
	//the entryNormal is the inverted normal of the face where the boundaryPosition is located
	//it's inverted because that's the direction the vector should be pointing at.
	const entryNormalIndex = normBoundaryPosition.findIndex(c => Math.abs(c) === 1) as Vec3Index;
	const entryNormal = createVoxel3Normal(
		entryNormalIndex, 
		-sign(normBoundaryPosition[entryNormalIndex]) as (1 | -1)
	);
	const vectorNormalComponent = Vec3.dot(entryNormal, vector);
	if (vectorNormalComponent === 0){
		//vector is orthogonal to the entry plane
		//this could still be a valid case, but for simplicity i'll just return none
		return none;
	}
	if (vectorNormalComponent < 0) return none;

	const orthoIndices = [0, 1, 2].filter(ind => ind !== entryNormalIndex) as [Vec3Index, Vec3Index];
	const orthoBasis1 = createVoxel3Normal(orthoIndices[0], 1);
	const orthoBasis2 = createVoxel3Normal(orthoIndices[1], 1);
	const orthoPosition2d = orthoIndices.map(ind => normBoundaryPosition[ind]) as Vector2;
	const orthoVector2d = orthoIndices.map(ind => vector[ind]) as Vector2;
	const orthoIntersectionNormal2dOpt = findInsideOutIntersectionDirection(
		orthoPosition2d, orthoVector2d
	);
	if (isNone(orthoIntersectionNormal2dOpt)){
		//this case only occurs when the orthoVector2d is zero
		//step one voxel forward in the inward normal direction. 
		//the boundary position does not change on the next voxel
		return some({
			voxelStride: entryNormal, 
			nextBoundaryPosition: normBoundaryPosition
		})
	}
	const orthoIntersectionNormal2d = orthoIntersectionNormal2dOpt.value;
	const orthoIntersectionNormal3d = Vec3.add(
		Vec3.multiply(orthoBasis1, orthoIntersectionNormal2d[0]),
		Vec3.multiply(orthoBasis2, orthoIntersectionNormal2d[1])
	) as VoxelFaceNormal;
	const slope = Vec3.dot(orthoIntersectionNormal3d, vector) / vectorNormalComponent;
	const extendedVector = Vec3.multiply(vector, 1 / vectorNormalComponent);
	const intersectionOrthoComponent = 2 * slope;
	const orthoOriginOffset = Vec3.dot(orthoIntersectionNormal3d, normBoundaryPosition);
	const intersectionOrthoFromOrigin = orthoOriginOffset + intersectionOrthoComponent;
	if (intersectionOrthoFromOrigin <= 1){
		return some({
			voxelStride: entryNormal, 
			nextBoundaryPosition: pipe(
				normBoundaryPosition, 
				p => Vec3.add(p, extendedVector),
				setVoxelNormalComponentFlipped(entryNormal)
			)
		})
	}
	const normalOffsetForNextPosition = (1 - orthoOriginOffset) / slope;
	return some({
		voxelStride: orthoIntersectionNormal3d,
		nextBoundaryPosition: pipe(
			normBoundaryPosition,
			p => Vec3.add(
				p, Vec3.multiply(extendedVector, normalOffsetForNextPosition)
			),
			setVoxelNormalComponentFlipped(orthoIntersectionNormal3d)
		) 
	})
};

function traceVoxelLine(initialBoundaryPosition: Vector3, vector: Vector3, maxVoxelCount: number): Vector3[] {
	let voxels: Vector3[] = [[0, 0, 0]];
	let curBoundaryPosition = initialBoundaryPosition;
	for (let i = 0; i < maxVoxelCount; i++){
		const result = calculateNextLocalVoxelLocation(curBoundaryPosition, vector);
		if (isNone(result)) break;
		curBoundaryPosition = result.value.nextBoundaryPosition;
		voxels.push(
			Vec3.add(
				voxels[voxels.length - 1], 
				result.value.voxelStride
			)
		)
	}
	return voxels;
}





//equation ###

const boxSize = 20;

function createBoxVoxels(halfSize: number): Vector3[] {
	let voxels: Vector3[] = [];
	for (let x = -halfSize; x <= halfSize; x++){
		for (let y = -halfSize; y <= halfSize; y++) {
			for (let z = -halfSize; z <= halfSize; z++) {
				voxels.push([x, y, z]);
			}
		}
	}
	return voxels;
}

const equationPredicate = (equation: Morphism<Vector3, number>, maxDeviation: number) => {
	return (voxel: Vector3) => Math.abs(equation(voxel)) < maxDeviation;
}


function sineEquation(voxel: Vector3): number {
	const r = Math.hypot(voxel[0], voxel[2]);
	return 2.5 * Math.cos(r * 0.5) - voxel[1];
}

function testEquation(voxel: Vector3): number {
	// return voxel[1];
	return sineEquation(voxel);

	// const r = Math.hypot(voxel[0], voxel[2]);
	// return (7 / r) - voxel[1];

	return (voxel[0] * voxel[1] * voxel[2]) - 3;
}

function isVoxelOutsideBox(boxSize: number, voxel: Vector3): boolean {
	for (let i = 0; i < 3; i++){
		if (voxel[i] > boxSize || voxel[i] < -boxSize) return true;
	}
	return false;
};

function raycastEquationVoxel(
	ray: Ray, boxSize: number, equation: Morphism<Vector3, number>): Option<{ voxel: Vector3, localIntersection: Vector3 }> {
	
	const boundaryVoxelSize = boxSize * 2 + 1;
	const boundaryBoxIntersectionOpt = raycastVoxel(
		{ ...ray, origin: Vec3.divide(ray.origin, boundaryVoxelSize) }
	)([0, 0, 0]);
	if (isNone(boundaryBoxIntersectionOpt)) return none;
	const boundaryBoxIntersection = boundaryBoxIntersectionOpt.value;
	const boxEntryPoint = Vec3.multiply(boundaryBoxIntersection.localPoint, boundaryVoxelSize);
	const boxEntryVoxel = pipe(
		boxEntryPoint,
		p => Vec3.add(p, Vec3.multiply(boundaryBoxIntersection.faceNormal, -0.5)),
		map(Math.round)
	) as Vector3;
	const equationPred = equationPredicate(equation, 2);
	const initialBoundaryPosition = pipe(
		Vec3.subtract(boxEntryPoint, boxEntryVoxel), 
		p => Vec3.multiply(p, 2)
	) as Vector3;

	let currentVoxel = boxEntryVoxel;
	let currentBoundaryPoint = initialBoundaryPosition;
	let test: { voxel: Vector3, localIntersection: Vector3 }[] = [];
	for (let i = 0; i < 1000; i++){
		const result = calculateNextLocalVoxelLocation(
			currentBoundaryPoint, ray.vector
		);
		if (isNone(result)) return none;
		const { nextBoundaryPosition, voxelStride } = result.value;
		const nextVoxel = Vec3.add(currentVoxel, voxelStride);
		if (isVoxelOutsideBox(boxSize, nextVoxel)) return none;
		if (equationPred(nextVoxel)){
			return some({
				voxel: nextVoxel, 
				localIntersection: Vec3.divide(nextBoundaryPosition, 2)
			})
		}
		currentVoxel = nextVoxel;
		currentBoundaryPoint = nextBoundaryPosition;
	}
	return none;
}


//camera ###

type PerspectiveOrbitCamera = OrbitCamera & { settings: CameraSettings };

function orthoOrbitToPerspective(cam: PerspectiveOrbitCamera){
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
		planeWidthHalf: canvas.width / 2,
		planeHeightHalf: canvas.height / 2,
		zScale: 2000
	}
};

const backgroundColor = "#d4d3d2";

let lightDirection: Vector3 = Vec3.normalize([0.3, -1, -0.2])
const voxelColor: Vector3 = [255, 255, 255];

let voxels: Vector3[] = [
	[+boxSize, +boxSize, +boxSize],
	[-boxSize, +boxSize, +boxSize],
	[+boxSize, -boxSize, +boxSize],
	[-boxSize, -boxSize, +boxSize],
	[+boxSize, +boxSize, -boxSize],
	[-boxSize, +boxSize, -boxSize],
	[+boxSize, -boxSize, -boxSize],
	[-boxSize, -boxSize, -boxSize],
];

// let voxels: Vector3[] = pipe(
// 	createBoxVoxels(boxSize),
// 	filter(equationFilter(testEquation, 1))
// );

// let voxels: Vector3[] = [
// 	// [2, 0, 0], [4, 0, 0],
// 	// [0, 2, 0], [0, 4, 0],
// 	// [0, 0, 2], [0, 0, 4],
// 	...traceVoxelLine(
// 		[-1, 0, 0], [0, 1, 2].map(() => Math.random()) as Vector3, 20
// 	)
// ];

const sortVoxels = createVoxelArraySortFunctionWithCamPosition<Vector3, Vector3>(identity, 3);


const renderVoxel = (ctx: CanvasRenderingContext2D, camera: PerspectiveCamera) => (voxel: Vector3) => {
	ctx.save();
	for (const normal of voxelFaceNormals) {
		const curProjectionOpt = projectVoxelFace(ctx, camera, voxel, normal);
		if (isNone(curProjectionOpt)) continue;
		const brightness = interpolate(
			1, 0.3,
			Math.max(0, Vec3.dot(normal, lightDirection))
		);
		const adjustedColor = voxelColor.map(c => Math.round(c * brightness)) as Vector3;
		ctx.fillStyle = `rgb(${adjustedColor.join(",")})`;
		pathPolygon(ctx, curProjectionOpt.value);
		ctx.fill();
		// ctx.stroke();
	}
	ctx.restore();
};
function renderVoxels(ctx: CanvasRenderingContext2D, camera: PerspectiveCamera, voxels: Vector3[]) {
	const visibleVoxels = voxels.filter(voxel => !isVoxelBehindCamera(camera)(voxel));
	const sortedVoxels = sortVoxels(camera.transform.position, visibleVoxels);
	sortedVoxels.forEach(renderVoxel(ctx, camera));
}

function prepareAndRender(){
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



const render = () => {
	const perspectiveCam = orthoOrbitToPerspective(camera);
	Object.assign(ctx, {
		strokeStyle: "#3b3a39",
		lineWidth: 3,
		lineJoin: "round"
	} as Partial<CanvasRenderingContext2D>);
	renderVoxels(ctx, perspectiveCam, voxels);
};


function setupOrbitCameraControl(){
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



function setupRaycastingControl(){
	canvas.addEventListener("mousemove", e => {
		if (!e.ctrlKey) return;
		const perspectiveCam = orthoOrbitToPerspective(camera);
		const mousePoint: Vector2 = [e.offsetX, e.offsetY];
		const ray = createPerspectiveRayFromMouse(mousePoint, perspectiveCam);
		const hitVoxelOpt = raycastEquationVoxel(
			ray, boxSize, testEquation	
		);
		if (isNone(hitVoxelOpt)) return;
		const hitVoxel = hitVoxelOpt.value.voxel;
		if (voxels.some(v => Vec3.equal(v, hitVoxel))) return;
		voxels.push(hitVoxel);
		prepareAndRender();
	});
}

const main = () => {
	updateCanvasSize();
	onresize();
	setupRaycastingControl();
	setupOrbitCameraControl();
	prepareAndRender();
};
main();