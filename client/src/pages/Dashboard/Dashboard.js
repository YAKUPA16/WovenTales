import PopularStories from "../../components/Engagement/PopularStories/PopularStories";
import ContinueStories from "../../components/Engagement/ContinueStories/ContinueStories";
import RecentlyAdded from "../../components/Engagement/RecentlyAdded/RecentlyAdded";
import ReaderPanel from "../../components/Story/ReaderPanel/ReaderPanel";
import "./Dashboard.css";

export default function Dashboard() {
  return (
  <div className="dashboard-grid">

    <section className="container carousel-section">
      <div className="hero-content">
        <h1>Unfold Your Next Adventure</h1>
        <p>Dive into a universe of collaborative stories, where every choice weaves a new tale.</p>
        <button className="hero-button">Create Your Story</button>
      </div>
    </section>

    <div class="container">
      <header>Prompts</header>
      <div class="prompt-box blue">
          <p>This is a blue prompt box</p>
      </div>
      <div class="prompt-box green">
          <p>This is a green prompt box</p>
      </div>
      <div class="prompt-box orange">
          <p>This is an orange prompt box</p>
      </div>
    </div>

  </div>
  );
}
