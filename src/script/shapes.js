class Shape {
  constructor(x, y, rgbaColor) {
    this.vertexBuffer = [];
    this.colors = [];
    this.anchor = [x, y];
  }

  render() {
    throw new Error("Must be implemented");
  }

  print() {
    showLog("\nLine");
    showLog(`vertexBuffer: ${this.vertexBuffer}`);
    showLog(`colors: ${this.colors}`);
  }
}

class Line extends Shape {
  constructor(x, y, rgbaColor) {
    super(x, y, rgbaColor);
    this.vertexBuffer = [x, y, x + 0.5, y + 0.5];
    this.colors = [...rgbaColor, ...rgbaColor];
  }

  render(program) {
    // Render vertex buffer
    render(gl, program, "vertexPosition", this.vertexBuffer, 2);

    // Render colors
    render(gl, program, "vertexColor", this.colors, 4);

    for (let i = 0; i < this.vertexBuffer.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  }
}
