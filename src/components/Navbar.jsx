import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppState.jsx";

const Navbar = () => {
  const { authUser, logoutUser } = useAppState();
  const navigate = useNavigate();

  if (!authUser) return null;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav data-testid="navbar" style={{ borderBottom: "1px solid black", padding: "10px", marginBottom: "15px" }}>
      <strong>BugTracker</strong> |{" "}
      <Link to="/dashboard" data-testid="dashboard-link">Dashboard</Link> |{" "}
      <Link to="/projects" data-testid="projects-link">Projects</Link> |{" "}
      <Link to="/issues" data-testid="issues-link">Issues</Link> |{" "}
      <Link to="/comments" data-testid="comments-link">Comments</Link> |{" "}
      <Link to="/users" data-testid="users-link">Users</Link> |{" "}
      <Link to="/profile">Profile</Link> |{" "}
      <button onClick={handleLogout} data-testid="logout-btn">Logout ({authUser.name})</button>
    </nav>
  );
};

export default Navbar;
