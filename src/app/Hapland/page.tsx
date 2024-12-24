"use client";

import { useEffect, useState, useCallback, useRef } from "react";

type Tile = {
  id: string;
  value: number;
};

type Config2048 = {
  targetScore: number;
  clue: string;
};

type VerifyResponse = {
  clue: string;
};

export default function Game2048Page() {
  const [config, setConfig] = useState<Config2048 | null>(null);

  const [grid, setGrid] = useState<Tile[][]>([]);
  const [score, setScore] = useState(0);
  const [clueMessage, setClueMessage] = useState<string | null>(null);
  const [clueReceived, setClueReceived] = useState(false);

  // For swipe handling
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // 1. Fetch config on mount
  useEffect(() => {
    fetch("/api/config/2048")
      .then((res) => res.json())
      .then((data: Config2048) => setConfig(data))
      .catch((err) => console.error("Failed to fetch 2048 config:", err));
  }, []);

  // 2. Initialize or reset the game
  const initGame = useCallback(() => {
    const newGrid = createEmptyGrid();
    // Spawn 2 tiles
    spawnRandomTile(newGrid);
    spawnRandomTile(newGrid);

    setGrid([...newGrid]);
    setScore(calculateBoardSum(newGrid));
    setClueMessage(null);
    setClueReceived(false);
  }, []);

  // 3. Once config is loaded, initialize game
  useEffect(() => {
    if (config) {
      initGame();
    }
  }, [config, initGame]);

  /**
   * 4. Listen for arrow key input
   * We'll unify arrow keys and swipe events by calling doMove(direction).
   */
  useEffect(() => {
    if (!config || clueReceived) return;

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowLeft":
          doMove("left");
          break;
        case "ArrowRight":
          doMove("right");
          break;
        case "ArrowUp":
          doMove("up");
          break;
        case "ArrowDown":
          doMove("down");
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid, config, clueReceived]);

  /**
   * 5. Swipe event handling
   */
  useEffect(() => {
    if (!config || clueReceived) return;

    function handleTouchStart(e: TouchEvent) {
      if (!e.touches[0]) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!e.changedTouches[0]) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const minSwipeDistance = 30;

      if (absX > absY) {
        // horizontal swipe
        if (absX > minSwipeDistance) {
          if (deltaX > 0) doMove("right");
          else doMove("left");
        }
      } else {
        // vertical swipe
        if (absY > minSwipeDistance) {
          if (deltaY > 0) doMove("down");
          else doMove("up");
        }
      }
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [grid, config, clueReceived]);

  /**
   * 6. doMove(direction): merges & spawns new tile if grid changed, 
   * then recalc total score from the entire board.
   */
  function doMove(direction: "left" | "right" | "up" | "down") {
    if (!config || clueReceived) return;

    let movedGrid: Tile[][] = grid; // fallback
    switch (direction) {
      case "left": {
        const [g] = moveLeft(grid);
        movedGrid = g;
        break;
      }
      case "right": {
        const [g] = moveRight(grid);
        movedGrid = g;
        break;
      }
      case "up": {
        const [g] = moveUp(grid);
        movedGrid = g;
        break;
      }
      case "down": {
        const [g] = moveDown(grid);
        movedGrid = g;
        break;
      }
    }

    // If no change, do nothing
    if (!gridChanged(grid, movedGrid)) return;

    // spawn a new tile
    spawnRandomTile(movedGrid);

    // recalc the new total
    const newScore = calculateBoardSum(movedGrid);

    setGrid([...movedGrid]);
    setScore(newScore);

    // If newScore >= targetScore => fetch clue
    if (newScore >= config.targetScore && !clueReceived) {
      fetchClue(newScore);
    }
  }

  // 7. Fetch clue from API
  async function fetchClue(currentScore: number) {
    try {
      const response = await fetch("/api/verify-2048", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: currentScore }),
      });
      if (response.ok) {
        const data: VerifyResponse = await response.json();
        setClueMessage(data.clue);
        setClueReceived(true);
      }
    } catch (error) {
      console.error("Error verifying 2048 score:", error);
    }
  }

  if (!config) {
    return <div>Loading 2048 Config...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-2">
        {score}/{config.targetScore}
      </h1>

      <button
        onClick={initGame}
        className="mb-4 bg-blue-500 text-white px-3 py-1 rounded"
      >
        Reset Game
      </button>

      <div className="inline-block">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((tile, colIndex) => {
              const color = getTileColor(tile.value);
              return (
                <div
                  key={tile.id}
                  className="m-1 flex items-center justify-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "24px",
                    fontWeight: 600,
                    backgroundColor: color,
                  }}
                >
                  {tile.value > 0 ? tile.value : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {clueMessage && (
        <div className="mt-4 p-4 bg-white text-center shadow rounded">
          <p className="text-xl font-semibold">{clueMessage}</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Helper functions (adjusted to avoid potential undefined)
 ------------------------------------------------------------------ */

function createEmptyGrid(): Tile[][] {
  const grid: Tile[][] = [];
  for (let r = 0; r < 4; r++) {
    const row: Tile[] = [];
    for (let c = 0; c < 4; c++) {
      row.push({
        id: `r${r}c${c}-${Math.random()}`,
        value: 0,
      });
    }
    grid.push(row);
  }
  return grid;
}

function spawnRandomTile(grid: Tile[][]) {
  const emptyCells: { r: number; c: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r]?.[c]?.value === 0) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length === 0) return;

  const idx = Math.floor(Math.random() * emptyCells.length);
  const cell = emptyCells[idx];
  if (!cell || !grid[cell.r]?.[cell.c]) return;
  
  grid[cell.r]![cell.c]! = {
    id: `r${cell.r}c${cell.c}-${Math.random()}`,
    value: Math.random() < 0.9 ? 2 : 4,
  };
}

function calculateBoardSum(grid: Tile[][]): number {
  let sum = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      // Safely check
      sum += grid[r]?.[c]?.value ?? 0;
    }
  }
  return sum;
}

function gridChanged(oldG: Tile[][], newG: Tile[][]): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if ((oldG[r]?.[c]?.value ?? 0) !== (newG[r]?.[c]?.value ?? 0)) {
        return true;
      }
    }
  }
  return false;
}

