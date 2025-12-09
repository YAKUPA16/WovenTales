// client/services/axiosInstance.js
// This custom Axios instance sets a default API base URL and automatically
// attaches the saved JWT token (from localStorage) to every outgoing request.
// This ensures all protected routes include Authorization headers without
// manually adding them in every API call.

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
