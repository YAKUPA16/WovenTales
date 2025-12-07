import axios from "axios";

// Fetch all blogs
export const getAllBlogs = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/blogs");
    return response.data; // array of blogs
  } catch (err) {
    console.error("Error fetching blogs:", err);
    throw err;
  }
};

// Create a new blog
export const createBlog = async (blogData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post(
    "http://localhost:5000/api/blogs",
    blogData,
    config
  );
  return response.data;
};

export const toggleLikeBlog = async (blogId, like) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `http://localhost:5000/api/blogs/${blogId}/like`,
      { like },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } 
  catch (err) {
    console.error("Error in toggleLikeBlog:", err.response || err);
    throw err;
  }
};

// Add a comment to a blog
export const addCommentToBlog = async (blogId, text) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `http://localhost:5000/api/blogs/${blogId}/comments`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } 
  catch (err) {
    console.error("commenting error:", err.response || err);
    throw err;
  }
};
