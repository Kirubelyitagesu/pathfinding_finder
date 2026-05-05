// ── ALGORITHM DESCRIPTIONS ─────────────────────────────────
// Each algorithm has a description object with all the info
// we want to show the user when they select it.

const ALGO_INFO = {
  bfs: {
    name:      'BFS — Breadth-First Search',
    color:     '#f7a04d',
    badge:     'Simplest',
    how:       'Explores all cells 1 step away first, then 2 steps, then 3 — like ripples in water. Uses a queue (first in, first out).',
    heuristic: 'None. BFS has no idea where the goal is. It explores every direction equally until it finds the end.',
    guarantee: 'Yes — always finds the shortest path when all steps cost the same.',
    speed:     'Slow — explores in all directions including wrong ones.',
    formula:   'Cost = steps taken so far (g only)',
    usecase:   'Puzzle solving, network broadcasting, finding connected components.',
  },

  dijkstra: {
    name:      "Dijkstra's Algorithm",
    color:     '#7c6af7',
    badge:     'Best for Weighted Graphs',
    how:       'Always picks the unvisited cell with the lowest total cost. On our grid it looks like BFS, but it handles roads with different costs perfectly.',
    heuristic: 'None. Like BFS it has no sense of direction toward the goal.',
    guarantee: 'Yes — always finds the cheapest path, even with unequal step costs.',
    speed:     'Medium — no guidance toward the goal, but prioritizes cheap paths.',
    formula:   'Cost = g(n)   where g = actual steps from start to n',
    usecase:   'GPS routing, OSPF network protocols, flight fare search.',
  },

  astar: {
    name:      'A* (A-Star) Search',
    color:     '#4dd9ac',
    badge:     'Most Efficient',
    how:       'Combines actual cost g(n) with an estimated distance to goal h(n). Always explores the most promising cell first, ignoring dead ends.',
    heuristic: 'Yes — Manhattan distance: |row difference| + |column difference|. This is what makes A* smart.',
    guarantee: 'Yes — finds the shortest path as long as the heuristic never overestimates.',
    speed:     'Fastest — explores far fewer cells because it is guided toward the goal.',
    formula:   'f(n) = g(n) + h(n)   where h = Manhattan distance to goal',
    usecase:   'Google Maps, game AI (NPC navigation), robotics.',
  },
};

// ── UPDATE THE CARD WHEN USER CHANGES ALGORITHM ────────────
function updateDescription() {
  const algo = document.getElementById('algo-select').value;
  const info = ALGO_INFO[algo];
  const card = document.getElementById('algo-desc');

  card.style.borderColor = info.color + '66';

  card.innerHTML = `
    <div class="desc-header">
      <span class="desc-badge" style="color:${info.color};border-color:${info.color}55;">
        ${info.badge}
      </span>
      <span class="desc-name" style="color:${info.color};">${info.name}</span>
    </div>

    <div class="desc-grid">
      <div class="desc-fact">
        <div class="desc-label">How it works</div>
        <div class="desc-val">${info.how}</div>
      </div>
      <div class="desc-fact">
        <div class="desc-label">Heuristic</div>
        <div class="desc-val">${info.heuristic}</div>
      </div>
      <div class="desc-fact">
        <div class="desc-label">Shortest path guarantee</div>
        <div class="desc-val">${info.guarantee}</div>
      </div>
      <div class="desc-fact">
        <div class="desc-label">Speed</div>
        <div class="desc-val">${info.speed}</div>
      </div>
      <div class="desc-fact desc-full">
        <div class="desc-label">Real-world use cases</div>
        <div class="desc-val" style="color:${info.color}99;">${info.usecase}</div>
      </div>
      <div class="desc-formula desc-full" style="border-left-color:${info.color};">
        <div class="desc-label">Formula</div>
        <div class="desc-formula-val" style="color:${info.color};">${info.formula}</div>
      </div>
    </div>
  `;
}