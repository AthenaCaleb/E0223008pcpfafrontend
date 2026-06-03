import React, { createContext, useReducer, useEffect, useContext } from "react";
import axios from "axios";
import { appReducer, initialState } from "../reducer/appReducer.js";

const AppStateContext = createContext();

// Create configured Axios instance
export const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Request interceptor to automatically attach authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Sync state to window.appState
  useEffect(() => {
    window.appState = {
      authUser: state.authUser,
      token: state.token,
      users: state.users,
      projects: state.projects,
      issues: state.issues,
      comments: state.comments,
      filters: state.filters,
      analytics: state.analytics
    };
    console.log("window.appState updated:", window.appState);
  }, [state]);

  // Actions
  const loginUser = (user, token) => {
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logoutUser = () => {
    dispatch({ type: "LOGOUT" });
  };

  const setUsers = (users) => {
    dispatch({ type: "SET_USERS", payload: users });
  };

  const setProjects = (projects) => {
    dispatch({ type: "SET_PROJECTS", payload: projects });
  };

  const setIssues = (issues) => {
    dispatch({ type: "SET_ISSUES", payload: issues });
  };

  const setComments = (comments) => {
    dispatch({ type: "SET_COMMENTS", payload: comments });
  };

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const setAnalytics = (analytics) => {
    dispatch({ type: "SET_ANALYTICS", payload: analytics });
  };

  // Centralized API loaders
  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error("loadUsers error:", err);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await api.get("/projects");
      if (res.data.success) setProjects(res.data.data);
    } catch (err) {
      console.error("loadProjects error:", err);
    }
  };

  const loadIssues = async () => {
    try {
      // Build query string from filters
      const { status, priority, severity, search, page, limit } = state.filters;
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (priority) params.append("priority", priority);
      if (severity) params.append("severity", severity);
      if (search) params.append("search", search);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const res = await api.get(`/issues?${params.toString()}`);
      if (res.data.success) setIssues(res.data.data);
    } catch (err) {
      console.error("loadIssues error:", err);
    }
  };

  const loadComments = async () => {
    try {
      const res = await api.get("/comments");
      if (res.data.success) setComments(res.data.data);
    } catch (err) {
      console.error("loadComments error:", err);
    }
  };

  const loadAnalytics = async () => {
    try {
      // Fetch only if role is admin or manager
      if (state.authUser && (state.authUser.role === "admin" || state.authUser.role === "manager")) {
        const [issuesRes, projectsRes, devsRes] = await Promise.all([
          api.get("/analytics/issues").catch(() => ({ data: { data: {} } })),
          api.get("/analytics/projects").catch(() => ({ data: { data: {} } })),
          api.get("/analytics/developers").catch(() => ({ data: { data: {} } }))
        ]);

        const merged = {
          ...(issuesRes.data?.data || {}),
          ...(projectsRes.data?.data || {}),
          ...(devsRes.data?.data || {})
        };
        setAnalytics(merged);
      }
    } catch (err) {
      console.error("loadAnalytics error:", err);
    }
  };

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        loginUser,
        logoutUser,
        setUsers,
        setProjects,
        setIssues,
        setComments,
        setFilters,
        setAnalytics,
        loadUsers,
        loadProjects,
        loadIssues,
        loadComments,
        loadAnalytics
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
