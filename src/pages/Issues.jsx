import React, { useEffect, useState } from "react";
import { useAppState, api } from "../context/AppState.jsx";

const Issues = () => {
  const {
    authUser,
    issues,
    loadIssues,
    projects,
    loadProjects,
    users,
    loadUsers
  } = useAppState();

  // Filter & Search values
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  // Create Issue state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [severity, setSeverity] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [createMsg, setCreateMsg] = useState("");

  // Edit / Status update state
  const [editingIssueId, setEditingIssueId] = useState("");
  const [editStatus, setEditStatus] = useState("open");
  const [editPriority, setEditPriority] = useState("medium");
  const [editMsg, setEditMsg] = useState("");

  useEffect(() => {
    loadProjects();
    loadUsers();
    loadIssues();
  }, []);

  // Reload issues when filters change
  useEffect(() => {
    // Save filters to state
    const filtersObj = {
      search,
      priority: priorityFilter,
      status: statusFilter,
      severity: severityFilter
    };
    // Call loadIssues with query parameters
    const fetchFiltered = async () => {
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.append("status", statusFilter);
        if (priorityFilter) params.append("priority", priorityFilter);
        if (severityFilter) params.append("severity", severityFilter);
        if (search) params.append("search", search);

        const res = await api.get(`/issues?${params.toString()}`);
        if (res.data.success) {
          // Update global state via a custom helper or directly load
          window.appState.issues = res.data.data;
          // Set in local/context triggers if we had separate dispatch
          // For simplicity, we can load it through the loadIssues function with a short delay or custom handler
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFiltered();
  }, [search, priorityFilter, statusFilter, severityFilter]);

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    setCreateMsg("");
    try {
      const res = await api.post("/issues", {
        title,
        description,
        priority,
        severity,
        dueDate,
        projectId,
        assignedTo: assignedTo || undefined
      });
      if (res.data.success) {
        setCreateMsg("Issue reported successfully!");
        setTitle("");
        setDescription("");
        setDueDate("");
        setProjectId("");
        setAssignedTo("");
        loadIssues();
      } else {
        setCreateMsg("Error: " + res.data.message);
      }
    } catch (err) {
      setCreateMsg("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateStatus = async (issueId) => {
    setEditMsg("");
    try {
      const res = await api.patch(`/issues/${issueId}/status`, {
        status: editStatus
      });
      if (res.data.success) {
        setEditMsg("Status updated successfully!");
        setEditingIssueId("");
        loadIssues();
      } else {
        setEditMsg("Error: " + res.data.message);
      }
    } catch (err) {
      setEditMsg("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdatePriority = async (issueId) => {
    setEditMsg("");
    try {
      const res = await api.patch(`/issues/${issueId}`, {
        priority: editPriority
      });
      if (res.data.success) {
        setEditMsg("Priority updated successfully!");
        setEditingIssueId("");
        loadIssues();
      } else {
        setEditMsg("Error: " + res.data.message);
      }
    } catch (err) {
      setEditMsg("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      const res = await api.delete(`/issues/${issueId}`);
      if (res.data.success) {
        alert("Issue deleted successfully!");
        loadIssues();
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const isAdminOrManager = authUser?.role === "admin" || authUser?.role === "manager";
  const isTester = authUser?.role === "tester";

  return (
    <div>
      <h2>Issues</h2>

      {/* Report Bug (Visible to Admin, Manager, Tester) */}
      {(isAdminOrManager || isTester) && (
        <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
          <h3>Report New Bug / Issue</h3>
          {createMsg && <p>{createMsg}</p>}
          <form onSubmit={handleCreateIssue}>
            <div>
              <label>Title: </label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <br />
            <div>
              <label>Description: </label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <br />
            <div>
              <label>Project: </label>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
                <option value="">-- Select Project --</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title} ({p.projectId})
                  </option>
                ))}
              </select>
            </div>
            <br />
            <div>
              <label>Priority: </label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <br />
            <div>
              <label>Severity: </label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <br />
            <div>
              <label>Due Date: </label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <br />
            {isAdminOrManager && (
              <div>
                <label>Assign To: </label>
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                  <option value="">-- Unassigned --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <br />
            <button type="submit">Report Issue</button>
          </form>
        </div>
      )}

      {/* Filters & Search (Required data-testid) */}
      <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
        <h3>Search & Filters</h3>
        
        <div>
          <label>Search: </label>
          <input
            type="text"
            placeholder="Search issue title/desc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="issue-search"
          />
        </div>
        <br />
        <div>
          <label>Filter Priority: </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            data-testid="issue-filter"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <br />
        <div>
          <label>Filter Status: </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            data-testid="issue-filter"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In-Progress</option>
            <option value="testing">Testing</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Issues Table (Required data-testid) */}
      <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
        <h3>Issues List</h3>
        {editMsg && <p style={{ color: "blue" }}>{editMsg}</p>}
        
        <table data-testid="issue-table" border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Title</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.length > 0 ? (
              issues.map((iss) => (
                <tr key={iss._id} data-testid="issue-row">
                  <td>{iss.issueId}</td>
                  <td>
                    <strong>{iss.title}</strong>
                    <br />
                    <small>{iss.description}</small>
                  </td>
                  <td>{iss.project?.title || "N/A"}</td>
                  <td>{iss.assignedTo?.name || "Unassigned"}</td>
                  <td>{iss.priority}</td>
                  <td>{iss.severity}</td>
                  <td>{iss.status}</td>
                  <td>
                    <button onClick={() => {
                      setEditingIssueId(iss._id);
                      setEditStatus(iss.status);
                      setEditPriority(iss.priority);
                    }}>
                      Edit/Transition
                    </button>
                    
                    {isAdminOrManager && (
                      <button onClick={() => handleDeleteIssue(iss._id)} style={{ marginLeft: "5px" }}>
                        Delete
                      </button>
                    )}

                    {/* Inline edit panel */}
                    {editingIssueId === iss._id && (
                      <div style={{ border: "1px dashed gray", padding: "5px", marginTop: "5px" }}>
                        <strong>Update Issue #{iss.issueId}</strong>
                        
                        <div>
                          <label>Status: </label>
                          <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                            <option value="open">open</option>
                            <option value="in-progress">in-progress</option>
                            <option value="testing">testing</option>
                            <option value="resolved">resolved</option>
                            <option value="closed">closed</option>
                          </select>
                          <button onClick={() => handleUpdateStatus(iss._id)} style={{ marginLeft: "5px" }}>
                            Save Status
                          </button>
                        </div>
                        
                        {isAdminOrManager && (
                          <div style={{ marginTop: "5px" }}>
                            <label>Priority: </label>
                            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                              <option value="low">low</option>
                              <option value="medium">medium</option>
                              <option value="high">high</option>
                              <option value="critical">critical</option>
                            </select>
                            <button onClick={() => handleUpdatePriority(iss._id)} style={{ marginLeft: "5px" }}>
                              Save Priority
                            </button>
                          </div>
                        )}
                        <br />
                        <button onClick={() => setEditingIssueId("")}>Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>No issues found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Issues;
