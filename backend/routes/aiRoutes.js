const express = require("express");
const Groq = require("groq-sdk");
const Application = require("../models/Application");

const router = express.Router();

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Groq API key is missing. Please add GROQ_API_KEY in backend/.env."
    );
  }

  return new Groq({
    apiKey,
  });
};

// Generate cover letter for one application
router.post("/generate-cover-letter/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required. Please login first.",
      });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const groq = getGroqClient();

    const prompt = `
Generate a professional internship cover letter using the following details.

Applicant Name: ${application.fullName}
Email: ${application.email}
Education: ${application.education}
Skills: ${application.skills}
Projects: ${application.projects}
Experience: ${application.experience || "No formal experience yet"}
Job Role: ${application.jobRole}
Company Name: ${application.companyName}
Job Description: ${application.jobDescription}
Tone: ${application.tone}

Rules:
- Make it suitable for a Computer Science undergraduate.
- Keep it professional, clear, and human-like.
- Do not make fake claims.
- Mention relevant projects naturally.
- Keep it around 250 to 350 words.
- Do not include placeholders like [Your Name].
- Start with "Dear Hiring Manager,"
- End with the applicant's full name.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an expert career assistant who writes professional, honest, and customized internship cover letters.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 700,
    });

    const generatedText = completion.choices[0]?.message?.content || "";

    if (!generatedText) {
      return res.status(500).json({
        success: false,
        message: "Groq returned an empty response.",
      });
    }

    application.generatedCoverLetter = generatedText;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Cover letter generated successfully.",
      data: application,
    });
  } catch (error) {
    console.error("Groq cover letter generation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate cover letter.",
      error: error.message,
    });
  }
});

// Generate resume summary for one application
router.post("/generate-resume-summary/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required. Please login first.",
      });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const groq = getGroqClient();

    const prompt = `
Create a strong resume summary for the following internship application.

Applicant Name: ${application.fullName}
Education: ${application.education}
Skills: ${application.skills}
Projects: ${application.projects}
Experience: ${application.experience || "No formal experience yet"}
Target Role: ${application.jobRole}
Company: ${application.companyName}
Job Description: ${application.jobDescription}

Rules:
- Write in first person or neutral professional style.
- Keep it short, around 4 to 6 lines.
- Make it suitable for a Computer Science undergraduate.
- Highlight relevant technical skills and projects.
- Do not make fake claims.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume assistant who writes clear and honest resume summaries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
      max_tokens: 400,
    });

    const generatedText = completion.choices[0]?.message?.content || "";

    if (!generatedText) {
      return res.status(500).json({
        success: false,
        message: "Groq returned an empty response.",
      });
    }

    application.generatedResumeSummary = generatedText;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Resume summary generated successfully.",
      data: application,
    });
  } catch (error) {
    console.error("Groq resume summary generation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate resume summary.",
      error: error.message,
    });
  }
});

module.exports = router;