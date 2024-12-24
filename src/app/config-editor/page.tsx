"use client";

import React, { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ConfigEditorFields } from "./ConfigEditorFields";

export default function ConfigEditorPage() {
  const [localConfig, setLocalConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/get-config");
        const data = await response.json();
        setLocalConfig(data);
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (path: string[], newValue: any) => {
    setLocalConfig((prevConfig: any) => {
      return updateNestedValue(prevConfig, path, newValue);
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localConfig),
      });
      
      if (!response.ok) throw new Error("Failed to save config");
      alert("Config saved successfully!");
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Failed to save config.");
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <SignedOut>
        <div className="flex flex-col space-y-4 items-center justify-center">
          <p className="text-lg">
            You must be signed in to view the Config Editor.
          </p>
          <SignInButton />
        </div>
      </SignedOut>

      <SignedIn>
        <h1 className="text-2xl font-bold mb-6">Dynamic Config Editor</h1>

        {localConfig && (
          <ConfigEditorFields 
            config={localConfig} 
            path={[]} 
            onChange={handleChange} 
          />
        )}

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Save Config
        </button>
      </SignedIn>
    </div>
  );
}

function updateNestedValue(obj: any, path: (string | number)[], newValue: any): any {
  if (path.length === 0) return newValue;
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return { ...obj, [head as string | number]: newValue };
  }
  return {
    ...obj,
    [head as string | number]: updateNestedValue(obj?.[head as string | number] ?? {}, rest, newValue),
  };
}
