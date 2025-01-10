"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

type MarkState = "none" | "flag" | "question";

type Cell = {
  isBomb: boolean;
  isRevealed: boolean;
  mark: MarkState;
  adjacentBombs: number;
};

type VerifyResponse = {
  clue: string;
};

const countAdjacentBombs = (grid: Cell[][], row: number, col: number, gridSize: number): number => {
  const directions: [number, number][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];
  let count = 0;
  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 && newRow < gridSize &&
      newCol >= 0 && newCol < gridSize &&
      grid[newRow]?.[newCol]?.isBomb
    ) {
      count++;
    }
  }
  return count;
};

export default function ParagonPage() {
  const [config, setConfig] = useState<typeof import("~/config/config").config.ParagonConfig | null>(null);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [clueMessage, setClueMessage] = useState<string | null>(null);
  const [selectedCellForMarking, setSelectedCellForMarking] = useState<{x: number; y: number; top: number; left: number} | null>(null);
  const [cellSize, setCellSize] = useState<number>(40);
  const [isMobile, setIsMobile] = useState(false);
  
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const [touchStartInfo, setTouchStartInfo] = useState<{row: number, col: number, clientX: number, clientY: number} | null>(null);

  // Fetch config when component mounts
  useEffect(() => {
    fetch('/api/config/paragon')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to fetch config:', err));
  }, []);

  const initializeGrid = useCallback(() => {
    if (!config) return;
    const { gridSize, numberOfBombs } = config.minesweeper;
    
    const newGrid: Cell[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({
        isBomb: false,
        isRevealed: false,
        mark: "none",
        adjacentBombs: 0,
      }))
    );

    let bombsPlaced = 0;
    while (bombsPlaced < numberOfBombs) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      const cell = newGrid[row]?.[col];
      if (cell && !cell.isBomb) {
        cell.isBomb = true;
        bombsPlaced++;
      }
    }

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = newGrid[row]?.[col];
        if (cell && !cell.isBomb) {
          cell.adjacentBombs = countAdjacentBombs(newGrid, row, col, gridSize);
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
    setClueMessage(null);
  }, [config]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  // Compute cellSize after the component mounts (in browser)
  useEffect(() => {
    if (typeof window !== "undefined" && config) {
      const margin = 32;
      const maxCellSize = 40;
      const gridSize = config.minesweeper.gridSize;

      const widthAvailable = Math.min(window.innerWidth - margin, 600);
      const heightAvailable = Math.min(window.innerHeight - margin, 600);

      const sizeBasedOnWidth = widthAvailable / gridSize;
      const sizeBasedOnHeight = heightAvailable / gridSize;

      const computedCellSize = Math.min(sizeBasedOnWidth, sizeBasedOnHeight, maxCellSize);
      setCellSize(computedCellSize > 0 ? computedCellSize : 5);
    }
  }, [config]);

  const revealCell = (row: number, col: number) => {
    if (
      gameOver || 
      !grid[row]?.[col] || 
      grid[row][col].isRevealed || 
      grid[row][col].mark !== "none"
    ) return;

    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    const cell = newGrid[row]?.[col];
    if (cell) {
      cell.isRevealed = true;
      if (cell.isBomb) {
        setGameOver(true);
        setGrid(newGrid);
        return;
      }
    }

    if (cell?.adjacentBombs === 0) {
      floodReveal(newGrid, row, col);
    }

    setGrid(newGrid);
    checkWin(newGrid);
  };

  const floodReveal = (grid: Cell[][], startRow: number, startCol: number) => {
    const gridSize = config?.minesweeper.gridSize ?? 0;
    const directions: [number, number][] = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ];

    const queue: [number, number][] = [[startRow, startCol]];
    const visited = new Set<string>();
    visited.add(`${startRow},${startCol}`);

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;
      const [r, c] = current;

      for (const [dx, dy] of directions) {
        const newRow = r + dx;
        const newCol = c + dy;
        if (
          newRow >= 0 && newRow < gridSize &&
          newCol >= 0 && newCol < gridSize
        ) {
          const neighbor = grid[newRow]?.[newCol];
          if (neighbor && !neighbor.isRevealed && neighbor.mark === "none") {
            neighbor.isRevealed = true;
            const cellKey = `${newRow},${newCol}`;
            if (!visited.has(cellKey)) {
              visited.add(cellKey);
              if (neighbor.adjacentBombs === 0) {
                queue.push([newRow, newCol]);
              }
            }
          }
        }
      }
    }
  };

  const checkWin = (grid: Cell[][]) => {
    const allCellsRevealed = grid.every(row => row.every(cell => cell.isRevealed || cell.isBomb));
    if (allCellsRevealed) {
      setGameWon(true);
      void fetchClue();
    }
  };

  const fetchClue = async () => {
    try {
      const response = await fetch("/api/verify-minesweeper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameWon: true }),
      });

      const data = (await response.json()) as VerifyResponse;
      setClueMessage(data.clue);
    } catch (error) {
      console.error("Error fetching clue:", error);
    }
  };

  const handleReplay = () => {
    initializeGrid();
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (
      gameOver || 
      gameWon || 
      !grid[row] || 
      !grid[row][col] || 
      grid[row][col].isRevealed
    ) return;

    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    const cell = newGrid[row]?.[col];
    if (cell) {
      if (cell.mark === "none") {
        cell.mark = "flag";
      } else if (cell.mark === "flag") {
        cell.mark = "question";
      } else {
        cell.mark = "none";
      }
    }

    setGrid(newGrid);
  };

  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
    if (gameOver || gameWon || !grid[row]?.[col]?.isRevealed) return;
    const touch = e.touches[0];
    if (touch) {
      setTouchStartInfo({row, col, clientX: touch.clientX, clientY: touch.clientY});
      longPressTimeout.current = setTimeout(() => {
        setSelectedCellForMarking({x: col, y: row, top: touch.clientY, left: touch.clientX});
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    setTouchStartInfo(null);
  };

  const setMarkFromPopup = (mark: MarkState) => {
    if (selectedCellForMarking) {
      const { y, x } = selectedCellForMarking;
      const newGrid = grid.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[y]?.[x];
      if (cell && !cell.isRevealed) {
        cell.mark = mark;
        setGrid(newGrid);
      }
      setSelectedCellForMarking(null);
    }
  };

  if (!config) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center relative p-2">
      <h1 className="text-2xl font-bold mb-2">Minesweeper</h1>
      
      <p className="text-sm text-gray-600 mb-2">
        {isMobile ? (
          "Press and hold to toggle between blank, 🚩, and ?"
        ) : (
          "Right click (or hold on mobile) to toggle between blank, 🚩, and ?"
        )}
      </p>
      
      <div 
        style={{ 
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          touchAction: "pan-x pan-y pinch-zoom",
          margin: "8px 0"
        }}
      >
        <div 
          className="grid" 
          style={{ 
            gridTemplateColumns: `repeat(${config.minesweeper.gridSize}, 1fr)`
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              let display = "";
              if (cell.isRevealed) {
                display = cell.isBomb ? "💣" : (cell.adjacentBombs || "").toString();
              } else {
                if (cell.mark === "flag") display = "🚩";
                else if (cell.mark === "question") display = "?";
              }

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => revealCell(rowIndex, colIndex)}
                  onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                  onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                  onTouchEnd={() => handleTouchEnd()}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    fontSize: `${cellSize * 0.5}px`, // Scale font size with cell size
                  }}
                  className={`border flex items-center justify-center ${
                    cell.isRevealed ? "bg-gray-300" : "bg-gray-500"
                  }`}
                >
                  {display}
                </button>
              );
            })
          )}
        </div>
      </div>

      {gameOver && <p className="text-red-500 mt-2">Game Over!</p>}
      {gameWon && <p className="text-green-500 mt-2">You Won!</p>}
      {(gameOver || gameWon) && (
        <button
          onClick={handleReplay}
          className="mt-2 bg-blue-500 text-white p-2 rounded"
        >
          Play Again
        </button>
      )}
      {clueMessage && (
        <div className="mt-6 p-4 bg-green-200 text-green-800 rounded">
          <p className="text-lg mb-4">{clueMessage}</p>
          {config?.nextPage && (
            <Link 
              href={config.nextPage}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Continue to Next Challenge
            </Link>
          )}
        </div>
      )}

      {selectedCellForMarking && (
        <div 
          className="absolute bg-white border rounded shadow p-2"
          style={{
            top: selectedCellForMarking.top,
            left: selectedCellForMarking.left,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <p className="font-bold mb-2">Mark as:</p>
          <button 
            className="block w-full text-left p-1 hover:bg-gray-200" 
            onClick={() => setMarkFromPopup("none")}
          >
            Clear Mark
          </button>
          <button 
            className="block w-full text-left p-1 hover:bg-gray-200" 
            onClick={() => setMarkFromPopup("flag")}
          >
            Flag
          </button>
          <button 
            className="block w-full text-left p-1 hover:bg-gray-200" 
            onClick={() => setMarkFromPopup("question")}
          >
            Question Mark
          </button>
        </div>
      )}
    </div>
  );
}
