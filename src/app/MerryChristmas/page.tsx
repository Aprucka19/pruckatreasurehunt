"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ApiResponse = {
  message: string;
};

type Config = {
  requiredScore: number;
  clue: string;
  nextPage: string;
};

export default function MerryChristmasPage() {
  const [score, setScore] = useState(0);
  const [clueMessage, setClueMessage] = useState<string | null>(null);
  const [clueReceived, setClueReceived] = useState(false);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    // Fetch config when component mounts
    fetch('/api/config/merry-christmas')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to fetch config:', err));
  }, []);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const eventData = event.data as { score?: number };
      if (eventData?.score !== undefined && config) {
        const newScore = Number(eventData.score);
        
        if (newScore !== score) {
          setScore(newScore);
          
          if (newScore >= config.requiredScore && !clueReceived) {
            try {
              const response = await fetch('/api/verify-score', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score: newScore })
              });
              
              if (response.ok) {
                const data = await response.json() as ApiResponse;
                setClueMessage(config.clue);
                setClueReceived(true);
              }
            } catch (error) {
              console.error('Failed to verify score:', error);
            }
          }
        }
      }
    };
  
    window.addEventListener("message", handleMessage as unknown as EventListener);
    return () => window.removeEventListener("message", handleMessage as unknown as EventListener);
  }, [score, clueReceived, config]);

  if (!config) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center w-full relative">
      <h2 className="text-2xl font-bold my-4">Reach {config.requiredScore}!</h2>
      
      <iframe 
        src="/dino-game/index.html"
        className="w-full"
        style={{ height: "calc(50vh)" }}
        scrolling="no"
      />
      
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
    </div>
  );
} 