const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getAllBlogs,createBlog,toggleLikeBlog, addCommentToBlog,} = require("../controllers/blogController");

// .method(url,function that runs when url is visited)

// get all blogs (read from db)
router.get("/", getAllBlogs);

// post new blog (create new document in db)
router.post("/", protect, createBlog);

// patch/update like/unlike (update document in db)
//protect here is just verifying if the user is logged in or not
router.patch("/:id/like", protect, toggleLikeBlog);

// post comment
router.post("/:id/comments", protect, addCommentToBlog);

module.exports = router;
