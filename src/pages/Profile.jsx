import React from "react";
import { useAppState } from "../context/AppState.jsx";

const Profile = () => {
  const { authUser } = useAppState();

  return (
    <div>
      <h2>User Profile</h2>
      {authUser ? (
        <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
          <h3>Profile Details</h3>
          <p>User Database ID: <strong>{authUser.id || authUser._id}</strong></p>
          <p>User ID: <strong>{authUser.userId}</strong></p>
          <p>Name: <strong>{authUser.name}</strong></p>
          <p>Email: <strong>{authUser.email}</strong></p>
          <p>Role: <strong>{authUser.role}</strong></p>
          <p>Department: <strong>{authUser.department || "N/A"}</strong></p>
          <p>Status: <strong>{authUser.status}</strong></p>
        </div>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
};

export default Profile;
