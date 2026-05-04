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

// ── A* (A-STAR) ────────────────────────────────────────────
// A* is like Dijkstra but with a superpower: it uses a
// heuristic h(n) to estimate how far it still is from the
// goal. This guides the search toward the goal so it explores
// far fewer cells than BFS or Dijkstra.
//
// Formula:  f(n) = g(n) + h(n)
//   g(n) = actual steps taken from start to cell n
//   h(n) = estimated steps from cell n to goal (Manhattan distance)
//   f(n) = total priority score — lowest f is explored first

// Manhattan distance: count steps as if walking on city streets
// (no diagonals). |row difference| + |column difference|
function heuristic(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

async function runAstar() {
  resetNodes();

  // The open list holds cells we know about but have not fully explored yet
  const openList = [startNode];

  startNode.g = 0;                              // 0 steps taken so far
  startNode.h = heuristic(startNode, endNode);  // estimate to goal
  startNode.f = startNode.g + startNode.h;      // total score

  let found = false;

  while (openList.length > 0) {

    // Always pick the cell with the lowest f score from the open list
    // This is the cell that looks most promising (cheap + close to goal)
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift();

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
      // g score if we travel through current to reach this neighbor
      const tentativeG = current.g + 1;

      // Only update if this is a better (cheaper) path to the neighbor
      if (tentativeG < neighbor.g) {
        neighbor.parent = current;
        neighbor.g      = tentativeG;
        neighbor.h      = heuristic(neighbor, endNode);
        neighbor.f      = neighbor.g + neighbor.h;

        // Add to open list if not already there
        if (!openList.includes(neighbor)) {
          neighbor.state = 'open';
          openList.push(neighbor);
        }
      }
    }

    draw();
    await sleep(getDelay());
  }

  return found;
}