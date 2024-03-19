// == Selectors ===========================================================
const canvas = document.querySelector("canvas");
const toolButtons = document.querySelectorAll(".tool-btn");
const canvasColorInput = document.querySelector("#canvas-color-input");
const shapeColorInput = document.querySelector("#shape-color-input");

// == State variables =====================================================
let gl = undefined;
let canvasColor = [0.08, 0.08, 0.08, 1.0];
let selectedTool = "cursor";
let shapeColor = [0.9, 0.9, 0.9, 1.0];
let isDrawing = false;
const shapes = {
  lines: [],
};

// == WebGL state =========================================================
// Clear the color and depth buffer
function clear() {
  gl.clearColor(...canvasColor);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Initialize WebGL
try {
  gl = canvas.getContext("webgl2");
  if (!gl) {
    throw Error("This browser does not support WebGL 2.");
  }

  // Merge the shaded pixel fragment with the existing output image
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  // Rasterizer
  gl.viewport(0, 0, canvas.width, canvas.height);

  clear();
} catch (error) {
  showError(`Initialize canvas failed - ${error}`);
}

// == Select shape event handler ==========================================
for (let i = 0; i < toolButtons.length; i++) {
  toolButtons[i].addEventListener("click", () => {
    if (selectedTool === toolButtons[i].id) {
      toolButtons[i].classList.remove("active");
    } else {
      selectedTool = toolButtons[i].id;
      for (let j = 0; j < toolButtons.length; j++) {
        toolButtons[j].classList.remove("active");
      }
      toolButtons[i].classList.add("active");
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
  if (selectedTool === "cursor" || selectedTool === "canvas" || isDrawing) {
    return;
  }

  if (selectedTool === "line") {
    const { x, y } = getMousePos(e);
    shapes.lines.push(new Line(x, y, shapeColor));
  }

  isDrawing = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (selectedTool === "cursor" || selectedTool === "canvas" || !isDrawing) {
    return;
  }

  if (selectedTool === "line") {
    const { x, y } = getMousePos(e);
    shapes.lines[shapes.lines.length - 1].setEndVertex(x, y);
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (selectedTool === "cursor" || selectedTool === "canvas" || !isDrawing) {
    return;
  }

  isDrawing = false;
});
