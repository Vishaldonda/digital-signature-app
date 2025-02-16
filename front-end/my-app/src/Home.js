import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const keycloakUrl = "http://localhost:8080";
  const realmName = "demo"; // Update this if your realm name is different
  const clientId = "demo_client"; // Replace with your client ID
  const clientSecret = "cfeBarPmQMmv3EsyxEiusmGiwjIH7qCB"; // Replace with your client secret

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    // 🚀 Check if username or password is empty
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      setLoading(false);
      return;
    }
  
    try {
      // Send login request to Keycloak
      const response = await axios.post(
        `${keycloakUrl}/realms/${realmName}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          username: username,
          password: password,
          grant_type: "password",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
  
      // If successful, store the token
      const accessToken = response.data.access_token;
      localStorage.setItem("access_token", accessToken);
      alert("Login successful!");
  
      // Redirect to Upload Page
      navigate("/upload");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex center full bg-light">
      <div className="card">
        <h2 className="title">Login</h2>
        
        {error && <p className="error">{error}</p>}

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
          <button onClick={handleLogin} className="btn primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
