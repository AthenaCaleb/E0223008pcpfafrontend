# Issue / Bug Tracking System - Frontend (Set B)

The React-based Single Page Application (SPA) frontend for the Issue & Bug Tracking Management System. Consumes the MERN backend APIs and features state management via React Context API + Reducer.

## Features
- **No CSS Styling**: Built entirely with plain HTML elements to keep the interface simple and clear.
- **JWT-Based Session Persistence**: Token is maintained in global state and persists on refresh.
- **Protected Routes**: Restricts route access by user role.
- **Global State Exposure**: Exposes the React state to `window.appState` for compliance.

---

## Global State Structure
Exposed globally as `window.appState`:
```js
window.appState = {
  authUser,      // Current logged-in user object
  token,         // JWT token string
  users,         // Array of all system users
  projects,      // Array of projects
  issues,        // Array of issues
  comments,      // Array of comments
  filters,       // Query filters (search, priority, status)
  analytics      // Simple counts of issues/projects
}
```

---

## Routing Table
- `/login` - Auth forms (Login and Register)
- `/dashboard` - Overview metrics, DB Health, and API Synchronization
- `/users` - User list
- `/projects` - Projects table, pagination, search, and issue assignment
- `/issues` - Issues list, filters, search, reporting form, and transitions
- `/comments` - Comments table and insertion form
- `/profile` - Profile display of the active user

---

## Testing & Compliance (`data-testid` Attributes)

### Authentication
- Login form: `login-form`
- Email input: `email-input`
- Password input: `password-input`
- Login button: `login-btn`
- Logout button: `logout-btn`

### Navigation
- Navbar container: `navbar`
- Dashboard link: `dashboard-link`
- Users link: `users-link`
- Projects link: `projects-link`
- Issues link: `issues-link`
- Comments link: `comments-link`

### Dashboard
- Analytics container: `analytics-container`
- Total issues card: `total-issues-card`
- Active projects card: `active-projects-card`
- Open issues card: `open-issues-card`
- Closed issues card: `closed-issues-card`
- Issue analytics chart: `issue-chart`
- Recent activity section: `recent-activity`

### Issues Module
- Issue table: `issue-table`
- Search input: `issue-search`
- Filter dropdown: `issue-filter`
- Issue row: `issue-row`

### Projects Module
- Project list: `project-list`
- Create project button: `create-project-btn`
- Assign issue button: `assign-issue-btn`
- Project search: `project-search`
- Pagination next: `pagination-next`
- Pagination previous: `pagination-prev`

### Comments Module
- Comment table: `comment-table`
- Add comment button: `add-comment-btn`
- Comment row: `comment-row`

---

## Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173`. Make sure the backend is running on `http://localhost:5000`.

---

## Production Deployment (Vercel)
1. Import your frontend repository on Vercel.
2. In **Environment Variables**, add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-render-url.onrender.com/api`
3. Click **Deploy**.
