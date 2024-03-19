// App

// Initialize canvas
try {
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    throw Error("This browser does not support WebGL 2.");
  }

  // Clear the color and depth buffer
  gl.clearColor(0.08, 0.08, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
} catch (error) {
  showError(`Initialize canvas failed - ${error}`);
}
