"use client";

import { useState, useEffect, useCallback } from "react";
import { ParagonConfig } from "~/config/config";

type Cell = {
  isBomb: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentBombs: number;
};

type VerifyResponse = {
  clue: string;
};

const countAdjacentBombs = (grid: Cell[][], row: number, col: number, gridSize: number): number => {
    const directions: [number, number][] = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
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
  const { gridSize, numberOfBombs } = ParagonConfig.minesweeper;
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [clueMessage, setClueMessage] = useState<string | null>(null);

  const initializeGrid = useCallback(() => {
    const newGrid: Cell[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({
        isBomb: false,
        isRevealed: false,
        isFlagged: false,
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
  }, [gridSize, numberOfBombs, countAdjacentBombs]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  

  const revealCell = (row: number, col: number) => {
    if (
      gameOver || 
      !grid[row]?.[col] || 
      grid[row][col].isRevealed || 
      grid[row][col].isFlagged
    ) return;

    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    const cell = newGrid[row]?.[col];
    if (cell) {
        cell.isRevealed = true;
        if (cell.isBomb) {
            // Hit a bomb
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

  /**
   * Flood reveal using BFS to reveal all connected empty cells and their number neighbors.
   */
  const floodReveal = (grid: Cell[][], startRow: number, startCol: number) => {
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
          if (neighbor && !neighbor.isRevealed) {
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
      void fetchClue(); // Avoid no-floating-promises error by explicitly ignoring the promise
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

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Minesweeper</h1>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => revealCell(rowIndex, colIndex)}
              className={`w-10 h-10 border ${cell.isRevealed ? "bg-gray-300" : "bg-gray-500"}`}
            >
              {cell.isRevealed && (cell.isBomb ? "💣" : cell.adjacentBombs || "")}
            </button>
          ))
        )}
      </div>
      {gameOver && <p className="text-red-500 mt-4">Game Over!</p>}
      {gameWon && <p className="text-green-500 mt-4">You Won!</p>}
      {(gameOver || gameWon) && (
        <button
          onClick={handleReplay}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Play Again
        </button>
      )}
      {clueMessage && (
        <div className="mt-4 text-center p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <p className="text-2xl font-semibold">{clueMessage}</p>
        </div>
      )}
    </div>
  );
}
