"use client";

import { useState } from "react";

export default function HomePage() {
  const [wordleInput, setWordleInput] = useState("");
  const [purpleGroupDescription, setPurpleGroupDescription] = useState("");
  const [strandsThemeInput, setStrandsThemeInput] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

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

      const data: { message: string } = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      console.error("Error verifying answers:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="container flex flex-col items-center justify-start space-y-4 px-4 py-8">
        <div className="mt-8">
          <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
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

        {responseMessage && (
          <div className="mt-4 text-center p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <p className="text-2xl font-semibold">{responseMessage}</p>
          </div>
        )}
      </div>
    </main>
  );
}