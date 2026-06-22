import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";
import {
  deleteApplication,
  generateCoverLetter,
  generateResumeSummary,
  getApplications,
} from "../api/applicationApi";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

function History() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  const showCoverLetterOnly = mode === "cover-letter";
  const showResumeSummaryOnly = mode === "resume-summary";
  const showAll = !mode;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingCoverId, setGeneratingCoverId] = useState(null);
  const [generatingResumeId, setGeneratingResumeId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 3000);
  };

  const fetchApplications = async () => {
    try {
      const response = await getApplications();
      setApplications(response.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch applications.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async (id) => {
    setGeneratingCoverId(id);

    try {
      const response = await generateCoverLetter(id);

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application._id === id ? response.data : application
        )
      );

      showToast("Cover letter generated successfully.", "success");
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to generate cover letter.";

      showToast(errorMessage, "error");
    } finally {
      setGeneratingCoverId(null);
    }
  };

  const handleGenerateResumeSummary = async (id) => {
    setGeneratingResumeId(id);

    try {
      const response = await generateResumeSummary(id);

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application._id === id ? response.data : application
        )
      );

      showToast("Resume summary generated successfully.", "success");
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to generate resume summary.";

      showToast(errorMessage, "error");
    } finally {
      setGeneratingResumeId(null);
    }
  };

  const handleDeleteApplication = async () => {
    if (!deleteId) return;

    try {
      await deleteApplication(deleteId);

      setApplications((previousApplications) =>
        previousApplications.filter(
          (application) => application._id !== deleteId
        )
      );

      setDeleteId(null);
      showToast("Application deleted successfully.", "success");
    } catch (error) {
      console.error(error);
      setDeleteId(null);
      showToast("Failed to delete application.", "error");
    }
  };

  const downloadTextAsPdf = (application, type) => {
    const isCoverLetter = type === "coverLetter";

    const title = isCoverLetter ? "Cover Letter" : "Resume Summary";
    const text = isCoverLetter
      ? application.generatedCoverLetter
      : application.generatedResumeSummary;

    if (!text) {
      showToast(`No ${title.toLowerCase()} available to download.`, "error");
      return;
    }

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;

    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text(title, margin, 20);

    doc.setFont("times", "normal");
    doc.setFontSize(12);

    doc.text(`Applicant: ${application.fullName}`, margin, 32);
    doc.text(`Role: ${application.jobRole}`, margin, 39);
    doc.text(`Company: ${application.companyName}`, margin, 46);

    const lines = doc.splitTextToSize(text, maxLineWidth);

    let y = 60;

    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(line, margin, y);
      y += 7;
    });

    const fileType = isCoverLetter ? "cover-letter" : "resume-summary";

    const fileName = `${application.fullName}-${application.companyName}-${fileType}.pdf`
      .replaceAll(" ", "-")
      .toLowerCase();

    doc.save(fileName);

    showToast(`${title} PDF downloaded successfully.`, "success");
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const pageTitle = showCoverLetterOnly
    ? "Cover Letter Generator"
    : showResumeSummaryOnly
    ? "Resume Summary Generator"
    : "Application History";

  const pageDescription = showCoverLetterOnly
    ? "Generate, regenerate, edit, or download cover letters for your applications."
    : showResumeSummaryOnly
    ? "Generate, regenerate, edit, or download resume summaries for your applications."
    : "View, edit, regenerate, download, or delete your saved applications.";

  return (
    <div className="page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      {deleteId && (
        <ConfirmModal
          title="Delete Application"
          message="Are you sure you want to delete this application? This action cannot be undone."
          onConfirm={handleDeleteApplication}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <h1>{pageTitle}</h1>
      <p>{pageDescription}</p>

      {loading && <p>Loading applications...</p>}

      {!loading && applications.length === 0 && (
        <div className="card">
          <h2>No applications yet</h2>
          <p>Create your first application to see it here.</p>
          <Link to="/create" className="secondary-button">
            Create Application
          </Link>
        </div>
      )}

      <div className="history-list">
        {applications.map((application) => (
          <div className="history-card" key={application._id}>
            <div className="history-header">
              <div>
                <h2>{application.jobRole}</h2>
                <p>
                  <strong>Company:</strong> {application.companyName}
                </p>
              </div>

              <span className="status-pill">
                {showCoverLetterOnly
                  ? application.generatedCoverLetter
                    ? "Cover Letter Ready"
                    : "Cover Letter Pending"
                  : showResumeSummaryOnly
                  ? application.generatedResumeSummary
                    ? "Resume Summary Ready"
                    : "Resume Summary Pending"
                  : application.generatedCoverLetter ||
                    application.generatedResumeSummary
                  ? "Generated Content Ready"
                  : "Draft"}
              </span>
            </div>

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

            <div className="button-row">
              {(showCoverLetterOnly || showAll) && (
                <>
                  <button
                    onClick={() => handleGenerateCoverLetter(application._id)}
                    disabled={generatingCoverId === application._id}
                  >
                    {generatingCoverId === application._id
                      ? "Generating..."
                      : application.generatedCoverLetter
                      ? "Regenerate Cover Letter"
                      : "Generate Cover Letter"}
                  </button>

                  {application.generatedCoverLetter && (
                    <Link
                      className="secondary-button"
                      to={`/preview/${application._id}/cover-letter`}
                    >
                      Edit Cover Letter
                    </Link>
                  )}

                  {application.generatedCoverLetter && (
                    <button
                      onClick={() =>
                        downloadTextAsPdf(application, "coverLetter")
                      }
                    >
                      Download Cover Letter
                    </button>
                  )}
                </>
              )}

              {(showResumeSummaryOnly || showAll) && (
                <>
                  <button
                    onClick={() => handleGenerateResumeSummary(application._id)}
                    disabled={generatingResumeId === application._id}
                  >
                    {generatingResumeId === application._id
                      ? "Generating..."
                      : application.generatedResumeSummary
                      ? "Regenerate Resume Summary"
                      : "Generate Resume Summary"}
                  </button>

                  {application.generatedResumeSummary && (
                    <Link
                      className="secondary-button"
                      to={`/preview/${application._id}/resume-summary`}
                    >
                      Edit Resume Summary
                    </Link>
                  )}

                  {application.generatedResumeSummary && (
                    <button
                      onClick={() =>
                        downloadTextAsPdf(application, "resumeSummary")
                      }
                    >
                      Download Resume Summary
                    </button>
                  )}
                </>
              )}

              <button
                className="danger-button"
                onClick={() => setDeleteId(application._id)}
              >
                Delete
              </button>
            </div>

            {(showCoverLetterOnly || showAll) &&
              application.generatedCoverLetter && (
                <div className="generated-letter">
                  <h3>Cover Letter Preview</h3>
                  <p>{application.generatedCoverLetter}</p>
                </div>
              )}

            {(showResumeSummaryOnly || showAll) &&
              application.generatedResumeSummary && (
                <div className="generated-letter">
                  <h3>Resume Summary Preview</h3>
                  <p>{application.generatedResumeSummary}</p>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;