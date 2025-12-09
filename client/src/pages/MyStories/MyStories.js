import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance"; 
import { useSelector } from "react-redux"; 
import { Link } from "react-router-dom";

export default function MyContributionsPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchContributedStories = async () => {
      try {
        const res = await axiosInstance.get(`/stories/my-contributions/${user._id}`);
        setStories(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch stories you contributed to.");
      } finally {
        setLoading(false);
      }
    };

    fetchContributedStories();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (stories.length === 0) return <p>You haven't contributed to any stories yet.</p>;

  return (
    <div className="my-contributions-page">
      <h1>Stories You Contributed To</h1>
      <ul>
        {stories.map((story) => (
          <li key={story._id}>
            <Link to={`/reader/${story._id}`}>{story.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
