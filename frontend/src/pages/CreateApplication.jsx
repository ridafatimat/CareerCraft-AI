import { useState } from "react";
import { createApplication } from "../api/applicationApi";

function CreateApplication() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    education: "",
    skills: "",
    projects: "",
    experience: "",
    jobRole: "",
    companyName: "",
    jobDescription: "",
    tone: "professional",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await createApplication(formData);

      setMessage("Application saved successfully.");

      setFormData({
        fullName: "",
        email: "",
        education: "",
        skills: "",
        projects: "",
        experience: "",
        jobRole: "",
        companyName: "",
        jobDescription: "",
        tone: "professional",
      });
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Application was not saved.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Create Application</h1>
      <p>Enter your CV and job details to prepare for AI generation.</p>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Rida Fatima Tanvir"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rida@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Job Role</label>
            <select
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              required
            >
              <option value="">Select role</option>
              <option value="Frontend Intern">Frontend Intern</option>
              <option value="Backend Intern">Backend Intern</option>
              <option value="Full-Stack Intern">Full-Stack Intern</option>
              <option value="AI Intern">AI Intern</option>
              <option value="Software Engineering Intern">
                Software Engineering Intern
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company name"
              required
            />
          </div>

          <div className="form-group">
            <label>Tone</label>
            <select name="tone" value={formData.tone} onChange={handleChange}>
              <option value="professional">Professional</option>
              <option value="confident">Confident</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Education</label>
          <textarea
            name="education"
            value={formData.education}
            onChange={handleChange}
            placeholder="BS Computer Science, 6th Semester"
            required
          />
        </div>

        <div className="form-group">
          <label>Skills</label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, Express, MongoDB, Python, C++"
            required
          />
        </div>

        <div className="form-group">
          <label>Projects</label>
          <textarea
            name="projects"
            value={formData.projects}
            onChange={handleChange}
            placeholder="RAG Assistant, CyberX, DevNest"
            required
          />
        </div>

        <div className="form-group">
          <label>Experience</label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Any internship, academic, freelance, or project experience"
          />
        </div>

        <div className="form-group">
          <label>Job Description</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Paste the job description here"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Application"}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}

export default CreateApplication;