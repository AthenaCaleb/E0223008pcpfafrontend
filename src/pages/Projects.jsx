import React, { useEffect, useState } from "react";
import { useAppState, api } from "../context/AppState.jsx";

const Projects = () => {
  const { authUser, projects, loadProjects, users, loadUsers } = useAppState();

  // Search & Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state (Admin/Manager only)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("active");
  const [startDate, setStartDate] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [message, setMessage] = useState("");

  // Assign Issue Modal/Form state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignIssueId, setAssignIssueId] = useState("");
  const [assignUserId, setAssignUserId] = useState("");
  const [assignMsg, setAssignMsg] = useState("");

  useEffect(() => {
    loadProjects();
    loadUsers();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await api.post("/projects", {
        title,
        description,
        category,
        status,
        startDate: startDate || new Date().toISOString().split("T")[0],
        members: selectedMembers
      });
      if (res.data.success) {
        setMessage("Project created successfully!");
        setTitle("");
        setDescription("");
        setCategory("");
        setStartDate("");
        setSelectedMembers([]);
        loadProjects();
      } else {
        setMessage("Error: " + res.data.message);
      }
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAssignIssue = async (e) => {
    e.preventDefault();
    setAssignMsg("");
    try {
      const res = await api.patch(`/issues/${assignIssueId}/assign`, {
        assignedTo: assignUserId
      });
      if (res.data.success) {
        setAssignMsg("Issue assigned successfully!");
        setAssignIssueId("");
        setAssignUserId("");
        setTimeout(() => setShowAssignModal(false), 1500);
      } else {
        setAssignMsg("Error: " + res.data.message);
      }
    } catch (err) {
      setAssignMsg("Error: " + (err.response?.data?.message || err.message));
    }
  };

  // Filter projects by search query
  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.projectId?.toLowerCase().includes(q)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isAdminOrManager = authUser?.role === "admin" || authUser?.role === "manager";

  return (
    <div>
      <h2>Projects</h2>

      {/* Assign Issue Button (Required data-testid) */}
      {isAdminOrManager && (
        <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
          <h3>Assign Issues</h3>
          <button data-testid="assign-issue-btn" onClick={() => setShowAssignModal(!showAssignModal)}>
            {showAssignModal ? "Hide Assignment Form" : "Open Issue Assignment Form"}
          </button>

          {showAssignModal && (
            <form onSubmit={handleAssignIssue} style={{ marginTop: "10px" }}>
              {assignMsg && <p>{assignMsg}</p>}
              <div>
                <label>Issue MongoDB ID: </label>
                <input
                  type="text"
                  placeholder="e.g. 64b8a2..."
                  value={assignIssueId}
                  onChange={(e) => setAssignIssueId(e.target.value)}
                  required
                />
              </div>
              <br />
              <div>
                <label>Assign To (User): </label>
                <select value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)} required>
                  <option value="">-- Select Developer --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
              <br />
              <button type="submit">Submit Assignment</button>
            </form>
          )}
        </div>
      )}

      {/* Create Project Section (Admin/Manager only) */}
      {isAdminOrManager && (
        <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
          <h3>Create New Project</h3>
          {message && <p>{message}</p>}
          <form onSubmit={handleCreateProject}>
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
              <label>Category: </label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <br />
            <div>
              <label>Status: </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <br />
            <div>
              <label>Start Date: </label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <br />
            <div>
              <label>Members: </label>
              <select
                multiple
                value={selectedMembers}
                onChange={(e) =>
                  setSelectedMembers(Array.from(e.target.selectedOptions, (option) => option.value))
                }
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <p style={{ fontSize: "12px", color: "gray" }}>Hold Ctrl to select multiple members</p>
            </div>
            <br />
            <button type="submit" data-testid="create-project-btn">Create Project</button>
          </form>
        </div>
      )}

      {/* Project Search (Required data-testid) */}
      <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
        <h3>Search & List Projects</h3>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          data-testid="project-search"
        />

        {/* Project List (Required data-testid) */}
        <ul data-testid="project-list" style={{ marginTop: "15px" }}>
          {paginatedProjects.length > 0 ? (
            paginatedProjects.map((p) => (
              <li key={p._id} style={{ marginBottom: "10px", listStyle: "none", borderBottom: "1px dotted gray" }}>
                <strong>{p.title}</strong> ({p.projectId})<br />
                <em>Category: {p.category || "None"} | Status: {p.status}</em><br />
                <small>{p.description}</small><br />
                <small>Owner: {p.owner?.name || "N/A"} | Members: {p.members?.map(m => m.name).join(", ") || "None"}</small>
              </li>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </ul>

        {/* Pagination (Required data-testid) */}
        <div style={{ marginTop: "10px" }}>
          <button
            data-testid="pagination-prev"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            data-testid="pagination-next"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Projects;
