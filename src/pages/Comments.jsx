import React, { useEffect, useState } from "react";
import { useAppState, api } from "../context/AppState.jsx";

const Comments = () => {
  const { authUser, comments, loadComments, issues, loadIssues } = useAppState();

  const [message, setMessage] = useState("");
  const [issueId, setIssueId] = useState("");
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    loadComments();
    loadIssues();
  }, []);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setFormMsg("");
    try {
      const res = await api.post("/comments", {
        issueId,
        message
      });
      if (res.data.success) {
        setFormMsg("Comment added successfully!");
        setMessage("");
        setIssueId("");
        loadComments();
      } else {
        setFormMsg("Error: " + res.data.message);
      }
    } catch (err) {
      setFormMsg("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await api.delete(`/comments/${commentId}`);
      if (res.data.success) {
        alert("Comment deleted successfully!");
        loadComments();
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2>Comments</h2>

      {/* Add Comment Form */}
      <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
        <h3>Add New Comment</h3>
        {formMsg && <p>{formMsg}</p>}
        <form onSubmit={handleAddComment}>
          <div>
            <label>Select Issue: </label>
            <select value={issueId} onChange={(e) => setIssueId(e.target.value)} required>
              <option value="">-- Select Issue --</option>
              {issues.map((iss) => (
                <option key={iss._id} value={iss._id}>
                  {iss.title} ({iss.issueId})
                </option>
              ))}
            </select>
          </div>
          <br />
          <div>
            <label>Message: </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="3"
              cols="40"
            />
          </div>
          <br />
          <button type="submit" data-testid="add-comment-btn">Add Comment</button>
        </form>
      </div>

      {/* Comments List Table (Required data-testid) */}
      <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
        <h3>Comments List</h3>
        <table data-testid="comment-table" border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Comment ID</th>
              <th>Issue</th>
              <th>User</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.length > 0 ? (
              comments.map((c) => (
                <tr key={c._id} data-testid="comment-row">
                  <td>{c.commentId}</td>
                  <td>{c.issue?.title || "N/A"}</td>
                  <td>{c.user?.name || "Unknown"}</td>
                  <td>{c.message}</td>
                  <td>
                    {(String(c.user?._id) === String(authUser?.id) ||
                      authUser?.role === "admin" ||
                      authUser?.role === "manager") && (
                      <button onClick={() => handleDeleteComment(c._id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No comments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
