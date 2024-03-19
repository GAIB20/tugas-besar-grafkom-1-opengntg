// Selected shape state
let selectedShape = undefined;
const shapeButtonDiv = document.querySelector(".shape-btn-container");
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

// Shapes exist in the canvas
const shapes = [];

// Drawing state
let isDrawing = false;

const canvas = document.querySelector("canvas");

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
