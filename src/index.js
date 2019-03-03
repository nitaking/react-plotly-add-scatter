import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Scatter from "./Scatter";

function App() {
  return (
    <div className="App">
      <h1>React Ploty Sample</h1>
      <Scatter />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
