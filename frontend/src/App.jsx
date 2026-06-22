import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CreateApplication from "./pages/CreateApplication";
import History from "./pages/History";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function AppLayout({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("careerCraftUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>CareerCraft AI</h2>

        <div className="user-box">
          <p>Logged in as</p>
          <strong>{user?.fullName}</strong>
        </div>

        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/create">Create Application</Link>
          <Link to="/history">History</Link>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateApplication />} />
          <Route path="/history" element={<History />} />

          <Route
            path="/preview/:id/cover-letter"
            element={<Preview type="coverLetter" />}
          />

          <Route
            path="/preview/:id/resume-summary"
            element={<Preview type="resumeSummary" />}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("careerCraftUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;