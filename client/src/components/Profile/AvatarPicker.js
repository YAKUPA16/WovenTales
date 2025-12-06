import React from "react";
import "./Profile.css";

const AVATARS = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
];

export default function AvatarPicker({ current, onSelect }) {
  return (
    <div className="avatar-grid">
      {AVATARS.map((src) => (
        <button
          key={src}
          type="button"
          className={`avatar-item ${current === src ? "active" : ""}`}
          onClick={() => onSelect(src)}
        >
          <img src={src} alt="avatar" />
        </button>
      ))}
    </div>
  );
}
