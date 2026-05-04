// ── GRID SETTINGS ──────────────────────────────────────────
const COLS = 38;
const ROWS = 20;

let CELL, W, H;

// ── GRID STATE ─────────────────────────────────────────────
let grid      = [];
let startNode = null;
let endNode   = null;

// ── BUILD THE GRID ─────────────────────────────────────────
function makeGrid() {
  grid = [];
  for (let r = 0; r < ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < COLS; c++) {
      grid[r][c] = { r, c, wall: false };
    }
  }
  startNode = grid[Math.floor(ROWS / 2)][3];
  endNode   = grid[Math.floor(ROWS / 2)][COLS - 4];
}

// ── DRAW THE GRID ──────────────────────────────────────────
function draw() {
  const canvas = document.getElementById('grid-canvas');
  const ctx    = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#0e0e1a';
  ctx.fillRect(0, 0, W, H);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      const x    = c * CELL;
      const y    = r * CELL;

      // ── CELL COLOR ───────────────────────────────────────
      // Priority order matters: start/end always show on top,
      // then walls, then algorithm states, then empty
      if      (node === startNode)          ctx.fillStyle = '#4dd9ac'; // teal
      else if (node === endNode)            ctx.fillStyle = '#f74d7c'; // pink
      else if (node.wall)                   ctx.fillStyle = '#5a5ab8'; // blue-purple
      else if (node.state === 'path')       ctx.fillStyle = '#f7a04d'; // orange
      else if (node.state === 'open')       ctx.fillStyle = '#4dd9ac33'; // teal tint  = frontier
      else if (node.state === 'closed')     ctx.fillStyle = '#7c6af733'; // purple tint = visited
      else                                  ctx.fillStyle = '#1a1a2e'; // dark navy  = empty

      ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);

      // ── FRONTIER BORDER ──────────────────────────────────
      // Draw a thin border around frontier cells so they are visible
      if (node.state === 'open') {
        ctx.strokeStyle = '#4dd9ac88';
        ctx.lineWidth   = 0.8;
        ctx.strokeRect(x + 1, y + 1, CELL - 2, CELL - 2);
      }

      // ── PATH DOT ─────────────────────────────────────────
      // Draw an orange dot on path cells so the path is clearly visible
      if (node.state === 'path' && node !== startNode && node !== endNode) {
        ctx.fillStyle = '#f7a04d';
        ctx.beginPath();
        ctx.arc(x + CELL / 2, y + CELL / 2, CELL * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── S / E LABELS ─────────────────────────────────────
      if (node === startNode || node === endNode) {
        ctx.fillStyle    = '#050510';
        ctx.font         = `bold ${Math.floor(CELL * 0.5)}px Arial`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node === startNode ? 'S' : 'E', x + CELL / 2, y + CELL / 2);
      }
    }
  }

  // ── GRID LINES ───────────────────────────────────────────
  ctx.strokeStyle = '#252545';
  ctx.lineWidth   = 0.5;
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(W, r * CELL); ctx.stroke();
  }
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, H); ctx.stroke();
  }
}