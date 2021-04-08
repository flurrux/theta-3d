
/*
	description:
	cast a ray from the camera into the scene. 
	if it intersects the "equation-box", there will be an intersection line. 
	we have an equation which is represented by a function f from x, y, z to a number. 
	f(x, y, z) => number
	we want to visualize the set of points where this function becomes zero. 
	by the way, any equation involving x, y, z can be turned into a function like this. 
	simply subtract one side from the other and voila. 
	we want to find the closest point on the line that satisfies the equation, so is zero. 
	each point on the intersection line corresponds to a number by this function. 
	if 0 is the point where the line starts and 1 is where is ends, then we have a function graph. 
	then we can simply search for the first zero on this graph (watch out for infinities!).
	if we find one, then the next step is to calculate a normal vector to the surface at that point. 
	why is there even a surface? i have no proof but it feels like any equation that combines 3 numbers 
	into a single number, reduces the degrees of freedom by 1 and thus leads to a surface. 
	for the surface normal we need the derivatives of the function. 
	there will be at most 3 derivatives (at most because the derivative does not exist necessarily), 
	one for x, one for y and one for z. 
	for very small deviations dx, dy, dz, the deviation in the function output is simply 
	dx * px + dy * px + dz * pz
	where px, py, pz are the partial derivatives of f. 
	we are interested in small vectors that keep the function zero. 
	those vectors define the surface in the neighbourhood of our point. 
	and ultimately we want to find a vector that is perpendicular to that surface
	dx * px + dy * px + dz * pz = 0.
	this is a dot product between vectors (dx, dy, dz) and (px, py, pz), 
	therefore if (dx, dy, dz) satisfies the equation, it lies on the surface and is perpendicular to the 
	vector (px, py, pz). therefore (px, py, pz) must be the surface normal. 
	we then use the surface normal to compute the shading of the pixel and that's it. 
*/

import { isNone, none, Option, some } from "fp-ts/lib/Option";
import { Morphism, Vector3 } from "../lib/types";
import { Ray, raycastVoxel } from "./voxel/raycasting";
import * as Vec3 from "../lib/vec3";

type EquationFunction = (point: Vector3) => Option<number>;
type EquationDerivativeFunction = (point: Vector3) => [Option<number>, Option<number>, Option<number>];
type GraphFunction = Morphism<number, Option<number>>;

export function getIntersectionLine(boxSize: number, ray: Ray): Option<[Vector3, Vector3]> {
	const voxelSize = boxSize * 4 + 2;
	const scaledRay: Ray = {
		...ray,
		origin: Vec3.multiply(ray.origin, 1 / voxelSize)
	};
	const isec1Opt = raycastVoxel(scaledRay)([0, 0, 0]);
	if (isNone(isec1Opt)) return none;
	const isec1 = isec1Opt.value;
	const oppositeRay: Ray = {
		origin: Vec3.add(
			scaledRay.origin, 
			Vec3.multiply(
				Vec3.normalize(scaledRay.vector),
				isec1.distance + Math.sqrt(3)
			)
		),
		vector: Vec3.multiply(scaledRay.vector, -1)
	};
	const isec2Opt = raycastVoxel(oppositeRay)([0, 0, 0]);
	if (isNone(isec2Opt)) return none;
	const isec2 = isec2Opt.value;
	return some([
		Vec3.multiply(isec1.localPoint, voxelSize),
		Vec3.multiply(isec2.localPoint, voxelSize)
	]);
}

type Sign = -1 | 0 | 1;
function sign(n: number): Sign {
	return Math.sign(n) as Sign;
}

//in the range 0 to 1
export function findFirstZero(func: GraphFunction): Option<number> {
	const dx = 0.05;
	let prevSign: Option<Sign> = none;
	for (let x = 0; x <= 1; x += dx){
		const curValOpt = func(x);
		if (isNone(curValOpt)) continue;
		const curVal = curValOpt.value;
		const curSign = sign(curVal);
		if (curSign === 0) return some(x);
		if (isNone(prevSign)){
			prevSign = some(curSign);
			continue;
		}
		if (curSign !== prevSign.value){
			const [negX, posX] = prevSign.value === -1 ? [x - dx, x] : [x, x - dx];
			return findZeroByBisection(negX, posX, func);
		}
	}
	return none;
}

function findZeroByBisection(negX: number, posX: number, func: GraphFunction): Option<number> {
	let mX = negX;
	for (let i = 0; i < 20; i++){
		mX = (negX + posX) / 2;
		const mYOpt = func(mX);
		if (isNone(mYOpt)) return none;
		const mY = mYOpt.value;
		if (mY === 0) return some(mX);
		if (mY > 0) posX = mX;
		else negX = mX;
	}
	return some(mX);
}

function interpolateLine(line: [Vector3, Vector3], t: number): Vector3 {
	return Vec3.interpolate(line[0], line[1], t)
}

function createLineFunction(equationFunc: EquationFunction, line: [Vector3, Vector3]): GraphFunction {
	return (t: number) => equationFunc(interpolateLine(line, t))
}

export const raycastSurfaceNormal = (
	boxSize: number,
	equationFunc: EquationFunction, 
	equationDeriv: EquationDerivativeFunction) =>  
		(ray: Ray): Option<Vector3> => {
	
	const lineOpt = getIntersectionLine(boxSize, ray);
	if (isNone(lineOpt)) return none;
	const lineFunc = createLineFunction(equationFunc, lineOpt.value);
	const firstZeroOpt = findFirstZero(lineFunc);
	if (isNone(firstZeroOpt)) return none;
	const intersectionPoint = interpolateLine(lineOpt.value, firstZeroOpt.value);
	const deriv = equationDeriv(intersectionPoint);
	if (isNone(deriv[0]) || isNone(deriv[1]) || isNone(deriv[2])) return none;
	const derivVector = [deriv[0].value, deriv[1].value, deriv[2].value] as Vector3;
	return some(Vec3.normalize(Vec3.multiply(derivVector, +1)));
}