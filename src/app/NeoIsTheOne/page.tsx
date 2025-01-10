"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { config } from "~/config/config";

const CrosswordEmbed = dynamic(() => import("../_components/CrosswordEmbed"), {
  ssr: false,
});

type Config = typeof config.CrosswordConfig;

export default function CrosswordPage() {
  const [answer, setAnswer] = useState("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    fetch("/api/config/crossword")
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Failed to fetch config:", err));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/verify-crossword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
      });

      const data = await response.json();
      if (data.clue) {
        setResponseMessage(data.clue);
      } else if (data.error) {
        setResponseMessage(data.error);
      }
    } catch (error) {
      console.error("Error verifying answer:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-2">Treasure Hunt Crossword</h1>
      
      <div className="w-full max-w-4xl bg-white p-4 rounded shadow">
        <CrosswordEmbed />
      </div>

      <div className="mt-6 mb-2 text-center text-gray-700">
        Enter the first letter of each word of the crossword, in order from 1 to 14
      </div>

      <form onSubmit={handleSubmit} className="mt-2 flex flex-col items-center space-y-2 w-66">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter Crossword Answer"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>

      {responseMessage && (
        <div className="mt-4 p-4 bg-white text-center shadow rounded">
          <p className="text-xl font-semibold mb-4">{responseMessage}</p>
          {config && responseMessage === config.clue && (
            <Link 
              href={config.nextPage}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Continue to Next Challenge
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
