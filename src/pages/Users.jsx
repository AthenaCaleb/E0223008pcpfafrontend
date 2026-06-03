import React, { useEffect } from "react";
import { useAppState } from "../context/AppState.jsx";

const Users = () => {
  const { users, loadUsers } = useAppState();

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h2>User Management</h2>
      <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
        <h3>Registered & Synced Users</h3>
        <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id}>
                  <td>{u.userId}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.department || "N/A"}</td>
                  <td>{u.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No users found. Please synchronize data or register a user.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
