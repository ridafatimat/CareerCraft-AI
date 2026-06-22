import axios from "axios";

const APPLICATION_BASE_URL = "http://localhost:5000/api/applications";
const AI_BASE_URL = "http://localhost:5000/api/ai";

const getLoggedInUser = () => {
  const user = localStorage.getItem("careerCraftUser");
  return user ? JSON.parse(user) : null;
};

const getUserId = () => {
  const user = getLoggedInUser();
  return user?.id;
};

export const createApplication = async (applicationData) => {
  const userId = getUserId();

  const response = await axios.post(APPLICATION_BASE_URL, {
    ...applicationData,
    userId,
  });

  return response.data;
};

export const getApplications = async () => {
  const userId = getUserId();

  const response = await axios.get(`${APPLICATION_BASE_URL}?userId=${userId}`);
  return response.data;
};

export const getApplicationById = async (id) => {
  const userId = getUserId();

  const response = await axios.get(`${APPLICATION_BASE_URL}/${id}?userId=${userId}`);
  return response.data;
};

export const updateApplication = async (id, updatedData) => {
  const userId = getUserId();

  const response = await axios.put(`${APPLICATION_BASE_URL}/${id}`, {
    ...updatedData,
    userId,
  });

  return response.data;
};

export const deleteApplication = async (id) => {
  const userId = getUserId();

  const response = await axios.delete(`${APPLICATION_BASE_URL}/${id}?userId=${userId}`);
  return response.data;
};

export const generateCoverLetter = async (id) => {
  const userId = getUserId();

  const response = await axios.post(`${AI_BASE_URL}/generate-cover-letter/${id}`, {
    userId,
  });

  return response.data;
};

export const generateResumeSummary = async (id) => {
  const userId = getUserId();

  const response = await axios.post(`${AI_BASE_URL}/generate-resume-summary/${id}`, {
    userId,
  });

  return response.data;
};