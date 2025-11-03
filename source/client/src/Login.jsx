import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import logo from "./assets/logoApp.png";

const LoginPage = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleEnter = () => {
    if (!name) return;
    navigate("/chat", { state: { name } });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleEnter();
  };

  return (
    <div className="login-page">
      <img src={logo} alt="App Logo" className="login-logo" />
      <h2>Welcome to Chat</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter your name"
      />
      <button onClick={handleEnter}>Enter Chat</button>
    </div>
  );
};

export default LoginPage;
