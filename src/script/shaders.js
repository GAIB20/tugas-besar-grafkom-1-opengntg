// Vertex shader
const vertexShader = `#version 300 es
  precision mediump float;

  in vec2 vertexPosition;
  
  void main() {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
  }`;

function createLineShader(colorRGBA) {
  return `#version 300 es
  precision mediump float;

  out vec4 outputColor;

  void main() {
    outputColor = vec4(${colorRGBA});
  }`;
}
