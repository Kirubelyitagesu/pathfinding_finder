// ── SPEED SLIDER ───────────────────────────────────────────
function getDelay() {
  const value = parseInt(document.getElementById('speed-slider').value);
  const delays = [80, 40, 15, 5, 1];
  return delays[value - 1];
}

// ── STATS ──────────────────────────────────────────────────
function setStats(nodes, length, ms) {
  document.getElementById('stat-nodes').textContent  = nodes;
  document.getElementById('stat-length').textContent = length;
  document.getElementById('stat-time').textContent   = ms;
}

function resetStats() {
  setStats('—', '—', '—');
}

// ── CLEAR PATH ─────────────────────────────────────────────
function clearPath() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node  = grid[r][c];
      node.state  = '';
      node.parent = null;
      node.dist   = Infinity;
      node.g = node.h = node.f = Infinity;
    }
  }
  resetStats();
  document.getElementById('hint').textContent = 'Path cleared. Press Run to search again.';
  draw();
}

// ── RUN BUTTON ─────────────────────────────────────────────
let running = false;

async function runAlgorithm() {
  if (running) return;
  running = true;
  clearPath();

  const algo      = document.getElementById('algo-select').value;
  const startTime = performance.now();
  let   found     = false;

  // Count how many nodes the algorithm explores
  let nodesExplored = 0;

  // Wrap each algorithm so we can count explored nodes
  const originalDraw = window.draw;
  // We count closed nodes after each draw call
  function countNodes() {
    let count = 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (grid[r][c].state === 'closed') count++;
    return count;
  }

  if      (algo === 'bfs')      found = await runBFS();
  else if (algo === 'dijkstra') found = await runDijkstra();
  else if (algo === 'astar')    found = await runAstar();

  const ms = Math.round(performance.now() - startTime);
  nodesExplored = countNodes();

  if (found) {
    const pathLen = tracePath();
    draw();
    document.getElementById('hint').textContent =
      `Path found — ${pathLen} steps · ${nodesExplored} nodes explored · ${ms}ms`;
    setStats(nodesExplored, pathLen, ms + 'ms');
  } else {
    document.getElementById('hint').textContent = 'No path found — the end is blocked!';
    setStats(nodesExplored, '✕', ms + 'ms');
  }

  running = false;
}