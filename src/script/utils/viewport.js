// Normalize coordinate unit from pixel, to canvas unit
function normalizeCoor(x, y) {
  canvasXCenter = canvas.width / 2;
  canvasYCenter = canvas.height / 2;

  n_x = (x - canvasXCenter) / canvasXCenter;
  n_y = (canvasYCenter - y) / canvasYCenter;

  return { n_x, n_y };
}

// Get current mouse position relevant to the canvas
function getMousePos(e) {
  const pos = canvas.getBoundingClientRect();

  const x_pix = e.clientX - pos.x;
  const y_pix = e.clientY - pos.y;

  const { n_x: x, n_y: y } = normalizeCoor(x_pix, y_pix);

  return { x, y };
}
