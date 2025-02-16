import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const keycloakAdminUrl = "http://localhost:8080"; // Your Keycloak host
  const realmName = "demo"; // Updated to use "demo" as per your setup
  const clientId = "demo_client";
  const clientSecret = "cfeBarPmQMmv3EsyxEiusmGiwjIH7qCB"; // Your secret

  // Function to get an Admin Token from Keycloak
  const getAdminToken = async () => {
    try {
      const response = await axios.post(
        `${keycloakAdminUrl}/realms/${realmName}/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      return response.data.access_token; // Return the token
    } catch (error) {
      console.error("Error getting admin token:", error.response?.data || error.message);
      alert("Failed to get admin token.");
      return null;
    }
  };

  // Function to register a new user
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get the admin token
    const adminToken = await getAdminToken();
    if (!adminToken) {
      setLoading(false);
      return;
    }

    // User data payload
    const userPayload = {
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      enabled: true,
      emailVerified: false,
      credentials: [
        {
          type: "password",
          value: password,
          temporary: false,
        },
      ],
    };

    try {
      // Create the user in Keycloak
      const response = await axios.post(
        `${keycloakAdminUrl}/admin/realms/${realmName}/users`,
        userPayload,
        { headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        alert("User registered successfully!");
        navigate("/"); // Redirect to login page
      } else {
        alert("User registration failed.");
      }
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error.message);
      alert("Failed to register user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex center full bg-light">
      <div className="card">
        <h2 className="title">Register</h2>
        
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="input" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />

        <div className="btn-group">
          <button onClick={handleRegister} className="btn primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <button onClick={() => navigate("/")} className="btn secondary">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
