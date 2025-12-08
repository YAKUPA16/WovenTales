import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import "./ReaderPage.css";

export default function ReaderPage() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    axiosInstance.get(`/stories/${storyId}/scenes`)
      .then(res => {
        if (!alive) return;
        setStory(res.data); // Assume this contains all scenes
        setCurrentSceneId(res.data.rootSceneId); // root of the story
      })
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [storyId]);

  if (loading) return <div>Loading story...</div>;
  if (!story) return <div>No story found.</div>;

  const currentScene = story.scenes.find(s => s._id === currentSceneId);

  return (
    <div className="reader-page">
      <h1>{story.title}</h1>
      <div className="scene-text">{currentScene?.text}</div>

      {currentScene?.choices?.length > 0 && (
        <div className="scene-choices">
          {currentScene.choices.map((c) => (
            <button
              key={c._id}
              onClick={() => setCurrentSceneId(c.targetSceneId)}
            >
              {c.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
