"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Config = {
  correctWordle: string;
  correctPurpleGroup: string;
  correctStrandsTheme: string;
  clue: string;
  nextPage: string;
};

export default function HomePage() {
  const [wordleInput, setWordleInput] = useState("");
  const [purpleGroupDescription, setPurpleGroupDescription] = useState("");
  const [strandsThemeInput, setStrandsThemeInput] = useState("");
  const [clueMessage, setClueMessage] = useState<string | null>(null);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    fetch("/api/config/astrid-and-orion")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setWordleInput(data.correctWordle);
        setPurpleGroupDescription(data.correctPurpleGroup);
        setStrandsThemeInput(data.correctStrandsTheme);
      })
      .catch((err) => console.error("Failed to fetch config:", err));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/verify-nyt-games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordle: wordleInput,
          purpleGroup: purpleGroupDescription,
          strandsTheme: strandsThemeInput,
        }),
      });

      const data = await response.json();
      if (response.ok && data.message === config?.clue) {
        setClueMessage(data.message);
      } else {
        setClueMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setClueMessage("An error occurred while verifying your answers.");
    }
  };

  if (!config) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">NYT Games Challenge</h1>
      
      <div className="mt-4">
        <a href="https://www.nytimes.com/games/wordle" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Play Wordle
        </a>
      </div>
      <div className="mt-4">
        <a href="https://www.nytimes.com/games/connections" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Play Connections
        </a>
      </div>
      <div className="mt-4">
        <a href="https://www.nytimes.com/games/strands" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Play Strands
        </a>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center space-y-2 w-96">
        <input
          type="text"
          value={wordleInput}
          onChange={(e) => setWordleInput(e.target.value)}
          placeholder="Enter Wordle Word"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <input
          type="text"
          value={purpleGroupDescription}
          onChange={(e) => setPurpleGroupDescription(e.target.value)}
          placeholder="Enter Purple Group Description"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <input
          type="text"
          value={strandsThemeInput}
          onChange={(e) => setStrandsThemeInput(e.target.value)}
          placeholder="Enter Strands Daily Theme"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>

      {clueMessage && config && (
        <div className="mt-4 text-center p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <p className="text-2xl font-semibold mb-4">{clueMessage}</p>
          <Link 
            href={config.nextPage}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Continue to Next Challenge
          </Link>
        </div>
      )}

      <div className="mt-8 text-center text-gray-600 max-w-2xl">
        <p>Note: The answers for these games have been manually implemented for this treasure hunt.</p>
        <p>The boxes above are pre-filled with the correct answers for 12/25/24.</p>
      </div>
    </div>
  );
}