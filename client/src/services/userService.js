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
