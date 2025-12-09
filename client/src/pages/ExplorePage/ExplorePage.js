import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import axiosInstance from "../../services/axiosInstance";
import "./ExplorePage.css";

export default function ExplorePage() {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
            const res = await axiosInstance.get("/explorer/stories");
            setStories(res.data.stories);
            } catch (err) {
            console.error("Failed to load explore stories", err);
            }
        };

        load();
        }, []);

    const breakpoints = {
        default: 4, 
        1100: 3,
        800: 2,
        500: 1
    };

    return (
        <div className="explore-container">
        <h1 className="explore-title">Explore Stories</h1>

        <Masonry
            breakpointCols={breakpoints}
            className="masonry-grid"
            columnClassName="masonry-column"
        >
            {stories.map((story) => (
            <div 
            className="story-card" 
            key={story._id} 
            style={{ backgroundImage: story.coverImageUrl ? `url(${story.coverImageUrl})` : 'none'}}>
                 <div className="story-card-content">
                    <h3 className="story-title">{story.title}</h3>
                    <p className="story-desc">{story.description}</p>
                </div>
            </div>
            ))}
        </Masonry>
        </div>
    );
}
