// Load shader from shader source code
function loadShader(type, shaderSourceCode) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSourceCode);
  gl.compileShader(shader);

  // Throw error if failed to compile shader
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(shader);
    showError(`Failed to compile vertex shader - ${compileError}`);
    return;
  }

  return shader;
}

// Create a shader program
function createShaderProgram(vertexShaderSource, fragmentShaderSource) {
  // Load the vertex shader
  const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);

  // Load the fragment shader
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Create and link the program to see wether both fragments are compatible with each other
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkError = gl.getProgramInfoLog(program);
    showError(`Failed to link shaders - ${linkError}`);
    return;
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

// Draw the shape on the canvas
function draw(program) {
  // Bind the buffer to a GL Array Buffer in the GPU
  const lineGeoCpuBuffer = new Float32Array(activeVertices);
  const lineGeoBuffer = gl.createBuffer();
  if (!lineGeoBuffer) {
    showError("Fail to create line geo buffer");
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, lineGeoBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, lineGeoCpuBuffer, gl.STATIC_DRAW);

  // Get the vertex attribute location
  const vertexPositionAttributeLocation = gl.getAttribLocation(
    program,
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
  gl.clearColor(...canvasColor);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Rasterizer
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Set GPU program (vertex + fragment shader pair)
  gl.useProgram(program);
  gl.enableVertexAttribArray(vertexPositionAttributeLocation);

  // Input assembler
  gl.bindBuffer(gl.ARRAY_BUFFER, lineGeoBuffer);
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
  gl.drawArrays(gl.LINES, 0, 2);
}
