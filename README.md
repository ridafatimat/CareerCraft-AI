# CareerCraft AI

CareerCraft AI is a full-stack MERN-style web application that helps users create, manage, and improve internship/job applications using AI. Users can register, log in, create application records, generate cover letters and resume summaries, edit generated content, download PDFs, and manage their application history.

## Features

- User registration and login
- Password hashing using bcrypt
- User-based application history
- Create new internship/job applications
- Generate AI-powered cover letters using Groq
- Generate AI-powered resume summaries using Groq
- Edit generated cover letters and resume summaries
- Download cover letters and resume summaries as PDF
- Delete saved applications
- Dashboard with application statistics
- Clean and responsive React UI

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- jsPDF
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- Groq SDK
- dotenv
- cors

## Project Structure

```txt
CareerCraft AI/
├── backend/
│   ├── models/
│   │   ├── Application.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── authRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── applicationApi.js
│   │   │   └── authApi.js
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── CreateApplication.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Preview.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
└── README.md
