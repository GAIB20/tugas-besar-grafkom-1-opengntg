class Shape {
  constructor(id) {
    this.id = id;
    this.numOfVertex = 0;
    this.vertexBuffer = [];
    this.vertexBufferBase = [];
    this.vertexPx = [];
    this.rotation = 0;
    this.rotationBase = 0;
    this.width = 0;
    this.height = 0;
    this.colorBuffer = [];
    this.anchor = [];
  }

  setEndVertex(x, y, xPx, yPx) {
    const lastVertexIdx = this.numOfVertex - 1;
    this.vertexBuffer[lastVertexIdx * 2] = x;
    this.vertexBuffer[lastVertexIdx * 2 + 1] = y;
    this.vertexPx[lastVertexIdx * 2 + 1] = xPx;
    this.vertexPx[lastVertexIdx * 2 + 1] = yPx;
    this.updateVertexBase();
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  setVertexX(i, x, xPx) {
    this.vertexBuffer[i * 2] = x;
    this.vertexPx[i * 2] = xPx;
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  setVertexY(i, y, yPx) {
    this.vertexBuffer[i * 2 + 1] = y;
    this.vertexPx[i * 2 + 1] = yPx;
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  setWidth() {
    throw new Error("Must be implemented");
  }

  setColor(i, rgba) {
    this.colorBuffer[i * 4] = rgba[0];
    this.colorBuffer[i * 4 + 1] = rgba[1];
    this.colorBuffer[i * 4 + 2] = rgba[2];
    this.colorBuffer[i * 4 + 3] = rgba[3];
  }

  getId() {
    return this.id;
  }

  getNumOfVertex() {
    return this.numOfVertex;
  }

  getVertexX(i) {
    return this.vertexBuffer[i * 2];
  }

  getVertexY(i) {
    return this.vertexBuffer[i * 2 + 1];
  }

  getVertexXPx(i) {
    return this.vertexPx[i * 2];
  }

  getVertexYPx(i) {
    return this.vertexPx[i * 2 + 1];
  }

  getVertexXBase(i) {
    return this.vertexBufferBase[i * 2];
  }

  getVertexYBase(i) {
    return this.vertexBufferBase[i * 2 + 1];
  }

  getRotation() {
    return this.rotation;
  }

  getColor(i) {
    return this.colorBuffer.slice(i * 4, i * 4 + 4);
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getAnchor() {
    return this.anchor;
  }

  translateX(i, diffX) {
    const finalX = this.vertexBufferBase[i * 2] + diffX;
    this.setVertexX(i, finalX, denormalizeX(finalX));
    this.updateAnchor();
  }

  translateY(i, diffY) {
    const finalY = this.vertexBufferBase[i * 2 + 1] + diffY;
    this.setVertexY(i, finalY, denormalizeY(finalY));
    this.updateAnchor();
  }

  rotate(rad) {
    const cos = Math.cos(rad - degreeToRadian(this.rotation));
    const sin = Math.sin(rad - degreeToRadian(this.rotation));
    const anchorPx = [
      denormalizeX(this.anchor[0]),
      denormalizeY(this.anchor[1]),
    ];

    for (let i = 0; i < this.getNumOfVertex(); i++) {
      const xDist = this.getVertexXPx(i) - anchorPx[0];
      const yDist = this.getVertexYPx(i) - anchorPx[1];

      const finalX = xDist * cos - yDist * sin + anchorPx[0];
      const finalY = xDist * sin + yDist * cos + anchorPx[1];

      this.setVertexX(i, normalizeX(finalX), finalX);
      this.setVertexY(i, normalizeY(finalY), finalY);
    }

    this.rotation = radianToDegree(rad);
    this.updateVertexBase();
  }

  updateVertexBase() {
    for (let i = 0; i < this.vertexBuffer.length; i += 2) {
      this.vertexBufferBase[i] = this.vertexBuffer[i];
      this.vertexBufferBase[i + 1] = this.vertexBuffer[i + 1];
    }
  }

  updateWidth() {
    throw new Error("Must be implemented");
  }

  updateHeight() {
    throw new Error("Must be implemented");
  }

  updateAnchor() {
    let tempX = 0;
    let tempY = 0;
    for (let i = 0; i < this.vertexBuffer.length; i += 2) {
      tempX += this.vertexBuffer[i];
      tempY += this.vertexBuffer[i + 1];
    }
    this.anchor[0] = tempX / this.numOfVertex;
    this.anchor[1] = tempY / this.numOfVertex;
  }

  render() {
    throw new Error("Must be implemented");
  }

  print() {
    throw new Error("Must be implemented");
  }
}

class Line extends Shape {
  constructor(id, x, y, xPx, yPx, rgbaColor) {
    super(id);

    this.vertexBuffer = [x, y, x, y];
    this.vertexBufferBase = [x, y, x, y];
    this.vertexPx = [xPx, yPx, xPx, yPx];
    this.colorBuffer = [...rgbaColor, ...rgbaColor];
    this.numOfVertex = this.vertexBuffer.length / 2;
    this.anchor = [x, y];
  }

  render(program) {
    // Render vertex buffer
    render(gl, program, "vertexPosition", this.vertexBuffer, 2);

    // Render colorBuffer
    render(gl, program, "vertexColor", this.colorBuffer, 4);

    // Draw the line
    for (let i = 0; i < this.vertexBuffer.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  }

  setWidth(newWidth) {
    const halfWidth = this.width / 2;
    const halfDiff = (newWidth - this.width) / 2;

    const anchorPx = [
      denormalizeX(this.anchor[0]),
      denormalizeY(this.anchor[1]),
    ];

    const initDiagonal = this.width / 2;
    const finalDiagonal = halfWidth + halfDiff;

    for (let i = 0; i < this.numOfVertex; i++) {
      const initHorizontal = this.getVertexXPx(i) - anchorPx[0];
      const initVertical = this.getVertexYPx(i) - anchorPx[1];

      const ratioHorizontal = initHorizontal / initDiagonal;
      const ratioVertical = initVertical / initDiagonal;

      const finalHorizontal = finalDiagonal * ratioHorizontal + anchorPx[0];
      const finalVertical = finalDiagonal * ratioVertical + anchorPx[1];

      this.setVertexX(i, normalizeX(finalHorizontal), finalHorizontal);
      this.setVertexY(i, normalizeY(finalVertical), finalVertical);
    }

    this.updateWidth();
    this.updateVertexBase();
  }

  updateWidth() {
    this.width = distance2Vec(
      this.getVertexXPx(0),
      this.getVertexYPx(0),
      this.getVertexXPx(1),
      this.getVertexYPx(1)
    );
  }

  updateHeight() {
    this.height = 0;
  }

  print() {
    showLog("\nLine");
    showLog(`id: ${this.id}`);
    showLog(`numOfVertex: ${this.numOfVertex}`);
    showLog(`colorBuffer: ${this.colorBuffer}`);
    showLog(`vertexBuffer: ${this.vertexBuffer}`);
    showLog(`vertexPx: ${this.vertexPx}`);
    showLog(`vertexBufferBase: ${this.vertexBufferBase}`);
    showLog(`Width: ${this.width}`);
    showLog(`Height: ${this.height}`);
    showLog(`Rotation: ${this.rotation}`);
    showLog(`RotationBase: ${this.rotationBase}`);
    showLog(`Anchor: ${this.anchor}`);
  }
}

class Polygon extends Shape {
  constructor(id, x, y, xPx, yPx, rgbaColor) {
    super(id);

    this.vertexBuffer = [x, y, x, y];
    this.vertexBufferBase = [x, y, x, y];
    this.vertexPx = [xPx, yPx, xPx, yPx];
    this.colorBuffer = [...rgbaColor, ...rgbaColor];
    this.numOfVertex = 2;
    this.anchor = [x, y];
  }

  updateWidth() {
    this.width = 0;
  }

  updateHeight() {
    this.height = 0;
  }

  isClosed() {
    if (this.numOfVertex < 3) {
      return;
    }
    const lastVertexIdx = this.numOfVertex - 1;
    const dx = this.getVertexX(0) - this.getVertexX(lastVertexIdx);
    const dy = this.getVertexY(0) - this.getVertexY(lastVertexIdx);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 0.05;
  }

  addVertex(x, y, xPx, yPx, rgbaColor) {
    this.vertexBuffer.push(x, y);
    this.vertexBufferBase.push(x, y);
    this.vertexPx.push(xPx, yPx);
    this.colorBuffer.push(...rgbaColor);
    this.numOfVertex++;
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  closePolygon() {
    this.vertexBuffer.pop();
    this.vertexBuffer.pop();
    this.vertexBufferBase.pop();
    this.vertexBufferBase.pop();
    this.vertexPx.pop();
    this.vertexPx.pop();
    this.colorBuffer.pop();
    this.colorBuffer.pop();
    this.colorBuffer.pop();
    this.colorBuffer.pop();
    this.numOfVertex -= 1;
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  render(program) {
    // Render vertex buffer
    render(gl, program, "vertexPosition", this.vertexBuffer, 2);

    // Render colorBuffer
    render(gl, program, "vertexColor", this.colorBuffer, 4);

    // Draw the line
    if (this.numOfVertex > 2) {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.numOfVertex);
    } else {
      for (let i = 0; i < this.numOfVertex; i += 2) {
        gl.drawArrays(gl.LINES, i, 2);
      }
    }
  }
}
