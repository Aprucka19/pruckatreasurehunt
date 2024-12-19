"use client";

import { useEffect, useState } from "react";

// Define the ApiResponse type
type ApiResponse = {
  message: string;
};

export default function MerryChristmasPage() {
  const [score, setScore] = useState(0);
  const [clueMessage, setClueMessage] = useState<string | null>(null);
  const [clueReceived, setClueReceived] = useState(false);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const eventData = event.data as { score?: number };
      if (eventData?.score !== undefined) {
        const newScore = Number(eventData.score);
        
        if (newScore !== score) {
          setScore(newScore);
          
          if (newScore >= 100 && !clueReceived) {
            try {
              const response = await fetch('/api/verify-score', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score: newScore })
              });
              
              if (response.ok) {
                const data: ApiResponse = await response.json() as ApiResponse;
                setClueMessage(data.message);
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
  }, [score, clueReceived]);
  

  return (
    <div className="flex flex-col items-center w-full relative">
      <h2 className="text-2xl font-bold my-4">Reach 1000!</h2>
      
      <iframe 
        src="/dino-game/index.html"
        className="w-full"
        style={{ height: "calc(15vh)" }}
        scrolling="no"
      />
      
      {clueMessage && (
        <div className="mt-4 text-center p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <p className="text-2xl font-semibold">{clueMessage}</p>
        </div>
      )}
    </div>
  );
} 