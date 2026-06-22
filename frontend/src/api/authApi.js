import axios from "axios";

const AUTH_BASE_URL = "http://localhost:5000/api/auth";

export const registerUser = async (userData) => {
  const response = await axios.post(`${AUTH_BASE_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await axios.post(`${AUTH_BASE_URL}/login`, loginData);
  return response.data;
};