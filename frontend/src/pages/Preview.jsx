import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { getApplicationById, updateApplication } from "../api/applicationApi";
import Toast from "../components/Toast";

function Preview({ type }) {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const isCoverLetter = type === "coverLetter";

  const pageTitle = isCoverLetter
    ? "Edit Cover Letter"
    : "Edit Resume Summary";

  const fieldName = isCoverLetter
    ? "generatedCoverLetter"
    : "generatedResumeSummary";

  const pdfTitle = isCoverLetter ? "Cover Letter" : "Resume Summary";

  const fetchApplication = async () => {
    try {
      const response = await getApplicationById(id);

      setApplication(response.data);
      setContent(response.data[fieldName] || "");
    } catch (error) {
      console.error(error);
      showToast("Failed to load application.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await updateApplication(id, {
        [fieldName]: content,
      });

      setApplication(response.data);
      showToast(`${pdfTitle} saved successfully.`, "success");
    } catch (error) {
      console.error(error);
      showToast(`Failed to save ${pdfTitle.toLowerCase()}.`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!content) {
      showToast(`No ${pdfTitle.toLowerCase()} available to download.`, "error");
      return;
    }

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;

    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text(pdfTitle, margin, 20);

    doc.setFont("times", "normal");
    doc.setFontSize(12);

    doc.text(`Applicant: ${application.fullName}`, margin, 32);
    doc.text(`Role: ${application.jobRole}`, margin, 39);
    doc.text(`Company: ${application.companyName}`, margin, 46);

    const lines = doc.splitTextToSize(content, maxLineWidth);

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

    showToast(`${pdfTitle} PDF downloaded successfully.`, "success");
  };

  useEffect(() => {
    fetchApplication();
  }, [id, type]);

  if (loading) {
    return (
      <div className="page">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="page">
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />
        <h1>Application not found</h1>
      </div>
    );
  }

  return (
    <div className="page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <h1>{pageTitle}</h1>
      <p>Edit, save, and download your {pdfTitle.toLowerCase()}.</p>

      <div className="preview-layout">
        <div className="preview-info-card">
          <h2>Application Details</h2>

          <p>
            <strong>Name:</strong> {application.fullName}
          </p>

          <p>
            <strong>Email:</strong> {application.email}
          </p>

          <p>
            <strong>Role:</strong> {application.jobRole}
          </p>

          <p>
            <strong>Company:</strong> {application.companyName}
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
        </div>

        <div className="editor-card">
          <h2>{pageTitle}</h2>

          <textarea
            className={isCoverLetter ? "letter-editor" : "summary-editor"}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={`${pdfTitle} will appear here.`}
          />

          <div className="button-row">
            <button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button onClick={handleDownloadPdf}>
              Download {pdfTitle} PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;