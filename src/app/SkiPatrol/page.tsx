// File: /pages/game-sudoku.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Cell = {
  value: number | null; // The actual number in the cell
  isFixed: boolean; // If true, the cell is pre-filled and immutable
  hints: number[]; // Possible numbers as hints
};

type Clue = {
  message: string;
};

type Config = {
  clue: string;
  nextPage: string;
};

export default function GameSudokuPage() {
  // Initialize the Sudoku board with a predefined puzzle
  const initialBoard: Cell[][] = [
    [
        { value: null, isFixed: false, hints: [] },
    { value: null, isFixed: false, hints: [] },
      { value: 3, isFixed: true, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: 7, isFixed: true, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: 6, isFixed: true, hints: [] },
      { value: null, isFixed: false, hints: [] },

    ],
    [
        { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: 7, isFixed: true, hints: [] },
      { value: 8, isFixed: true, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: 2, isFixed: true, hints: [] },

      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },

    ],
    [
        { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: 3, isFixed: true, hints: [] },

      { value: null, isFixed: false, hints: [] },

    ],
    [
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },

      { value: null, isFixed: false, hints: [] },
      { value: 5, isFixed: true, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: 1, isFixed: true, hints: [] },

    ],
    [
        { value: null, isFixed: false, hints: [] },
        { value: null, isFixed: false, hints: [] },
      { value: 5, isFixed: true, hints: [] },
      { value: 4, isFixed: true, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: 8, isFixed: true, hints: [] },
      { value: 3, isFixed: true, hints: [] },
      { value: 7, isFixed: true, hints: [] },
      { value: 9, isFixed: true, hints: [] },

    ],
    [
        { value: null, isFixed: false, hints: [] },
      { value: 3, isFixed: true, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: 2, isFixed: true, hints: [] },
      { value: 7, isFixed: true, hints: [] },
      { value: 9, isFixed: true, hints: [] },
      { value: 6, isFixed: true, hints: [] },
      { value: 4, isFixed: true, hints: [] },


      { value: null, isFixed: false, hints: [] },
    ],
    [
      { value: 5, isFixed: true, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: 3, isFixed: true, hints: [] },
    ],
    [
        { value: null, isFixed: false, hints: [] },
      { value: 7, isFixed: true, hints: [] },
      { value: 6, isFixed: true, hints: [] },
      { value: 3, isFixed: true, hints: [] },
      { value: 9, isFixed: true, hints: [] },
      { value: 4, isFixed: true, hints: [] },

      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
    ],
    [
        { value: null, isFixed: false, hints: [] },
        { value: null, isFixed: false, hints: [] },
      { value: 4, isFixed: true, hints: [] },


      { value: null, isFixed: false, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: 5, isFixed: true, hints: [] },
      { value: null, isFixed: false, hints: [] },
      { value: 8, isFixed: true, hints: [] },


      { value: null, isFixed: false, hints: [] },
    ],
  ];
  

  const [board, setBoard] = useState<Cell[][]>(initialBoard);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [mode, setMode] = useState<"guess" | "hint">("guess");
  const [clue, setClue] = useState<Clue | null>(null);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    fetch("/api/config/sudoku")
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Failed to fetch config:", err));
  }, []);

  /**
   * Handles selecting a cell on the Sudoku board.
   * @param row The row index of the cell.
   * @param col The column index of the cell.
   */
  const selectCell = (row: number, col: number) => {
    if (row < 0 || row >= 9 || col < 0 || col >= 9) return;
    const cell = board[row]?.[col];
    if (!cell || cell.isFixed) return;
    setSelectedCell({ row, col });
  };

  /**
   * Handles inputting a number into the selected cell.
   * @param number The number to input.
   */
  const inputNumber = (number: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((r) => r.map((c) => ({ ...c })));
      const cell = newBoard[row]?.[col];
      if (!cell) return prevBoard;

      if (number === 0) { // Clear button pressed
        cell.value = null;
        cell.hints = [];
      } else if (mode === "guess") {
        cell.value = number;
        cell.hints = []; // Clear hints upon guessing
      } else if (mode === "hint") {
        // Initialize hints array if undefined
        if (!cell.hints) cell.hints = [];
        
        if (!cell.hints.includes(number)) {
          cell.hints.push(number);
        } else {
          cell.hints = cell.hints.filter((h) => h !== number);
        }
      }
      return newBoard;
    });
  };

  /**
   * Checks if the current board state is a valid and complete Sudoku.
   * @returns Boolean indicating if the board is complete and valid.
   */
  const isBoardComplete = useCallback((): boolean => {
    // Check for any empty cells
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row]?.[col]?.value === null) return false;
      }
    }

    // Check rows, columns, and 3x3 boxes for duplicates
    const checkDuplicates = (arr: (number | null)[]): boolean => {
      const nums = arr.filter((n): n is number => n !== null);
      return new Set(nums).size === nums.length;
    };

    // Check rows
    for (let row = 0; row < 9; row++) {
      const rowValues = board[row]?.map((cell) => cell.value) ?? [];
      if (!checkDuplicates(rowValues)) return false;
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      const colValues = board.map((row) => row[col]?.value ?? null);
      if (!checkDuplicates(colValues)) return false;
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const boxValues: (number | null)[] = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const value = board[boxRow * 3 + i]?.[boxCol * 3 + j]?.value ?? null;
            boxValues.push(value);
          }
        }
        if (!checkDuplicates(boxValues)) return false;
      }
    }

    return true;
  }, [board]);

  /**
   * Checks if the board is complete and valid whenever it updates.
   * If complete, sets a congratulatory clue/message.
   */
  useEffect(() => {
    if (isBoardComplete()) {
      void fetchClue();
    } else {
      setClue(null);
    }
  }, [board, isBoardComplete]);

  /**
   * Resets the board to the initial state.
   */
  const resetBoard = () => {
    setBoard(initialBoard);
    setSelectedCell(null);
    setClue(null);
  };

  /**
   * Generates the numbers (1-9) as clickable buttons.
   */
  const renderNumberButtons = () => {
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
    return (
      <div className="grid grid-cols-3 gap-2 mt-4 w-fit mx-auto">
        {numbers.map((number) => (
          <button
            key={number}
            onClick={() => inputNumber(number)}
            className="w-10 h-10 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => inputNumber(0)}
          className="w-10 h-10 bg-red-200 rounded hover:bg-red-300 transition col-span-3"
        >
          Clear
        </button>
      </div>
    );
  };

  /**
   * Renders the Sudoku board.
   */
  const renderBoard = () => {
    return (
      <div className="inline-block">
        <div className="grid grid-cols-9 gap-[1px] bg-black p-[1px]">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected =
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

              let isHighlighted = false;
              if (selectedCell) {
                const sameRow = selectedCell.row === rowIndex;
                const sameCol = selectedCell.col === colIndex;
                const sameBox =
                  Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                  Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3);
                isHighlighted = sameRow || sameCol || sameBox;
              }

              // Add thicker borders between 3x3 sections
              const borderRight = (colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-[1px] border-black' : '';
              const borderBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-[1px] border-black' : '';

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => selectCell(rowIndex, colIndex)}
                  className={`w-8 h-8 ${
                    isHighlighted ? "bg-yellow-100" : "bg-white"
                  } ${isSelected ? "ring-2 ring-blue-500" : ""} 
                    ${borderRight} ${borderBottom}
                    flex items-center justify-center relative cursor-pointer`}
                >
                  {cell.value !== null ? (
                    <span
                      className={`${
                        cell.isFixed ? "font-bold text-gray-800" : "text-gray-600"
                      }`}
                    >
                      {cell.value}
                    </span>
                  ) : cell.hints.length > 0 ? (
                    <div className="grid grid-cols-3 grid-rows-3 gap-0 text-[8px] text-gray-500 w-full h-full p-[1px]">
                      {cell.hints.map((hint) => (
                        <span key={hint} className="flex items-center justify-center">
                          {hint}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  /**
   * Renders the mode toggle buttons.
   */
  const renderModeToggle = () => {
    return (
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => setMode("guess")}
          className={`px-4 py-2 rounded ${
            mode === "guess" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          } hover:bg-blue-600 transition`}
        >
          Guess Mode
        </button>
        <button
          onClick={() => setMode("hint")}
          className={`px-4 py-2 rounded ${
            mode === "hint" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          } hover:bg-blue-600 transition`}
        >
          Hint Mode
        </button>
      </div>
    );
  };

  const fetchClue = async () => {
    try {
      const response = await fetch("/api/verify-sudoku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();
      if (data.clue) {
        setClue({ message: data.clue });
      }
    } catch (error) {
      console.error("Error fetching clue:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-6">Sudoku</h1>

      <div className="w-fit flex flex-col items-center p-4 bg-white rounded-lg shadow-md m-4">
        {/* Game Board */}
        {renderBoard()}

        {/* Mode Toggle */}
        {renderModeToggle()}

        {/* Number Input */}
        {renderNumberButtons()}
      </div>

      {/* Messages and Reset - outside white container */}
      {clue && (
        <div className="mt-6 p-4 bg-green-200 text-green-800 rounded">
          <p className="text-lg mb-4">{clue.message}</p>
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

      <button
        onClick={resetBoard}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Reset Game
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
   Helper functions
------------------------------------------------------------------ */

/**
 * Validates if placing a number at a specific position is valid.
 * @param board The current Sudoku board.
 * @param row The row index.
 * @param col The column index.
 * @param number The number to validate.
 * @returns Boolean indicating if the placement is valid.
 */
function isValidPlacement(
  board: Cell[][],
  row: number,
  col: number,
  number: number
): boolean {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row]?.[i]?.value === number) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i]?.[col]?.value === number) return false;
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i]?.[j]?.value === number) return false;
    }
  }

  return true;
}
