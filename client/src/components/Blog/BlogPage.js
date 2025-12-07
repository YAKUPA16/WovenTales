import { FiArrowLeft, FiHeart } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { useState, useEffect } from "react";
import "./BlogPage.css";
import { toggleLikeBlog, addCommentToBlog } from "../../services/blogService";
import { getProfile } from "../../services/userService";

const BlogPage = ({ blog, onBack }) => {
  const [newComment, setNewComment] = useState("");
  const [localBlog, setLocalBlog] = useState(blog);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setCurrentUser(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUser();
  }, []);

  if (!localBlog || !currentUser) return null;

  const likedBy = localBlog.likedBy || [];

  const isLiked = likedBy.some(
    (id) => id.toString() === currentUser._id.toString()
  );

  const handleLike = async () => {
    const alreadyLiked = isLiked;

    // Optimistic UI update
    setLocalBlog((prev) => ({
      ...prev,
      likedBy: alreadyLiked
        ? prev.likedBy.filter(
            (id) => id.toString() !== currentUser._id.toString()
          )
        : [...prev.likedBy, currentUser._id],
    }));

    try {
      await toggleLikeBlog(localBlog._id, !alreadyLiked);
    } catch (err) {
      console.error("Like failed:", err);
      setLocalBlog(blog); // revert
    }
  };

  const handleCommentSubmit = async (e) => {
  e.preventDefault();

  const text = newComment.trim();

  if (!text) {
    alert("Comment text needed");
    return;
  }

  setNewComment("");

  try {
    const updatedBlog = await addCommentToBlog(localBlog._id, text);
    setLocalBlog(updatedBlog);
  } 
  catch (err) {
    console.error("comment failed:", err);
  }
};

  return (
    <div className="open-blog-wrapper">
      <button  style={{ color: "black" }}
  className="back-button"
  onClick={() => {
    onBack();         
    window.location.reload(); 
  }}>
  <FiArrowLeft />
</button>

      <div className="open-blog-content-wrapper">
        {localBlog.image && (
          <img
            src={localBlog.image}
            alt={localBlog.title}
            className="open-blog-image"
          />
        )}

        <h1 className="open-blog-title">{localBlog.title}</h1>
        <small className="open-blog-author">
          By {localBlog.user?.username}
        </small>

        <div className="tags">
          {localBlog.tags.map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <p className="open-blog-text">{localBlog.content}</p>

        {/* Like Button */}
        <div className="like-section">
          <button className="like-btn" onClick={handleLike}>
            {isLiked ? <AiFillHeart color="red" /> : <FiHeart />}{" "}
            {likedBy.length}
          </button>
        </div>

        {/* Comments */}

          <div className="comments-section">
          <h3>Comments</h3>

  <form className="comment-form" onSubmit={handleCommentSubmit}>
  <input
    type="text"
    placeholder="Add a comment..."
    value={newComment}
    required
    onChange={(e) => setNewComment(e.target.value)}
  />
  <button type="submit">Post</button>
</form>

  <div className="comments-list">
    {localBlog.comments.length === 0 && <p>No comments yet.</p>}
    {localBlog.comments.map((c, idx) => (
      <div
        key={idx}
        className="comment"
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <img
          src="profile.png"
          alt="User"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "10px",
          }} />
        <div>
          <b>Anonymous:</b> {c.text}
        </div>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  );
};

export default BlogPage;
