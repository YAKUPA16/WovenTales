// [Frontend] StoryModal.js
import React, { useEffect, useMemo, useState } from "react";
import "./StoryModal.css";
import axiosInstance from "../../../services/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function StoryModal({ storyId, open, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  const likesCount = useMemo(() => story?.likesCount ?? (story?.likes?.length || 0), [story]);
  const avgRating = useMemo(() => story?.avgRating ?? 0, [story]);

  useEffect(() => {
    if (!open || !storyId) return;

    let alive = true;
    setLoading(true);
    setError("");

    axiosInstance
      .get(`/stories/${storyId}`)
      .then((res) => {
        if (!alive) return;
        setStory(res.data.story);
        setComments(res.data.comments || []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.message || "Failed to load story");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [open, storyId]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submitComment = async () => {
    const text = commentText.trim();
    if (!text) return;

    try {
      const res = await axiosInstance.post(`/stories/${storyId}/comments`, { text });
      setComments((prev) => [res.data.comment, ...prev]);
      setCommentText("");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to comment");
    }
  };

  const toggleLike = async () => {
    try {
      const res = await axiosInstance.post(`/stories/${storyId}/like`);
      setStory((prev) => {
        if (!prev) return prev;
        return { ...prev, likesCount: res.data.likesCount };
      });
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to like");
    }
  };

  const rate = async (value) => {
    try {
      const res = await axiosInstance.post(`/stories/${storyId}/rate`, { value });
      setStory((prev) => (prev ? { ...prev, avgRating: res.data.avgRating } : prev));
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to rate");
    }
  };

  return (
    <div className="storymodal-backdrop" onMouseDown={onClose}>
      <div className="storymodal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="storymodal-close" onClick={onClose} aria-label="Close">✕</button>

        {loading ? (
          <div className="storymodal-loading">Loading...</div>
        ) : error ? (
          <div className="storymodal-error">{error}</div>
        ) : !story ? (
          <div className="storymodal-empty">No story found.</div>
        ) : (
          <>
            <div className="storymodal-header">
              <div>
                <div className="storymodal-title">{story.title}</div>
                <div className="storymodal-sub">
                  By{" "}
                  <span className="storymodal-author">
                    {story.author?.username || story.author?.name || "Unknown"}
                  </span>
                </div>
              </div>

              <div className="storymodal-actions">
                <button className="pill" onClick={toggleLike}>❤️ {likesCount}</button>

                <div className="rating">
                  <span className="rating-label">Rating:</span>
                  <span className="rating-avg">{avgRating ? avgRating.toFixed(1) : "0.0"}</span>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} className="star" onClick={() => rate(n)} title={`Rate ${n}`}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="storymodal-body">
              <div className="storymodal-media">
                {story.coverImageUrl ? (
                  <img className="storymodal-img" src={story.coverImageUrl} alt={story.title} />
                ) : (
                  <div className="storymodal-img placeholder">No Image</div>
                )}
              </div>

              <div className="storymodal-content">
                {/* If your schema uses a different field than "content", change here */}
                <div className="storymodal-story">
                  {story.content || story.story || story.summary || "No story text available yet."}
                </div>

                {/*Reader's Vie buttons */}
                  <button 
                    className="comment-send"
                    onClick={() => {
                      navigate(`/ReaderPage/${story._id}`);
                      onClose();
                    }}
                  >
                    Read Story
                  </button>

                <div className="storymodal-comments">
                  <div className="comments-title">
                    Comments ({comments.length})
                  </div>

                  <div className="comment-box">
                    <input
                      className="comment-input"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                    />
                    <button className="comment-send" onClick={submitComment}>
                      Post
                    </button>
                  </div>

                  <div className="comment-list">
                    {comments.length === 0 ? (
                      <div className="comment-empty">No comments yet.</div>
                    ) : (
                      comments.map((c) => (
                        <div className="comment" key={c._id}>
                          <div className="comment-head">
                            <span className="comment-user">
                              {c.user?.username || c.user?.name || "User"}
                            </span>
                            <span className="comment-date">
                              {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                            </span>
                          </div>
                          <div className="comment-text">{c.text}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
