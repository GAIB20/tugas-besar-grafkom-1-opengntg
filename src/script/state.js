// == Selectors ===========================================================
const canvas = document.querySelector("canvas");
const shapeButtonDiv = document.querySelector(".shape-btn-container");
const canvasColorInput = document.getElementById("canvas-color-input");

// == State variables =====================================================
let gl = undefined;
let selectedShape = undefined;
let canvasColor = [0.08, 0.08, 0.08, 1.0];
const shapes = [];
let isDrawing = false;

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
    if (selectedShape === shapeButtonDiv.children[i].id) {
      shapeButtonDiv.children[i].classList.remove("active");
      selectedShape = undefined;
      return;
    } else {
      selectedShape = shapeButtonDiv.children[i].id;
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

// == Drawing state handler ===============================================
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  showLog("User started drawing");
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    showLog("User currently drawing");
  }
});

canvas.addEventListener("mouseup", (e) => {
  isDrawing = false;
  showLog("User stopped drawing");
});
