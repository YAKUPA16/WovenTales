// CreateStory.js
import React, { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./StoryCreater.css";

export default function CreateStory() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (isEnding) => {
    if (!title.trim() || !text.trim()) {
      setError("Please fill in both title and text.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Payload for creating story + first scene
      const payload = {
        title,
        content: text,
        isEnding
      };

      const res = await axiosInstance.post("/stories", payload);

      // Backend should create first scene and link to story.firstScene
      const storyId = res.data._id;

      // Redirect to ReaderPage
      navigate(`/reader/${storyId}`);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to create story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createStory-page">
      <h1>Create New Story</h1>

      {error && <div className="createStory-error">{error}</div>}

      <div style={{ marginBottom: 10 }}>
      <label className="createStory-label">Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="createStory-input"
      />
      </div>

      <div style={{ marginBottom: 10 }}>
      <label className="createStory-label">Story Text / Description:</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="createStory-textarea"
      />
      </div>

      <div className="createStory-btnRow">
      <button
        className="createStory-btn createStory-continue"
        onClick={() => handleSubmit(false)}
        disabled={loading}
      >
        Leave Continued
      </button>

      <button
        className="createStory-btn createStory-end"
        onClick={() => handleSubmit(true)}
        disabled={loading}
      >
        End
      </button>
      </div>
    </div>

  );
}
