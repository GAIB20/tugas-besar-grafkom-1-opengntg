class Shape {
  constructor(x, y, rgbaColor) {
    this.vertices = [];
    this.colors = rgbaColor;
    this.anchor = [x, y];
  }

  render() {
    throw new Error("Must be implemented");
  }

  print() {
    showLog("\nLine");
    showLog(`vertices: ${this.vertices}`);
    showLog(`colors: ${this.colors}`);
  }
}

class Line extends Shape {
  constructor(x, y, rgbaColor) {
    super(x, y, rgbaColor);
    this.vertices = [x, y, x + 0.5, y + 0.5];
  }

  render(program) {
    // Render vertices
    render(gl, program, "vertexPosition", this.vertices, 2);

    // Render colors
    render(gl, program, "vertexColor", this.colors, 4);

    for (let i = 0; i < this.vertices.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  }
}
