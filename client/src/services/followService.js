import axios from "axios";

const API = "http://localhost:5000/api/followers";

export const followUser = async (id) => {
  return await axios.post(`${API}/follow/${id}`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const unfollowUser = async (id) => {
  return await axios.delete(`${API}/unfollow/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
