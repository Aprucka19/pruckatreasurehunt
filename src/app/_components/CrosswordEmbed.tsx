// components/CrosswordEmbed.js
"use client";

import { useEffect } from "react";

export default function CrosswordEmbed() {
  useEffect(() => {
    // Inject the stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://crosswords.brightsprout.com/assets/css/iFrame.min.css?92";
    document.head.appendChild(link);

    // Create iframe instead of using the script
    const iframe = document.createElement("iframe");
    iframe.src = "https://crosswords.brightsprout.com/1472072/Treasure-Hunt-Crossword";
    iframe.style.width = "100%";
    iframe.style.height = "300px";  // Adjust height as needed
    iframe.style.border = "none";
    
    const container = document.getElementById("crossword-container");
    if (container) {
      container.appendChild(iframe);
    }

    // Cleanup on unmount
    return () => {
      document.head.removeChild(link);
      if (container && container.contains(iframe)) {
        container.removeChild(iframe);
      }
    };
  }, []);

  return <div id="crossword-container" className="w-full"></div>;
}