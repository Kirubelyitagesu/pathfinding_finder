// ── HELPERS (used by all algorithms) ───────────────────────

// Reset all algorithm-related data on every cell before a new run
function resetNodes() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      node.state  = '';        // visual state: open / closed / path
      node.parent = null;      // which cell did we come from?
      node.dist   = Infinity;  // used by BFS and Dijkstra
      node.g      = Infinity;  // used by A* (cost from start)
      node.h      = 0;         // used by A* (heuristic estimate)
      node.f      = Infinity;  // used by A* (g + h)
    }
  }
}

// Get all walkable neighbors of a cell (up, down, left, right)
function getNeighbors(node) {
  const neighbors = [];
  const directions = [[-1,0],[1,0],[0,-1],[0,1]]; // up, down, left, right

  for (const [dr, dc] of directions) {
    const nr = node.r + dr;
    const nc = node.c + dc;
    // Stay inside the grid and skip walls
    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !grid[nr][nc].wall) {
      neighbors.push(grid[nr][nc]);
    }
  }
  return neighbors;
}

// Trace back from end to start using parent pointers and mark path
function tracePath() {
  let node = endNode;
  let length = 0;
  while (node) {
    if (node !== startNode && node !== endNode) node.state = 'path';
    node = node.parent;
    length++;
  }
  return length;
}

// Pause execution for ms milliseconds (used to animate step by step)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── BFS ────────────────────────────────────────────────────
// BFS explores all cells 1 step away, then 2 steps, then 3...
// It uses a queue: first cell in = first cell explored.
async function runBFS() {
  resetNodes();

  const queue = [startNode];   // start with the start cell in the queue
  startNode.dist = 0;          // distance from start to itself is 0
  let found = false;

  while (queue.length > 0) {
    const current = queue.shift();  // take the FIRST cell from the queue

    // Mark as visited (closed) unless it is start or end
    if (current !== startNode && current !== endNode) {
      current.state = 'closed';
    }

    // Did we reach the goal?
    if (current === endNode) {
      found = true;
      break;
    }

    // Look at all walkable neighbors
    for (const neighbor of getNeighbors(current)) {
      // Only visit cells we have not seen yet
      if (neighbor.dist === Infinity) {
        neighbor.dist   = current.dist + 1;  // one more step than current
        neighbor.parent = current;            // remember how we got here
        neighbor.state  = 'open';            // mark as known but not yet explored
        queue.push(neighbor);                 // add to the BACK of the queue
      }
    }

    draw();                          // redraw the grid to show progress
    await sleep(getDelay());         // wait a moment so we can see it
  }

  return found;
}

// ── DIJKSTRA ───────────────────────────────────────────────
// Dijkstra always picks the unvisited cell with the lowest
// total cost from the start. On our grid where every step
// costs 1, it looks similar to BFS — but it uses a priority
// queue sorted by cost instead of a regular queue.
async function runDijkstra() {
  resetNodes();

  // Put every cell in the unvisited set
  const unvisited = new Set();
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      unvisited.add(grid[r][c]);

  // Start cell costs 0 to reach
  startNode.dist = 0;
  let found = false;

  while (unvisited.size > 0) {

    // Pick the unvisited cell with the lowest cost (the "cheapest" one)
    // This is what makes Dijkstra different from BFS
    let current = null;
    for (const node of unvisited) {
      if (!current || node.dist < current.dist) current = node;
    }

    // If the cheapest cell costs Infinity, everything left is unreachable
    if (!current || current.dist === Infinity) break;

    // Remove current from unvisited
    unvisited.delete(current);

    // Mark as visited
    if (current !== startNode && current !== endNode) {
      current.state = 'closed';
    }

    // Did we reach the goal?
    if (current === endNode) {
      found = true;
      break;
    }

    // Check each neighbor
    for (const neighbor of getNeighbors(current)) {
      if (!unvisited.has(neighbor)) continue; // already visited, skip

      // Cost to reach neighbor through current cell
      const newCost = current.dist + 1;

      // If this path is cheaper than what we knew before, update it
      if (newCost < neighbor.dist) {
        neighbor.dist   = newCost;
        neighbor.parent = current;
        neighbor.state  = 'open';
      }
    }

    draw();
    await sleep(getDelay());
  }

  return found;
}