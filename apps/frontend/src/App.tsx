import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./Home";
import CodeEditor from "./Editor";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/room/:id" element={<CodeEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const ProtectedRoute: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      // Simulating an asynchronous login check
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLogged(true);
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isLogged ? <Outlet /> : <Navigate to="/" replace />;
};

export default App;
