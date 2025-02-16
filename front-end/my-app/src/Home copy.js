import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in:", username, password);
    // Add login logic
    navigate("/upload");
  };

  return (
    <div className="flex center full bg-light">
      <div className="card">
        
        <h2 className="title">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        
        <div className="btn-group">
          <button onClick={() => navigate("/register")} className="btn secondary">
            Register
          </button>
          <button onClick={handleLogin} className="btn primary">
            Login
          </button>
        </div>
      
      </div>
    </div>
  );
};

export default Home;
