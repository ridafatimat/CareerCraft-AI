import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/applications";

export const createApplication = async (applicationData) => {
  const response = await axios.post(API_BASE_URL, applicationData);
  return response.data;
};

export const getApplications = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};