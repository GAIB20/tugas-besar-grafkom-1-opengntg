function helloTriangle() {
  // Get the referenced canvas
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    showError("Cannot get referenced canvas");
    return;
  }

  // Get WebGL Context
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    showError("This browser does not support WebGL 2.");
    return;
  }

  // Define line vertices and put it into a GPU buffer
  const triangleVertices = [
    // Top middle
    0.0, 0.5,
    // Bottom left
    -0.5, -0.5,
    // Bottom right
    0.5, -0.5,
  ];
  const triangleGeoCpuBuffer = new Float32Array(triangleVertices);

  // Bind the buffer to a GL Array Buffer in the GPU
  const triangleGeoBuffer = gl.createBuffer();
  if (!triangleGeoBuffer) {
    showError("Fail to create line geo buffer");
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleGeoCpuBuffer, gl.STATIC_DRAW);

  // Define the vertex shader
  const vertexShaderSourceCode = `#version 300 es
  precision mediump float;

  in vec2 vertexPosition;
  
  void main() {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
  }`;

  // Create then compile the vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSourceCode);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(vertexShader);
    showError(`Failed to compile vertex shader - ${compileError}`);
    return;
  }

  // Define the fragment shader
  const fragmentShaderSourceCode = `#version 300 es
  precision mediump float;
  
  out vec4 outputColor;

  void main() {
    outputColor = vec4(0.294, 0.0, 0.51, 1.0);
  }`;

  // Create then compile the fragment shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(fragmentShader);
    showError(`Failed to compile fragment shader - ${compileError}`);
    return;
  }

  // Create and link the program to see wether both fragments are compatible with each other
  const helloTriangleProgram = gl.createProgram();
  gl.attachShader(helloTriangleProgram, vertexShader);
  gl.attachShader(helloTriangleProgram, fragmentShader);
  gl.linkProgram(helloTriangleProgram);
  if (!gl.getProgramParameter(helloTriangleProgram, gl.LINK_STATUS)) {
    const linkError = gl.getProgramInfoLog(helloTriangleProgram);
    showError(`Failed to link shaders - ${linkError}`);
    return;
  }

  // Get the vertex attribute location
  const vertexPositionAttributeLocation = gl.getAttribLocation(
    helloTriangleProgram,
    "vertexPosition"
  );
  if (vertexPositionAttributeLocation < 0) {
    showError("Failed to get attrib location for vertexPosition");
    return;
  }

  // Merge the shaded pixel fragment with the existing output image
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  // Clear the color and depth buffer
  gl.clearColor(0.08, 0.08, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Rasterizer
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Set GPU program (vertex + fragment shader pair)
  gl.useProgram(helloTriangleProgram);
  gl.enableVertexAttribArray(vertexPositionAttributeLocation);

  // Input assembler
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
  gl.vertexAttribPointer(
    // index
    vertexPositionAttributeLocation,
    // size
    2,
    // type
    gl.FLOAT,
    // normalize
    false,
    // stride
    2 * Float32Array.BYTES_PER_ELEMENT,
    // offset
    0
  );

  // Draw call
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
