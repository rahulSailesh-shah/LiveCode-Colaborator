import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import CodeEditor from "./Editor";

/**
 * App component
 * @returns {React.FC} React functional component
 */

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id/:userId" element={<CodeEditor />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
