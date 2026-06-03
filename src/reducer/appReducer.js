export const initialState = {
  authUser: JSON.parse(localStorage.getItem("authUser")) || null,
  token: localStorage.getItem("token") || null,
  users: [],
  projects: [],
  issues: [],
  comments: [],
  filters: {
    status: "",
    priority: "",
    severity: "",
    search: "",
    page: 1,
    limit: 10
  },
  analytics: {
    totalIssues: 0,
    openIssues: 0,
    resolvedIssues: 0,
    closedIssues: 0,
    activeProjectCount: 0,
    closedProjectCount: 0,
    projectWiseIssues: [],
    developerResolvedIssues: [],
    averageResolutionTime: "N/A",
    highestResolvedIssueCount: 0
  }
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("authUser", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        authUser: action.payload.user,
        token: action.payload.token
      };

    case "LOGOUT":
      localStorage.removeItem("authUser");
      localStorage.removeItem("token");
      return {
        ...state,
        authUser: null,
        token: null,
        users: [],
        projects: [],
        issues: [],
        comments: []
      };

    case "SET_USERS":
      return {
        ...state,
        users: action.payload
      };

    case "SET_PROJECTS":
      return {
        ...state,
        projects: action.payload
      };

    case "SET_ISSUES":
      return {
        ...state,
        issues: action.payload
      };

    case "SET_COMMENTS":
      return {
        ...state,
        comments: action.payload
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case "SET_ANALYTICS":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          ...action.payload
        }
      };

    default:
      return state;
  }
};
