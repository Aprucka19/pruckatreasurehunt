import React from "react";

type OnChangeHandler = (path: string[], newValue: any) => void;

interface ConfigEditorFieldsProps {
  config: any; 
  path: string[];
  onChange: OnChangeHandler;
}

export function ConfigEditorFields({
  config,
  path,
  onChange,
}: ConfigEditorFieldsProps) {
  // If config is not an object, just return null
  if (typeof config !== "object" || config === null) {
    return null;
  }

  return (
    <div className="space-y-4">
      {Object.entries(config).map(([key, value]) => {
        const currentPath = [...path, key];
        const valueType = typeof value;

        // If the value is an object, recurse
        if (value && valueType === "object") {
          return (
            <div key={key} className="border p-4 rounded">
              <div className="text-lg font-semibold mb-2">{key}</div>
              <ConfigEditorFields
                config={value}
                path={currentPath}
                onChange={onChange}
              />
            </div>
          );
        }

        // Otherwise, render an input for the primitive type
        return (
          <div key={key}>
            <label className="block font-medium">{key}</label>
            {/* Decide which input type to use based on type */}
            {valueType === "number" ? (
              <input
                type="number"
                className="border p-1 w-full"
                value={String(value)}
                onChange={(e) => {
                  const newVal = parseFloat(e.target.value);
                  onChange(currentPath, newVal);
                }}
              />
            ) : (
              <input
                type="text"
                className="border p-1 w-full"
                value={String(value)}
                onChange={(e) => {
                  onChange(currentPath, e.target.value);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
