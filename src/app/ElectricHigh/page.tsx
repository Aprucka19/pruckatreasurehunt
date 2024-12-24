// File: /pages/game-hangman.tsx

"use client";

import { useEffect, useState, useCallback, useRef } from "react";

type ConfigHangman = {
  words: string[];
  maxWrongGuesses: number;
  requiredWins: number;
};

type VerifyResponse = {
  clue: string;
};

export default function GameHangmanPage() {
  const [config, setConfig] = useState<ConfigHangman | null>(null);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [clueMessage, setClueMessage] = useState<string | null>(null);
  const [consecutiveWins, setConsecutiveWins] = useState<number>(0);
  const [showClue, setShowClue] = useState<boolean>(false);
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());

  // Reference for keyboard event handling
  const gameAreaRef = useRef<HTMLDivElement>(null);

  /**
   * Chooses a random word from the list, excluding already completed words.
   */
  const chooseRandomWord = useCallback(
    (words: string[]): string => {
      const availableWords = words.filter(
        (word) => !completedWords.has(word.toUpperCase())
      );
      if (availableWords.length === 0) return words[0]; // Early return if all words are completed
      const idx = Math.floor(Math.random() * availableWords.length);
      return availableWords[idx];
    },
    [completedWords]
  );

  // 1. Fetch config on mount
  useEffect(() => {
    fetch("/api/config/hangman")
      .then((res) => res.json())
      .then((data: ConfigHangman) => setConfig(data))
      .catch((err) => console.error("Failed to fetch Hangman config:", err));
  }, []);

  // 6. Fetch clue from API upon winning
  const fetchClue = useCallback(async (word: string) => {
    try {
      const response = await fetch("/api/verify-hangman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      if (response.ok) {
        const data: VerifyResponse = await response.json();
        setClueMessage(data.clue);
        console.log("Clue fetched:", data.clue);
      } else {
        console.error("Failed to fetch clue.");
      }
    } catch (error) {
      console.error("Error fetching clue:", error);
    }
  }, []);

  // 2. Initialize or reset the game
  const initGame = useCallback(() => {
    if (!config) return;
    const word = chooseRandomWord(config.words);
    setSelectedWord(word.toUpperCase());
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameStatus("playing");
    // Do NOT reset clue-related states here
    console.log(`New game initialized with word: ${word.toUpperCase()}`);
  }, [config, chooseRandomWord]);

  // 3. Once config is loaded, initialize game
  useEffect(() => {
    if (config) {
      initGame();
    }
  }, [config, initGame]);

  // 5. Handle letter guess
  const handleGuess = useCallback(
    async (letter: string) => {
      if (guessedLetters.has(letter) || gameStatus !== "playing" || showClue)
        return;

      setGuessedLetters((prev) => new Set(prev).add(letter));
      console.log(`Guessed letter: ${letter}`);

      if (!selectedWord.includes(letter)) {
        const newWrongGuesses = wrongGuesses + 1;
        setWrongGuesses(newWrongGuesses);
        console.log(`Wrong guesses: ${newWrongGuesses}`);

        if (newWrongGuesses >= (config?.maxWrongGuesses || 6)) {
          setGameStatus("lost");
          setConsecutiveWins(0);
          console.log("Game lost.");
        }
      } else {
        // Check if all letters have been guessed
        const wordLetters = new Set(selectedWord.split(""));
        const isWon = Array.from(wordLetters).every(
          (ltr) => guessedLetters.has(ltr) || ltr === letter
        );
        if (isWon) {
          setGameStatus("won");
          setCompletedWords((prev) => new Set(prev).add(selectedWord));
          setConsecutiveWins((prev) => prev + 1);
          console.log(`Game won! Consecutive wins: ${consecutiveWins + 1}`);

          if (consecutiveWins + 1 >= (config?.requiredWins || 3)) {
            setShowClue(true);
            console.log("Required wins achieved. Fetching clue...");
            await fetchClue(selectedWord);
          } else {
            initGame(); // Start new game immediately if not reached required wins
          }
        }
      }
    },
    [
      guessedLetters,
      gameStatus,
      showClue,
      selectedWord,
      wrongGuesses,
      config,
      fetchClue,
      initGame,
      consecutiveWins,
    ]
  );

  // 4. Listen for keyboard input
  useEffect(() => {
    if (gameStatus !== "playing" || showClue) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) {
        handleGuess(letter);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStatus, showClue, handleGuess]);

  // 7. Render the display word with guessed letters
  const renderWord = () => {
    const letters = selectedWord.split("");
    return (
      <div className="flex justify-center min-w-[200px]">
        {letters.map((letter, idx) => (
          <span
            key={idx}
            className="text-2xl mx-1 border-b-2 border-gray-400 w-8 inline-block text-center"
          >
            {guessedLetters.has(letter) ? letter : ""}
          </span>
        ))}
      </div>
    );
  };

  // 8. Render the on-screen keyboard
  const renderKeyboard = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return (
      <div className="mt-4 grid grid-cols-7 gap-2">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.has(letter) || gameStatus !== "playing" || showClue}
            className={`px-3 py-2 rounded ${
              guessedLetters.has(letter)
                ? selectedWord.includes(letter)
                  ? "bg-green-300"
                  : "bg-red-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {letter}
          </button>
        ))}
      </div>
    );
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading Hangman Config...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-fit flex flex-col items-center p-4 bg-white rounded-lg shadow-md m-4">
        <h1 className="text-3xl font-bold mb-4">Hangman</h1>
        <p className="text-sm text-gray-600 mb-4">
          Win {config.requiredWins} games in a row! {consecutiveWins}/{config.requiredWins}
        </p>

        {/* Add completed words display */}
        <div className="mb-4 text-sm">
          <p className="font-semibold mb-2">Completed Words:</p>
          <div className="flex flex-wrap gap-2 max-w-md justify-center">
            {Array.from(completedWords).map((word) => (
              <span
                key={word}
                className="px-2 py-1 bg-green-100 text-green-800 rounded"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          {/* Display the word */}
          <div className="flex">{renderWord()}</div>

          {/* Display wrong guesses */}
          <div className="mt-2">
            <p>
              Wrong Guesses: {wrongGuesses}/{config.maxWrongGuesses}
            </p>
          </div>

          {/* Render the on-screen keyboard */}
          {renderKeyboard()}

          {/* Modify game status display */}
          {gameStatus === "won" && !showClue && (
            <div className="mt-4 p-4 bg-green-100 text-center rounded">
              <p className="text-xl font-semibold">
                Well done! Next word in 1.5 seconds...
              </p>
              <p>Progress: {consecutiveWins}/{config.requiredWins}</p>
            </div>
          )}

          {showClue && clueMessage && (
            <div className="mt-4 p-4 bg-green-100 text-center rounded">
              <p className="text-xl font-semibold">
                Nice!
              </p>
              <p className="mt-2">{clueMessage}</p>
              {/* Restart Button */}
              <button
                onClick={() => {
                  setShowClue(false);
                  setClueMessage(null);
                  setConsecutiveWins(0); // Reset consecutive wins after showing clue
                  setCompletedWords(new Set()); // Reset completed words if desired
                  initGame(); // Start a new game
                }}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Restart Game
              </button>
            </div>
          )}

          {gameStatus === "lost" && (
            <div className="mt-4 p-4 bg-red-100 text-center rounded">
              <p className="text-xl font-semibold">
                Game Over! The word was: {selectedWord}
              </p>
              <button
                onClick={initGame}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

