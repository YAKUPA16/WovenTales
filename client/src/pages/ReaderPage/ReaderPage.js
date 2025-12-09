// client/src/pages/ReaderPage/ReaderPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import "./ReaderPage.css";

export default function ReaderPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const [storyData, setStoryData] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    axiosInstance
      .get(`/stories/${storyId}/scenes`)
      .then((res) => {
        if (!alive) return;

        const data = res.data;
        console.log("SCENE PAYLOAD:", data);

        setStoryData(data);

        const root = data.scenes.find(
          (s) => String(s._id) === String(data.rootSceneId)
        );

        setCurrentScene(root || null);
      })
      .catch((err) => {
        console.error("Failed to load scenes:", err);
        setStoryData(null);
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [storyId]);

  if (loading) return <div>Loading story...</div>;
  if (!storyData) return <div>No story found.</div>;
  if (!currentScene) return <div>No starting scene.</div>;

  const { title, scenes } = storyData;

  const findSceneById = (id) =>
    scenes.find((s) => String(s._id) === String(id)) || null;

  /** Author Name Resolution */
  let authorLabel = "Unknown author";
  const author = currentScene.author;

  if (author) {
    if (typeof author === "string") {
      authorLabel = author;
    } else if (typeof author === "object") {
      authorLabel =
        author.username ||
        author.name ||
        author.email ||
        String(author._id || "");
    }
  }

  const sceneText =
    currentScene.text ?? currentScene.content ?? "No text available.";

  return (
    <div className="reader-page">
      {/* Header with Back Button */}
      <div className="reader-header">
        <button
          className="reader-back-btn"
          onClick={() => navigate(-1)}
          title="Go Back"
        >
          <ArrowLeft size={20} color="#fff" />
        </button>
        <h1>{title}</h1>
      </div>

      {/* Scene author */}
      <div className="scene-author">By {authorLabel}</div>

      {/* Scene text */}
      <div className="scene-text">{sceneText}</div>

      {/* Choices */}
      {currentScene.choices?.length > 0 && (
        <div className="scene-choices">
          {currentScene.choices.map((choice, idx) => {
            const targetId = choice.targetSceneId || choice.nextScene;
            const nextScene = findSceneById(targetId);

            return (
              <button
                key={idx}
                onClick={() => nextScene && setCurrentScene(nextScene)}
                disabled={!nextScene}
              >
                {choice.text}
              </button>
            );
          })}
        </div>
      )}

      {/* Ending message */}
      {currentScene.hasEnded && (
        <div className="scene-ended">The story ends here.</div>
      )}

      {/* Create Story button — ONLY if NOT ended */}
      {!currentScene.hasEnded && (
        <div className="create-story-wrapper">
          <button
            className="create-story-button"
            onClick={() => navigate("/create-story")}
          >
            Create Story
          </button>
        </div>
      )}
    </div>
  );
}
