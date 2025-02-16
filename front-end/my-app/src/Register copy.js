import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering:", username, password);
    // Add register logic
  };

  return (
    <div className="flex center full bg-light">
      <div className="card">
        <h2 className="title">Register</h2>
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
          <button onClick={handleRegister} className="btn primary">
            Register
          </button>

          <button
            onClick={() => navigate("/")}
            className="btn secondary"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
