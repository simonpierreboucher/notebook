import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import './Cell.css';

interface CellProps {
  id: number;
  onExecute: (cellId: number, code: string) => void;
  output?: string;
}

const Cell: React.FC<CellProps> = ({ id, onExecute, output }) => {
  const [code, setCode] = useState<string>("");

  const handleExecute = () => {
    onExecute(id, code);
  };

  return (
    <div className="cell">
      <Editor
        height="200px"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
      />
      <button onClick={handleExecute}>Exécuter</button>
      {output && (
        <div className="output">
          <strong>Output:</strong>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default Cell;
