import "./BlogList.css";
import BlogPage from "./BlogPage";
import { useState, useEffect } from "react";
import BlogEditor from "./BlogEditor";
import { getAllBlogs } from "../../services/blogService";
import { followUser, unfollowUser } from "../../services/followService";
import axios from "axios";
import { getProfile } from "../../services/userService";

const BlogCard = ({ blog, onClick, currentUserId, followingIds, setFollowingIds, setFollowingUsers }) => {
  const userId = String(blog.user._id);
  const isFollowing = followingIds.includes(userId);
  const isSelf = userId === String(currentUserId);    // is the iser viewing his own posts

  const handleFollowToggle = async () => {
    try {
      // if user is already following, then unfollow by filtering
      if (isFollowing) 
      {
        await unfollowUser(userId);   // unfollow in db
        // update local states also
        setFollowingIds(prev => prev.filter(id => id !== userId));
        setFollowingUsers(prev => prev.filter(u => u._id !== userId));
      } 
      else 
      {
        await followUser(userId);
        setFollowingIds(prev => [...prev, userId]);
        setFollowingUsers(prev => [
          ...prev,
          {
            _id: blog.user._id,
            username: blog.user.username,
            profileImage: "profile.png"
          }
        ]);
      }
    } 
    catch (err) 
    {
      alert(err.response?.data?.message || "Failed to follow/unfollow");
    }
  };

  return (
    <div className="blog-card" onClick={onClick}>
      <div className="top-bar">
        {/*no follow button shown on users self posts */}
        {!isSelf && (
          <button
            className="follow-btn"
            onClick={e => { e.stopPropagation(); handleFollowToggle(); }}
            style={{backgroundColor: isFollowing ? "#bfbfbf" : "#4A90E2",color: "#ffffff",cursor: "pointer"}}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>)}
      </div>

      {blog.image && <img src={blog.image} alt={blog.title} className="blog-image" />}
      <div className="blog-content">
        <h2>{blog.title}</h2>
        <small>By {blog.user?.username}</small>
        <div className="tags">
          {blog.tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
        {blog.content && <p className="blog-text">{blog.content.slice(0, 120)}...</p>}
      </div>
    </div>
  );
};

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [openBlog, setOpenBlog] = useState(null);
  const [creatingBlog, setCreatingBlog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followingIds, setFollowingIds] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);

  // get the current user logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setCurrentUserId(data._id);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUser();
  }, []);

  // get all the blogs form
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        setBlogs(data);
      } 
      catch (err) {
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);

  //get all following users (if user is logged in, then get all the users he follows from db)
  useEffect(() => {

    const fetchFollowing = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/follow/following", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const ids = res.data.map(f => String(f.following._id));
        setFollowingIds(ids);

        const users = res.data.map(f => ({
          _id: f.following._id,
          username: f.following.username,
          profileImage: "profile.png"
        }));
        setFollowingUsers(users);

      } 
      catch (err) {
        console.error("Error fetching following list:", err);
      }
    };
    fetchFollowing();
  }, [currentUserId]);

  const handleNewBlog = (newBlog) => {
    setBlogs([newBlog, ...blogs]);
    setCreatingBlog(false);
  };

  const handleUnfollowUser = async (userId) => {
    try {
      await unfollowUser(userId);
      setFollowingIds(prev => prev.filter(id => id !== userId));
      setFollowingUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error("Error unfollowing user:", err);
      alert(err.response?.data?.message || "Failed to unfollow");
    }
  };

  return (
    <>
      {!openBlog && !creatingBlog && (
        <button
          className="floating-add-btn"
          onClick={() => setCreatingBlog(true)}
        >
          +
        </button>
      )}

      {creatingBlog ? (
        <BlogEditor 
          onSubmit={handleNewBlog} 
          onBack={() => setCreatingBlog(false)} 
        />
      ) : openBlog ? (
        <BlogPage blog={openBlog} onBack={() => setOpenBlog(null)} />
      ) : (
        <div className="blog-page">
          <div className="cards-container">
            {blogs.map(blog => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onClick={() => setOpenBlog(blog)}
                currentUserId={currentUserId}
                followingIds={followingIds}
                setFollowingIds={setFollowingIds}
                setFollowingUsers={setFollowingUsers}
              />
            ))}
          </div>

          <div className="rightSidebar">
            <div className="following-card">
              <h3>Following</h3>
              {followingUsers.length === 0 ? (
                <p>You are not following anyone yet.</p>
              ) : (
                followingUsers.map(user => (
                  <div key={user._id} className="following-user">
                    <img src={user.profileImage} alt={user.username} className="following-avatar" />
                    <span>{user.username}</span>
                    <button
                      className="follow-btn"
                      style={{ marginLeft: "auto", backgroundColor: "#bfbfbf", color: "#fff", cursor: "pointer", fontSize: "12px" }}
                      onClick={() => handleUnfollowUser(user._id)}
                    >
                      Unfollow
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogList;
