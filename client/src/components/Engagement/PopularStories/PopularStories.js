import React from "react";
import "./PopularStories.css";
import { renderStars } from "../../utils/rating";

const sample = [
  { id: 1, title: "The Lost Kingdom", cover: "/Kingdom.jpg", rating: 4.8 },
  { id: 2, title: "The Secret Garden", cover: "/Garden.jpg", rating: 4.6 }
];

export default function PopularStories() {
  return (
    <div className="card">
      <div className="card-header">
        <h2>🔥 Popular Stories</h2>
        <button className="link">See all</button>
      </div>

      <div className="popular-grid">
        {sample.map(s => (
          <div className="story-card" key={s.id}>
            <img src={s.cover} alt={s.title} height={150} width={230}/>
            <div className="story-info">
              <div className="title">{s.title}</div>
              <div className="rating">{renderStars(s.rating)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
