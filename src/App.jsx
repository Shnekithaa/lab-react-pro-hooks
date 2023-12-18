import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './App.css';

const LARGE_NUMBER = 1000000000;

function App() {
  const [value, setValue] = useState(0);
  const [dark, setTheme] = useState(true);
  const [themeName, setThemeName] = useState("dark");
  const [currentList, setList] = useState([]);
  const [delayResult, setDelayResult] = useState(null);

  const delayFunction = useCallback(() => {
    const worker = new Worker('./delayWorker.js');

    worker.onmessage = (event) => {
      setDelayResult(event.data);
      // worker.terminate();
    };

    worker.postMessage({ value });
  }, [value]);

  const testFunction = useCallback(() => {
    return [value * 3, value * 4];
  }, [value]);

  useEffect(() => {
    if (delayResult !== null) {
      console.log("Delay function ran");
    }
  }, [delayResult]);

  useEffect(() => {
    if (dark) {
      setThemeName("dark");
    } else {
      setThemeName("light");
    }
  }, [dark]);

  const handleClick = () => {
    setTheme(!dark);
  };

  const handleChangeValue = () => {
    setValue((prevValue) => {
      console.log("Delay function ran");
      return prevValue + 1;
    });

    console.log("Callback function was called");
  };

  const handleList = useCallback(() => {
    setList(testFunction);
  }, [testFunction]);

  const styleTheme = useMemo(() => {
    return {
      backgroundColor: dark ? "black" : "#ccc7c7",
    };
  }, [dark]);

  return (
    <div className="page" style={styleTheme}>
      <button onClick={handleClick}>{themeName}</button>
      <h1>{value}</h1>
      <button onClick={handleChangeValue}>Change Value</button>
      <button onClick={handleList}>Show List</button>
      <h2>{delayResult !== null ? delayResult : delayFunction()}</h2>
      <div>
        {currentList.map((item, index) => {
          return <h2 key={index}>{item}</h2>;
        })}
      </div>
    </div>
  );
}

export default App;
