
var vertexShader = `
	uniform vec3 ray00;
	uniform vec3 ray10;
	uniform vec3 ray01;
	uniform vec3 ray11;
	varying vec3 ray;

	void main() {
		vec2 t = gl_Vertex.xy * 0.5 + 0.5;
		ray = mix(mix(ray00, ray10, t.x), mix(ray01, ray11, t.x), t.y);
		gl_Position = gl_Vertex;
	}
`;

var fragmentShader = `
	const float INFINITY = 1.0e9;
	const vec3 INFINITE_VEC3 = vec3(INFINITY, INFINITY, INFINITY);
	uniform vec3 eye;
	varying vec3 ray;

	bool isVec3None(vec3 v){
		return v.x > 1.0e8;
	}

	bool isNumNone(float n){
		return n > 1.0e8;
	}




	/* voxel raycasting */


	struct DecomposedVec3 {
		vec3 axisComponent;
		vec3 planeComponent;
	};

	DecomposedVec3 decompose(vec3 v, vec3 axis) {
		vec3 alongAxis = axis * dot(v, axis);
		return DecomposedVec3(alongAxis, v - alongAxis);
	}

	vec3 raycastPlane(vec3 origin, vec3 vector, vec3 planeOrigin, vec3 normal) {
		vec3 relOrigin = origin - planeOrigin;
		DecomposedVec3 originCombination = decompose(relOrigin, normal);
		DecomposedVec3 vectorCombination = decompose(vector, normal);
		if (dot(originCombination.axisComponent, normal) <= 0.0) return INFINITE_VEC3;
		if (dot(vectorCombination.axisComponent, normal) >= 0.0) return INFINITE_VEC3;

		vec3 planeStartPoint = relOrigin - originCombination.axisComponent;
		float intersectionScale = length(originCombination.axisComponent) / length(vectorCombination.axisComponent);
		vec3 intersectionPoint = planeOrigin + planeStartPoint + vectorCombination.planeComponent * intersectionScale;
		return intersectionPoint;
	}

	bool isPointOutsideVoxel(float s, vec3 p) {
		return p.x < -s || p.x > +s || p.y < -s || p.y > +s || p.z < -s || p.z > +s;
	}

	vec3 raycastVoxelFace(vec3 rayOrigin, vec3 rayVector, float sideLengthHalf, vec3 normal) {
		vec3 faceOrigin = normal * sideLengthHalf;
		vec3 planeIntersection = raycastPlane(
			rayOrigin, rayVector, faceOrigin, normal
		);
		if (isVec3None(planeIntersection)) return INFINITE_VEC3;
		if (isPointOutsideVoxel(sideLengthHalf, planeIntersection)) return INFINITE_VEC3;
		return planeIntersection;
	}

	vec3 raycastCenterVoxel(vec3 rayOrigin, vec3 rayVector, float sideLengthHalf) {
		for (int i = 0; i < 3; i++){
			for (int j = 0; j < 2; j++){
				vec3 axis = vec3(0.0, 0.0, 0.0);
				if (j == 0) axis[i] = -1.0;
				else if (j == 1) axis[i] = 1.0;
	
				vec3 curResult = raycastVoxelFace(rayOrigin, rayVector, sideLengthHalf, axis);
				if (!isVec3None(curResult)){
					return curResult;
				}
			}
		}
		return INFINITE_VEC3;
	}

	struct Line {
		vec3 point1;
		vec3 point2;
	};
	const Line noneLine = Line(INFINITE_VEC3, INFINITE_VEC3);
	bool isLineNone(Line line){
		return isVec3None(line.point1);
	}

	vec3 interpolateLine(Line line, float t) {
		return mix(line.point1, line.point2, t);
	}

	Line getCenterVoxelIntersectionLine(vec3 rayOrigin, vec3 rayVector, float sideLengthHalf) {
		vec3 isec1 = raycastCenterVoxel(rayOrigin, rayVector, sideLengthHalf);
		if (isVec3None(isec1)) return noneLine;
		float dist1 = distance(rayOrigin, isec1);

		vec3 oppositeRayOrigin = rayOrigin + rayVector * (dist1 + 1000.0 * sideLengthHalf);
		vec3 isec2 = raycastCenterVoxel(oppositeRayOrigin, -1.0 * rayVector, sideLengthHalf);
		if (isVec3None(isec2)) return noneLine;

		return Line(isec1, isec2);
	}

	
	/* equation */

	/* 3D sine wave */

	const float amplitude = 0.4;
	const float frequency = 5.0;

	float equationFunction(vec3 p){
		float r = length(p.xz);
		return amplitude * cos(r * frequency) - p.y;
	}
	vec3 equationDerivativeFunction(vec3 p){
		float rSqrd = p.x * p.x + p.z * p.z;
		float r = sqrt(rSqrd);
		float s1 = -amplitude / rSqrd * sin(r * frequency);
		return vec3(s1 * p.x, -1.0, s1 * p.z);
	}



	/* sphere */	
	/*
	const float sphereRadiusSqrd = 4.0;
	float equationFunction(vec3 p){
		float r = length(p);
		return r * r - sphereRadiusSqrd;
	}
	vec3 equationDerivativeFunction(vec3 p){
		return vec3(2.0 * p.x, 2.0 * p.y, 2.0 * p.z);
	}
	*/




	float equationValueByLine(Line line, float t){
		return equationFunction(interpolateLine(line, t));
	}

	float findZeroByBisection(float negX, float posX, Line line) {
		float mX = negX;
		for (int i = 0; i < 20; i++){
			mX = (negX + posX) / 2.0;
			float mY = equationValueByLine(line, mX);
			if (isNumNone(mY)) return INFINITY;
			if (mY == 0.0) return mX;
			if (mY > 0.0) posX = mX;
			else negX = mX;
		}
		return mX;
	}
	
	float findFirstZero(Line line) {
		float dx = 0.025;
		float prevSign = 0.0;
		for (int i = 0; i < 40; i++){
			float x = float(i) * dx;
			float curVal = equationValueByLine(line, x);
			if (!isNumNone(curVal)){
				float curSign = sign(curVal);
				if (curSign == 0.0) return x;
				if (x == 0.0){
					prevSign = curSign;
				}
				else if (curSign != prevSign){
					if (prevSign == -1.0){
						return findZeroByBisection(x - dx, x, line);
					}
					else {
						return findZeroByBisection(x, x - dx, line);
					}
				}
			}
		}
		return INFINITY;
	}

	
	vec3 raycastEquation(vec3 rayOrigin, vec3 rayVector, float boxSize) {
		Line line = getCenterVoxelIntersectionLine(rayOrigin, rayVector, boxSize);
		if (isLineNone(line)) return INFINITE_VEC3;
		float firstZero = findFirstZero(line);
		if (isNumNone(firstZero)) return INFINITE_VEC3;
		vec3 intersectionPoint = interpolateLine(line, firstZero);
		vec3 deriv = equationDerivativeFunction(intersectionPoint);
		return normalize(deriv);
	}
	


	


	void main() {
		vec3 origin = eye;
		
		vec3 hitNormal = raycastEquation(origin, ray, 3.0);

		if (isVec3None(hitNormal)){
			gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
		}
		else {
			float brightness = dot(1.0 * hitNormal, normalize(vec3(0.2, -1.0, 0.0)));
			brightness = mix(0.3, 0.8, brightness);
			gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * brightness;
			/*gl_FragColor = vec4(hitNormal, 1.0);*/
		}
	}
`;