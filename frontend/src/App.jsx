import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateApplication from "./pages/CreateApplication";
import History from "./pages/History";
import Preview from "./pages/Preview";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <aside className="sidebar">
          <h2>CareerCraft AI</h2>

          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/create">Create Application</Link>
            <Link to="/history">History</Link>
            <Link to="/preview">Preview</Link>
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateApplication />} />
            <Route path="/history" element={<History />} />
            <Route path="/preview" element={<Preview />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;