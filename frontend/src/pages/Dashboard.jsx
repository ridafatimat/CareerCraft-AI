import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApplications } from "../api/applicationApi";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("careerCraftUser"));

  const fetchApplications = async () => {
    try {
      const response = await getApplications();
      setApplications(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalApplications = applications.length;
  const coverLettersGenerated = applications.filter(
    (application) => application.generatedCoverLetter
  ).length;
  const resumeSummariesGenerated = applications.filter(
    (application) => application.generatedResumeSummary
  ).length;

  return (
    <div className="page">
      <h1>CareerCraft AI</h1>
      <p>
        Welcome, {user?.fullName}. Create applications, generate cover letters,
        and manage your internship history.
      </p>

      <div className="dashboard-actions">
        <Link to="/create" className="dashboard-action-card">
          <h2>Create New Application</h2>
          <p>Add job and CV details for a new role.</p>
        </Link>

        <Link to="/history?mode=cover-letter" className="dashboard-action-card">
          <h2>Generate Cover Letter</h2>
          <p>Generate, regenerate, edit, or download cover letters only.</p>
        </Link>

        <Link to="/history?mode=resume-summary" className="dashboard-action-card">
          <h2>Create Resume Summary</h2>
          <p>Generate, regenerate, edit, or download resume summaries only.</p>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalApplications}</h3>
          <p>Total Applications</p>
        </div>

        <div className="stat-card">
          <h3>{coverLettersGenerated}</h3>
          <p>Cover Letters</p>
        </div>

        <div className="stat-card">
          <h3>{resumeSummariesGenerated}</h3>
          <p>Resume Summaries</p>
        </div>
      </div>

      <div className="card">
        <h2>Recent Applications</h2>

        {loading && <p>Loading...</p>}

        {!loading && applications.length === 0 && (
          <p>No applications yet. Create your first application.</p>
        )}

        {!loading &&
          applications.slice(0, 3).map((application) => (
            <div className="recent-item" key={application._id}>
              <div>
                <strong>{application.jobRole}</strong>
                <p>{application.companyName}</p>
              </div>

              <Link to="/history" className="small-link">
                View
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dashboard;