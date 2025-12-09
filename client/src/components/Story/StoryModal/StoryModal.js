// [Frontend] StoryModal.js
import React, { useEffect, useMemo, useState } from "react";
import "./StoryModal.css";
import axiosInstance from "../../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; // <-- ADDED

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

  // ------------------------------------------------------------
  // 📌 DOWNLOAD STORY PDF (SCENES + AUTHOR + TITLE)
  // ------------------------------------------------------------

  const downloadPDF = async () => {
    try {
      // Fetch all scenes
      const res = await axiosInstance.get(`/stories/${storyId}/scenes`);
      const scenes = res.data?.scenes || [];

      const doc = new jsPDF({
        unit: "pt",
        format: "a4",
      });

      const lineHeight = 18;
      let y = 40;

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.text(story.title, 40, y);
      y += 30;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Author: ${story.author?.username || story.author?.name || "Unknown"}`, 40, y);
      y += 25;

      // Story main text
      const mainText =
        story.storyText || story.text || story.summary || "No main text available.";

      doc.setFontSize(12);
      const mainLines = doc.splitTextToSize(mainText, 520);
      mainLines.forEach((line) => {
        if (y > 750) {
          doc.addPage();
          y = 40;
        }
        doc.text(line, 40, y);
        y += lineHeight;
      });

      // Scenes
      y += 20;
      doc.setFont("Helvetica", "bold");
      doc.text("Scenes:", 40, y);
      y += 25;

      doc.setFont("Helvetica", "normal");

      scenes.forEach((scene, index) => {
        const sceneTitle = `Scene ${index + 1}`;
        const sceneText = scene.text || scene.content || "No text.";

        if (y > 750) {
          doc.addPage();
          y = 40;
        }

        doc.setFont("Helvetica", "bold");
        doc.text(sceneTitle, 40, y);
        y += 20;

        doc.setFont("Helvetica", "normal");
        const lines = doc.splitTextToSize(sceneText, 520);

        lines.forEach((l) => {
          if (y > 750) {
            doc.addPage();
            y = 40;
          }
          doc.text(l, 40, y);
          y += lineHeight;
        });

        y += 10;
      });

      doc.save(`${story.title.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF.");
    }
  };

  // ------------------------------------------------------------

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

                {/* 📌 DOWNLOAD BUTTON */}
                <button className="pill" onClick={downloadPDF}>⬇️ Download</button>
              </div>
            </div>

            <div className="storymodal-body">
              <div className="storymodal-media">
                {story.coverImageUrl ? (
                  <img
                    className="storymodal-img"
                    src={story.coverImageUrl || "/tinyworld.jpg"}
                    alt={story.title}
                  />
                ) : (
                  <div className="storymodal-img placeholder">No Image</div>
                )}
              </div>

              <div className="storymodal-content">
                <div className="storymodal-story">
                  {story.storyText || story.text || story.summary || "No story text available yet."}
                </div>

                <button
                  className="comment-send"
                  onClick={() => navigate(`/reader/${storyId}`)}
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