function moveLeft(grid: Tile[][]): [Tile[][], number] {
  let scoreGained = 0;

  // Copy safely
  const newGrid: Tile[][] = grid.map((row) =>
    row.map((tile) => ({ ...tile }))
  );

  for (let r = 0; r < 4; r++) {
    // Extract row values
    const rowValues = (newGrid[r] ?? [])
      .map((t) => t?.value ?? 0)
      .filter((val) => val !== 0);

    // Merge
    for (let i = 0; i < rowValues.length - 1; i++) {
      const currentValue = rowValues[i];
      const nextValue = rowValues[i + 1];
      if (currentValue && nextValue && currentValue === nextValue) {
        rowValues[i] = currentValue * 2;
        scoreGained += rowValues[i]!; // non-null assertion is safe here
        rowValues.splice(i + 1, 1);
        i++;
      }
    }

    // Fill back up to 4
    while (rowValues.length < 4) {
      rowValues.push(0);
    }

    // Reassign row
    for (let c = 0; c < 4; c++) {
      if (newGrid[r]?.[c]) {
        newGrid[r]![c]!.value = rowValues[c] ?? 0;
      }
    }
  }

  return [newGrid, scoreGained];
}

function moveRight(grid: Tile[][]): [Tile[][], number] {
  const rotated1 = rotateGrid(grid);
  const rotated2 = rotateGrid(rotated1);
  const [tmp, score] = moveLeft(rotated2);
  const unRotated1 = rotateGrid(tmp);
  const unRotated2 = rotateGrid(unRotated1);
  return [unRotated2, score];
}

function moveUp(grid: Tile[][]): [Tile[][], number] {
  let g = grid;
  for (let i = 0; i < 3; i++) {
    g = rotateGrid(g);
  }
  const [tmp, score] = moveLeft(g);
  g = tmp;
  g = rotateGrid(g);
  return [g, score];
}

function moveDown(grid: Tile[][]): [Tile[][], number] {
  let g = rotateGrid(grid);
  const [tmp, score] = moveLeft(g);
  g = tmp;
  for (let i = 0; i < 3; i++) {
    g = rotateGrid(g);
  }
  return [g, score];
}

/**
 * rotateGrid: 90 deg clockwise
 * returns a new copy
 */
function rotateGrid(src: Tile[][]): Tile[][] {
  const n = src.length;
  // Avoid index errors if src is unexpectedly not 4x4
  if (n < 4) return src;

  const newGrid: Tile[][] = createEmptyGrid();
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const oldVal = src[r]?.[c]?.value ?? 0;
      const oldId = src[r]?.[c]?.id ?? `r${r}c${c}-??`;
      if (newGrid[c]?.[n - 1 - r]) {
        newGrid[c]![n - 1 - r]!.value = oldVal;
        newGrid[c]![n - 1 - r]!.id = oldId;
      }
    }
  }
  return newGrid;
}

function getTileColor(value: number): string {
  switch (value) {
    case 2:
      return "#eee4da";
    case 4:
      return "#ede0c8";
    case 8:
      return "#f2b179";
    case 16:
      return "#f59563";
    case 32:
      return "#f67c5f";
    case 64:
      return "#f65e3b";
    case 128:
      return "#edcf72";
    case 256:
      return "#edcc61";
    case 512:
      return "#edc850";
    case 1024:
      return "#edc53f";
    case 2048:
      return "#edc22e";
    default:
      if (value > 2048) return "#3c3a32"; // for tiles beyond 2048
      return "#cdc1b4"; // empty or fallback
  }
}
