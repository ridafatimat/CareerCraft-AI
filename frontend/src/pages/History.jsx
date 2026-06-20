import { useEffect, useState } from "react";
import { getApplications } from "../api/applicationApi";

function History() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="page">
      <h1>Application History</h1>
      <p>Your saved applications will appear here.</p>

      {loading && <p>Loading applications...</p>}

      {!loading && applications.length === 0 && (
        <div className="card">
          <h2>No applications yet</h2>
          <p>Create your first application to see it here.</p>
        </div>
      )}

      <div className="history-list">
        {applications.map((application) => (
          <div className="history-card" key={application._id}>
            <h2>{application.jobRole}</h2>

            <p>
              <strong>Company:</strong> {application.companyName}
            </p>

            <p>
              <strong>Name:</strong> {application.fullName}
            </p>

            <p>
              <strong>Email:</strong> {application.email}
            </p>

            <p>
              <strong>Tone:</strong> {application.tone}
            </p>

            <p>
              <strong>Skills:</strong> {application.skills}
            </p>

            <p>
              <strong>Projects:</strong> {application.projects}
            </p>

            <p>
              <strong>Created:</strong>{" "}
              {new Date(application.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;