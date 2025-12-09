
// CreateStory.js
import React, { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";

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
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h1>Create New Story</h1>

      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

      <div style={{ marginBottom: 10 }}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 4 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Story Text / Description:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{ width: "100%", padding: 8, marginTop: 4 }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <button
          style={{ padding: "8px 16px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: 4 }}
          onClick={() => handleSubmit(false)}
          disabled={loading}
        >
          Leave Continued
        </button>

        <button
          style={{ padding: "8px 16px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: 4 }}
          onClick={() => handleSubmit(true)}
          disabled={loading}
        >
          End
        </button>
      </div>
    </div>
  );
}
