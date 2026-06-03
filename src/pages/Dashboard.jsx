import React, { useEffect, useState } from "react";
import { useAppState, api } from "../context/AppState.jsx";

const Dashboard = () => {
  const {
    authUser,
    analytics,
    loadAnalytics,
    loadUsers,
    loadProjects,
    loadIssues,
    loadComments
  } = useAppState();

  const [syncStatus, setSyncStatus] = useState("");
  const [healthInfo, setHealthInfo] = useState({ database: "unknown", documentCount: 0 });

  const fetchHealth = async () => {
    try {
      const res = await api.get("/health");
      if (res.data.success) {
        setHealthInfo({
          database: res.data.database,
          documentCount: res.data.documentCount
        });
      }
    } catch (err) {
      console.error("Health check failed:", err);
    }
  };

  const handleSync = async () => {
    setSyncStatus("Synchronizing dataset...");
    try {
      const res = await api.post("/sync");
      if (res.data.success) {
        setSyncStatus(
          `Sync Successful! Fetched: ${res.data.totalFetched}, Inserted: ${res.data.inserted}, Duplicates: ${res.data.duplicates}, Rejected: ${res.data.rejected}`
        );
        // Reload all data
        await Promise.all([
          loadUsers(),
          loadProjects(),
          loadIssues(),
          loadComments(),
          loadAnalytics(),
          fetchHealth()
        ]);
      } else {
        setSyncStatus("Sync failed: " + res.data.message);
      }
    } catch (err) {
      setSyncStatus("Sync failed: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    loadAnalytics();
    fetchHealth();
  }, []);

  const isAdminOrManager = authUser?.role === "admin" || authUser?.role === "manager";

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome back, <strong>{authUser?.name}</strong> (Role: {authUser?.role})</p>

      {/* Sync Button & Health (Visible to Admin/Manager) */}
      <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
        <h3>Database Synchronization & Health</h3>
        <p>Database Connection Status: <strong>{healthInfo.database}</strong></p>
        <p>Total Issues in DB: <strong>{healthInfo.documentCount}</strong></p>
        
        {isAdminOrManager ? (
          <div>
            <button onClick={handleSync}>Synchronize with External API</button>
            {syncStatus && <p>{syncStatus}</p>}
          </div>
        ) : (
          <p style={{ color: "gray" }}>Only Admins and Managers can run sync operations.</p>
        )}
      </div>

      {/* Analytics Container */}
      <div data-testid="analytics-container" style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
        <h3>Analytics</h3>
        
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div data-testid="total-issues-card" style={{ border: "1px solid gray", padding: "10px" }}>
            <h4>Total Issues</h4>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>{analytics.totalIssues || 0}</p>
          </div>

          <div data-testid="open-issues-card" style={{ border: "1px solid gray", padding: "10px" }}>
            <h4>Open Issues</h4>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>{analytics.openIssues || 0}</p>
          </div>

          <div data-testid="closed-issues-card" style={{ border: "1px solid gray", padding: "10px" }}>
            <h4>Closed Issues</h4>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>{analytics.closedIssues || 0}</p>
          </div>

          <div data-testid="active-projects-card" style={{ border: "1px solid gray", padding: "10px" }}>
            <h4>Active Projects</h4>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>{analytics.activeProjectCount || 0}</p>
          </div>
        </div>

        {/* Issue Analytics Chart (Required data-testid) */}
        <div data-testid="issue-chart" style={{ border: "1px dashed gray", padding: "15px", margin: "15px 0" }}>
          <strong>[Issue Analytics Chart Placeholder]</strong>
          <p>Mocking Chart Data (No complex charting library used):</p>
          <ul>
            <li>Open: {analytics.openIssues || 0}</li>
            <li>Resolved: {analytics.resolvedIssues || 0}</li>
            <li>Closed: {analytics.closedIssues || 0}</li>
          </ul>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div data-testid="recent-activity" style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
        <h3>Recent Activity Logs</h3>
        <p>No recent activity parsed (Analytics mode simple/disabled).</p>
      </div>
    </div>
  );
};

export default Dashboard;
