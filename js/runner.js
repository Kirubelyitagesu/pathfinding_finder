// ── SPEED SLIDER ───────────────────────────────────────────
// Returns delay in ms based on slider value (1=slow, 5=instant)
function getDelay() {
  const value = parseInt(document.getElementById('speed-slider').value);
  const delays = [80, 40, 15, 5, 1];
  return delays[value - 1];
}

// ── CLEAR PATH ─────────────────────────────────────────────
// Removes algorithm visuals but keeps walls
function clearPath() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      node.state  = '';
      node.parent = null;
      node.dist   = Infinity;
      node.g = node.h = node.f = Infinity;
    }
  }
  setMessage('Path cleared. Press Run to search again.');
  draw();
}

// ── MESSAGE & STATS ────────────────────────────────────────
function setMessage(text) {
  document.getElementById('hint').textContent = text;
}

// ── RUN BUTTON ─────────────────────────────────────────────
let running = false;  // prevent running two algorithms at once

async function runAlgorithm() {
  if (running) return;
  running = true;
  clearPath();

  const algo      = document.getElementById('algo-select').value;
  const startTime = performance.now();
  let found       = false;

  // Call the correct algorithm function

//   if      (algo === 'bfs')      found = await runBFS();
//   else if (algo === 'dijkstra') found = await runDijkstra();
//   // A* will be added in the next step
  if      (algo === 'bfs')      found = await runBFS();
  else if (algo === 'dijkstra') found = await runDijkstra();
  else if (algo === 'astar')    found = await runAstar();

  const ms = Math.round(performance.now() - startTime);

  if (found) {
    const pathLen = tracePath();
    draw();
    setMessage(`Path found — ${pathLen} steps · ${ms}ms`);
  } else {
    setMessage('No path found — the end is blocked!');
  }

  running = false;
}