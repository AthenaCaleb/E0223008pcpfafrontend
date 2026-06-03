import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, api } from "../context/AppState.jsx";

const Login = () => {
  const { loginUser } = useAppState();
  const navigate = useNavigate();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("developer");
  const [regDept, setRegDept] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regError, setRegError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        loginUser(res.data.data.user, res.data.data.token);
        navigate("/dashboard");
      } else {
        setLoginError(res.data.message || "Login failed");
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || "Invalid credentials or connection error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    try {
      const res = await api.post("/auth/register", {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        department: regDept
      });
      if (res.data.success) {
        setRegSuccess("User registered successfully! You can now log in.");
        setRegName("");
        setRegEmail("");
        setRegPassword("");
        setRegDept("");
      } else {
        setRegError(res.data.message || "Registration failed");
      }
    } catch (err) {
      setRegError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h2>MERN Issue Tracker Authentication</h2>
      
      {/* Login Section */}
      <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
        <h3>Login</h3>
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}
        <form onSubmit={handleLogin} data-testid="login-form">
          <div>
            <label>Email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
              required
            />
          </div>
          <br />
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
              required
            />
          </div>
          <br />
          <button type="submit" data-testid="login-btn">Login</button>
        </form>
      </div>

      {/* Quick Register Section (for setting up test roles) */}
      <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
        <h3>Create Test User</h3>
        {regSuccess && <p style={{ color: "green" }}>{regSuccess}</p>}
        {regError && <p style={{ color: "red" }}>{regError}</p>}
        <form onSubmit={handleRegister}>
          <div>
            <label>Name: </label>
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label>Email: </label>
            <input
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label>Role: </label>
            <select value={regRole} onChange={(e) => setRegRole(e.target.value)}>
              <option value="admin">admin</option>
              <option value="manager">manager</option>
              <option value="developer">developer</option>
              <option value="tester">tester</option>
            </select>
          </div>
          <br />
          <div>
            <label>Department: </label>
            <input
              type="text"
              value={regDept}
              onChange={(e) => setRegDept(e.target.value)}
            />
          </div>
          <br />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
