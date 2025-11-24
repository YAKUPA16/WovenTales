import PopularStories from "../../components/Engagement/PopularStories/PopularStories";
import ContinueStories from "../../components/Engagement/ContinueStories/ContinueStories";
import RecentlyAdded from "../../components/Engagement/RecentlyAdded/RecentlyAdded";
import ReaderPanel from "../../components/Story/ReaderPanel/ReaderPanel";

export default function Dashboard() {
  return (
  <div className="dashboard-grid">
    <section className="left-panel">
      <PopularStories />
    </section>

    <aside className="right-panel">

    </aside>
  </div>
  );
}
