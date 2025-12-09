// This file contains all user-related API functions (signup, login, profile, avatar updates).
// Each function sends requests through our axiosInstance, so the JWT token is automatically
// included. This keeps all authentication and profile API calls organized in one place.

import axios from './axiosInstance';

export const signup = async ({ username, email, password }) => {
  const { data } = await axios.post('/users/signup', { username, email, password });
  return data;
};

export const login = async ({ email, password }) => {
  const { data } = await axios.post('/users/login', { email, password });
  return data;
};

export const getProfile = async () => {
  const res = await axios.get('/users/profile');
  return res.data;
};

// UPDATED: now sends FormData instead of URL string
export const updateAvatar = async (formData) => {
  const res = await axios.put('/users/avatar', formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};
// ✅ NEW: update profile info (username, email, description, bgColor)
export const updateProfile = async ({ username, email, description, bgColor }) => {
  const { data } = await axios.put('/users/update', { username, email, description, bgColor });
  return data;
};
