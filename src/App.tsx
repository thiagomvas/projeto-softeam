// Filename - App.js

import "./App.css";
// importing components from react-router-dom package
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import Home component
import Login from "./Components/LoginPage";
import Register from "./Components/RegisterPage";
import Turmas from "./TurmaPage";
import UserPage from "./Components/UserPage";
import React from "react";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/turma" element={<Turmas />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
