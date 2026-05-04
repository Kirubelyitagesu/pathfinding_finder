// ── TOOL STATE ─────────────────────────────────────────────
let tool        = 'wall';
let isMouseDown = false;

// ── TOOL SELECTION ─────────────────────────────────────────
function setTool(t) {
  tool = t;
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-' + t).classList.add('active');

  const hints = {
    wall:  'Click and drag on the grid to draw walls',
    start: 'Click any cell to move the Start point',
    end:   'Click any cell to move the End point',
    erase: 'Click and drag to erase walls',
  };
  document.getElementById('hint').textContent = hints[t] || '';
}

// ── FIND WHICH CELL WAS CLICKED ────────────────────────────
function getCellFromEvent(e) {
  const canvas = document.getElementById('grid-canvas');
  const rect   = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top)  * scaleY;
  const c = Math.floor(x / CELL);
  const r = Math.floor(y / CELL);
  if (r >= 0 && r < ROWS && c >= 0 && c < COLS) return grid[r][c];
  return null;
}

// ── APPLY TOOL TO CELL ─────────────────────────────────────
function applyTool(node) {
  if (!node) return;

  if (tool === 'wall') {
    if (node !== startNode && node !== endNode) node.wall = true;
  } else if (tool === 'erase') {
    node.wall = false;
  } else if (tool === 'start') {
    if (node !== endNode) { startNode = node; node.wall = false; }
  } else if (tool === 'end') {
    if (node !== startNode) { endNode = node; node.wall = false; }
  }

  draw();
}

// ── MOUSE EVENTS ───────────────────────────────────────────
function initToolEvents() {
  const canvas = document.getElementById('grid-canvas');

  canvas.addEventListener('mousedown', e => { isMouseDown = true; applyTool(getCellFromEvent(e)); });
  canvas.addEventListener('mousemove', e => { if (isMouseDown) applyTool(getCellFromEvent(e)); });
  canvas.addEventListener('mouseup',    () => isMouseDown = false);
  canvas.addEventListener('mouseleave', () => isMouseDown = false);

  canvas.addEventListener('touchstart', e => {
    e.preventDefault(); isMouseDown = true; applyTool(getCellFromEvent(e.touches[0]));
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault(); if (isMouseDown) applyTool(getCellFromEvent(e.touches[0]));
  }, { passive: false });
  canvas.addEventListener('touchend', () => isMouseDown = false);
}

// ── RANDOM MAZE ────────────────────────────────────────────
function generateMaze() {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      grid[r][c].wall = Math.random() < 0.30;

  startNode.wall = false;
  endNode.wall   = false;
  draw();
  document.getElementById('hint').textContent = 'Maze generated! Now run an algorithm.';
}

// ── RESET ──────────────────────────────────────────────────
function resetGrid() {
  makeGrid();
  draw();
  document.getElementById('hint').textContent = 'Grid reset. Select a tool to begin.';
}