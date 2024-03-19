// == Selectors ===========================================================
const canvas = document.querySelector("canvas");
const shapeButtonDiv = document.querySelector(".shape-btn-container");
const canvasColorInput = document.querySelector("#canvas-color-input");
const shapeColorInput = document.querySelector("#shape-color-input");

// == State variables =====================================================
let gl = undefined;
let canvasColor = [0.08, 0.08, 0.08, 1.0];
const shapes = [];
let selectedShapeMode = "line";
let shapeColor = [0.9, 0.9, 0.9, 1.0];
let isDrawing = false;
let activeVertices = [];

// == Initialize WebGL state ==============================================
try {
  gl = canvas.getContext("webgl2");
  if (!gl) {
    throw Error("This browser does not support WebGL 2.");
  }

  // Clear the color and depth buffer
  gl.clearColor(...canvasColor);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
} catch (error) {
  showError(`Initialize canvas failed - ${error}`);
}

// == Select shape event handler ==========================================
for (let i = 0; i < shapeButtonDiv.children.length; i++) {
  shapeButtonDiv.children[i].addEventListener("click", () => {
    if (selectedShapeMode === shapeButtonDiv.children[i].id) {
      shapeButtonDiv.children[i].classList.remove("active");
      selectedShapeMode = undefined;
      return;
    } else {
      selectedShapeMode = shapeButtonDiv.children[i].id;
      for (let j = 0; j < shapeButtonDiv.children.length; j++) {
        shapeButtonDiv.children[j].classList.remove("active");
      }
      shapeButtonDiv.children[i].classList.add("active");
    }
  });
}

// == Change canvas background color handler ==============================
canvasColorInput.addEventListener("input", () => {
  canvasColor = hexToRGBA(canvasColorInput.value);
  gl.clearColor(...canvasColor);
  gl.clear(gl.COLOR_BUFFER_BIT);
});

// == Change shape color handler ==========================================
shapeColorInput.addEventListener("input", () => {
  shapeColor = hexToRGBA(shapeColorInput.value);
});

// == Drawing state handler ===============================================
canvas.addEventListener("mousedown", (e) => {
  if (!selectedShapeMode) {
    return;
  }

  if (selectedShapeMode === "line") {
    const { x, y } = getMousePos(e);
    activeVertices = [x, y, x, y];
    drawLine(vertexShader, createLineShader(shapeColor));
  }

  isDrawing = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) {
    return;
  }

  if (selectedShapeMode === "line") {
    const { x, y } = getMousePos(e);
    activeVertices[2] = x;
    activeVertices[3] = y;
    drawLine(vertexShader, createLineShader(shapeColor));
    return;
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (!selectedShapeMode) {
    return;
  }

  if (selectedShapeMode === "line") {
    activeVertices = [];
  }

  isDrawing = false;
});
