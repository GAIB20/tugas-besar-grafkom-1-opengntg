// TEST: line drawing testing
let isStart = true;
let lineVertices = [];
// End of test

// Canvas
const canvas = document.querySelector("canvas");
if (!canvas) {
  showError("Cannot get referenced canvas");
}

// Get coordinate of the cursor relevant to the canvas.
canvas.addEventListener("click", (e) => {
  let { n_x, n_y } = getMousePos(e);

  // TEST: line drawing testing
  // showLog(`[${n_x}, ${n_y}]`);

  lineVertices.push(n_x);
  lineVertices.push(n_y);

  if (isStart) {
    isStart = false;
  } else {
    showLog("Draw!");
    try {
      helloTriangle(lineVertices);
    } catch (err) {
      showError(`Uncaught JavaScript Exception: ${err}`);
    } finally {
      isStart = true;
      lineVertices = [];
    }
  }
  // End of test
});

// Error box
const errorBoxDiv = document.querySelector("#error-box");

// Log box
const logBoxDiv = document.querySelector("#log-box");
