// ── RESIZE CANVAS TO FIT WINDOW ────────────────────────────
function resize() {
  const maxWidth  = Math.min(window.innerWidth - 40, 700);
  CELL            = Math.floor(maxWidth / COLS);
  W               = CELL * COLS;
  H               = CELL * ROWS;
  const canvas    = document.getElementById('grid-canvas');
  canvas.width    = W;
  canvas.height   = H;
  draw();
}

// ── STARTUP ────────────────────────────────────────────────
// This runs once when the page loads
window.addEventListener('DOMContentLoaded', () => {
  makeGrid();       // build the grid data  (grid.js)
  resize();         // size the canvas and draw  (grid.js)
  initToolEvents(); // attach mouse/touch listeners  (tools.js)
});

window.addEventListener('resize', resize);