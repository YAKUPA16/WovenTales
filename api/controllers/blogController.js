const Blog = require("../models/Blog");

// getting/fetching all blogs
const getAllBlogs = async (req, res) => {
  try {
    // .find to find db elements, populate is sort-of joins (replace user with username field)
    // to get the author name from user
    const blogs = await Blog.find().populate("user", "username");
    //send response back to client 
    res.json(blogs);
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// creating new blog
const createBlog = async (req, res) => {
  try {
    //extract title,contnt etc from request body, that the client will sent to create new blog
    const { title, content, tags, image } = req.body;

    // make blog document
    const blog = new Blog({
      title,
      content,
      tags,
      image,
      user: req.user._id,
    });

    // save into db
    await blog.save();
    //successful status received
    res.status(201).json(blog);
  } 
  catch (err) 
  {
    console.error("Error saving blog:", err);
    res.status(500).json({ message: err.message });
  }
};

// like/unlike button
const toggleLikeBlog = async (req, res) => {
  try {

    // runs find by id query on db
    const blog = await Blog.findById(req.params.id);

    // extract the user's id whomliked the blog
    const userId = req.user._id;

    // if user has liked the blog then
    if (req.body.like) 
    {
      // checks if user hasnt already liked the blog then push entry in db
      if (!blog.likedBy.some((id) => id.toString() === userId.toString())) 
      {
        blog.likedBy.push(userId);
      } 
    } 
    // if user clicks the like button again, it then unlikes the blog using filter
    else 
    {
      blog.likedBy = blog.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    }
    // save to db
    await blog.save();
    res.json(blog);
  } 
  catch (err) 
  {
    res.status(500).json({ message: "Server error" });
  }
};

// commenting on a blog
const addCommentToBlog = async (req, res) => {
  try {
    // find by id the specific blog
    const blog = await Blog.findById(req.params.id);
    // take the text/comment out of the request body
    const { text } = req.body;
    // push into db array document
    blog.comments.push({
      user: req.user._id,
      text,
    });
    await blog.save();
    res.json(blog);
  } 
  catch (err) 
  {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  toggleLikeBlog,
  addCommentToBlog,
};
