import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Cell from './components/Cell';
import './App.css';

interface ExecutionResult {
  cellId: number;
  output: string;
}

const socket: Socket = io('http://localhost:8000/ws');

const App: React.FC = () => {
  const [cells, setCells] = useState<number[]>([1]);
  const [results, setResults] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connecté au serveur FastAPI');
    });

    socket.on('execution_result', (data: ExecutionResult) => {
      setResults(prev => ({ ...prev, [data.cellId]: data.output }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleExecute = (cellId: number, code: string) => {
    socket.emit('execute_code', { code, cellId });
  };

  const addCell = () => {
    setCells(prev => [...prev, prev.length + 1]);
  };

  return (
    <div className="App">
      <h1>Mon Notebook TSX</h1>
      {cells.map(id => (
        <Cell
          key={id}
          id={id}
          onExecute={handleExecute}
          output={results[id]}
        />
      ))}
      <button onClick={addCell}>Ajouter une cellule</button>
    </div>
  );
};

export default App;
