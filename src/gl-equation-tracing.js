var angleX = 30;
var angleY = 10;
var gl = GL.create();
var mesh = GL.Mesh.plane();
var shader = new GL.Shader(vertexShader, fragmentShader);

gl.onmousemove = function (e) {
	if (e.dragging) {
		angleY += e.deltaX;
		angleX += e.deltaY;
		angleX = Math.max(-90, Math.min(90, angleX));
		gl.ondraw();
	}
};

gl.ondraw = function () {
	// Camera setup
	gl.loadIdentity();
	gl.translate(0, 0, -10);
	gl.rotate(angleX, 1, 0, 0);
	gl.rotate(angleY, 0, 1, 0);

	// Get corner rays
	var w = gl.canvas.width;
	var h = gl.canvas.height;
	var tracer = new GL.Raytracer();
	shader.uniforms({
		eye: tracer.eye,
		ray00: tracer.getRayForPixel(0, h),
		ray10: tracer.getRayForPixel(w, h),
		ray01: tracer.getRayForPixel(0, 0),
		ray11: tracer.getRayForPixel(w, 0)
	});

	// Trace the rays
	shader.draw(mesh);

	// Draw debug output to show that the raytraced scene lines up correctly with
	// the rasterized scene
	gl.color(0, 0, 0, 0.5);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.begin(gl.LINES);
	for (var s = 4, i = -s; i <= s; i++) {
		gl.vertex(-s, 0, i);
		gl.vertex(s, 0, i);
		gl.vertex(i, 0, -s);
		gl.vertex(i, 0, s);
	}
	gl.end();
	gl.disable(gl.BLEND);
};

gl.fullscreen();