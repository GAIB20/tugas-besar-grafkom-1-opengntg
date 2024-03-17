// Canvas
const canvas = document.querySelector("canvas");
if (!canvas) {
  showError("Cannot get referenced canvas");
}

// Get coordinate of the cursor relevant to the canvas.
canvas.addEventListener("click", (e) => {
  let { n_x, n_y } = getMousePos(e);
  showLog(`[${n_x}, ${n_y}]`);
});

// Error box
const errorBoxDiv = document.querySelector("#error-box");

// Log box
const logBoxDiv = document.querySelector("#log-box");
