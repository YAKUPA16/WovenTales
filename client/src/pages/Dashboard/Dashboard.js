// [Frontend] client/src/pages/Dashboard/Dashboard.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Dashboard.css";
import { fetchDashboard } from "../../services/dashboardService";
import { FiSearch, FiBell, FiMoon, FiMaximize2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import StoryModal from "../../components/Story/StoryModal/StoryModal";

function clampText(str, max = 90) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function likesCountOf(story) {
  if (!story) return 0;
  if (typeof story.likesCount === "number") return story.likesCount;
  return Array.isArray(story.likes) ? story.likes.length : 0;
}

function StoryCard({ story, onClick }) {
  return (
    <button className="db-storyCard db-storyCardBig" onClick={onClick} type="button">
      <div
        className="db-storyImage db-storyImageBig"
        style={{
          backgroundImage: story.coverImageURL ? `url(${story.coverImageURL})` : "none",
        }}
      >
        {!story.coverImageURL && <div className="db-storyImageFallback" />}
      </div>

      <div className="db-storyMeta">
        <div className="db-storyTitle">{story.title}</div>
        {/* Optional placeholder for genre removed */}
      </div>
    </button>
  );
}


function ScrollRow({ children, ariaLabel }) {
  const rowRef = useRef(null);

  const scrollByCards = (dir) => {
    const el = rowRef.current;
    if (!el) return;

    // scroll ~2 cards at a time (based on card width)
    const card = el.querySelector(".db-storyCardBig");
    const cardWidth = card ? card.getBoundingClientRect().width : 320;
    const gap = 18;
    const amount = dir * (cardWidth * 2 + gap * 2);

    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="db-rowWrap" aria-label={ariaLabel}>
      <button
        className="db-rowArrow db-rowArrowLeft"
        type="button"
        onClick={() => scrollByCards(-1)}
        aria-label="Scroll left"
        title="Scroll left"
      >
        <FiChevronLeft />
      </button>

      <div className="db-storyRow db-storyRowSnapped" ref={rowRef}>
        {children}
      </div>

      <button
        className="db-rowArrow db-rowArrowRight"
        type="button"
        onClick={() => scrollByCards(1)}
        aria-label="Scroll right"
        title="Scroll right"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ prompts: [], popularStories: [], completedStories: [] });
  const [error, setError] = useState("");

  const [selectedStoryId, setSelectedStoryId] = useState(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const [theme, setTheme] = useState(() => localStorage.getItem("wt_theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("wt_theme", theme);
  }, [theme]);

  const [notifs, setNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await fetchDashboard();
        console.log("Dashboard data:", res);
        if (!mounted) return;
        setData(res);
        setError("");
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || "Failed to load dashboard.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading || error) return;

    const now = Date.now();
    const popularTop = data.popularStories?.[0];
    const completedTop = data.completedStories?.[0];
    const promptTop = data.prompts?.[0];

    const newNotifs = [
      popularTop && {
        id: "pop-1",
        ts: now - 2 * 60 * 1000,
        unread: true,
        icon: "🔥",
        text: `“${popularTop.title}” is trending with ${likesCountOf(popularTop)} likes.`,
      },
      completedTop && {
        id: "comp-1",
        ts: now - 9 * 60 * 1000,
        unread: true,
        icon: "✅",
        text: `You have completed “${completedTop.title}”. Tap to re-open it.`,
      },
      promptTop && {
        id: "pr-1",
        ts: now - 22 * 60 * 1000,
        unread: true,
        icon: "🧠",
        text: `New daily prompt: “${clampText(promptTop.text, 65)}”`,
      },
      {
        id: "sys-1",
        ts: now - 45 * 60 * 1000,
        unread: false,
        icon: "🔐",
        text: "Your session is active. You can log out from the sidebar anytime.",
      },
    ].filter(Boolean);

    setNotifs(newNotifs);
    setUnreadCount(newNotifs.filter((n) => n.unread).length);
  }, [loading, error, data]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    const onDown = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [notifOpen]);

  const applySearch = () => setQuery(queryInput.trim());

  const clearSearch = () => {
    setQueryInput("");
    setQuery("");
    searchRef.current?.focus();
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (e) {
      alert("Fullscreen blocked by browser. Click the page once and try again.");
    }
  };

  const q = query.toLowerCase();

  const filteredPopular = useMemo(() => {
    if (!q) return data.popularStories;
    return data.popularStories.filter(
      (s) => s.title?.toLowerCase().includes(q)
    );
  }, [q, data.popularStories]);

  const filteredCompleted = useMemo(() => {
    if (!q) return data.completedStories;
    return data.completedStories.filter(
      (s) => s.title?.toLowerCase().includes(q)
    );
  }, [q, data.completedStories]);

  const filteredPrompts = useMemo(() => {
    if (!q) return data.prompts;
    return data.prompts.filter((p) => p.text?.toLowerCase().includes(q));
  }, [q, data.prompts]);

  const totalMatches = useMemo(() => {
    if (!q) return null;
    return filteredPopular.length + filteredCompleted.length + filteredPrompts.length;
  }, [q, filteredPopular.length, filteredCompleted.length, filteredPrompts.length]);

  return (
    <div className="db-page">
      <div className="db-content">
        {/* Top bar */}
        <div className="db-topbar">
          <div className="db-searchWrap">
            <FiSearch className="db-searchIcon" />
            <input
              ref={searchRef}
              className="db-searchInput"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applySearch();
                if (e.key === "Escape") clearSearch();
              }}
              placeholder="Search (press Enter)…"
            />
          </div>

          <button className="db-searchBtn" type="button" onClick={applySearch}>
            Search
          </button>

          <button className="db-searchBtn db-searchBtnGhost" type="button" onClick={clearSearch}>
            Clear
          </button>

          <div className="db-topIcons" ref={notifRef}>
            <button
              className="db-iconBtn"
              type="button"
              aria-label="theme"
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              title="Toggle theme"
            >
              <FiMoon />
            </button>

            <button
              className="db-iconBtn"
              type="button"
              aria-label="notifications"
              onClick={() => {
                setNotifOpen((v) => !v);
                if (!notifOpen) {
                  setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
                  setUnreadCount(0);
                }
              }}
              title="Notifications"
              style={{ position: "relative" }}
            >
              <FiBell />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    height: "18px",
                    minWidth: "18px",
                    padding: "0 6px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 900,
                    display: "grid",
                    placeItems: "center",
                    background: "#ff3b30",
                    color: "#fff",
                    border: "2px solid var(--card)",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="db-notifs">
                <div className="db-notifsTitle">Notifications</div>

                {notifs.length === 0 ? (
                  <div className="db-notifItem">No notifications yet.</div>
                ) : (
                  notifs
                    .slice()
                    .sort((a, b) => b.ts - a.ts)
                    .map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          const hitPopular = data.popularStories?.find((s) => n.text.includes(`“${s.title}”`));
                          const hitCompleted = data.completedStories?.find((s) => n.text.includes(`“${s.title}”`));
                          const storyHit = hitPopular || hitCompleted;

                          if (storyHit?._id) {
                            setSelectedStoryId(storyHit._id);
                            setNotifOpen(false);
                          }
                        }}
                        className="db-notifItem"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          border: 0,
                          cursor: "pointer",
                          outline: "none",
                          opacity: n.unread ? 1 : 0.85,
                          boxShadow: n.unread ? "inset 0 0 0 2px rgba(43, 182, 217, 0.35)" : "none",
                        }}
                        title="Click to open"
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <span style={{ fontSize: 18 }}>{n.icon}</span>
                            <span style={{ fontWeight: 700 }}>{n.text}</span>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 800, opacity: 0.7 }}>{timeAgo(n.ts)}</span>
                        </div>
                      </button>
                    ))
                )}
              </div>
            )}

            <button
              className="db-iconBtn"
              type="button"
              aria-label="fullscreen"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <FiMaximize2 />
            </button>
          </div>
        </div>

        {/* Banner */}
        <div
          className="db-hero"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/title.jpg)`,
          }}
        >
          <div className="db-heroOverlay">
            <h1 className="db-heroTitle">Unfold Your Next Adventure</h1>
            <p className="db-heroSubtitle">
              Dive into a universe of collaborative stories, where every choice weaves a new tale.
            </p>
            {totalMatches !== null && (
              <div className="db-resultsHint">
                Showing {totalMatches} match(es) for “{query}”.
              </div>
            )}
          </div>
        </div>

        {loading && <div className="db-state">Loading dashboard…</div>}
        {!loading && error && <div className="db-state db-stateError">{error}</div>}

        {!loading && !error && (
          <>
            {/* Daily prompts */}
            <section className="db-section">
              <div className="db-sectionHeader">
                <h2 className="db-sectionTitle">Daily Prompts</h2>
              </div>

              <div className="db-promptsRow">
                {filteredPrompts.map((p, idx) => (
                  <button
                    className="db-promptCard"
                    style={{
                      background: p?.theme?.bg || undefined,
                      color: p?.theme?.fg || undefined,
                    }}
                    key={p._id || idx}
                    type="button"
                    onClick={() => console.log("prompt clicked:", p._id)}
                    title={p.text}
                  >
                    {clampText(p.text, 120)}
                  </button>
                ))}
              </div>
            </section>

            {/* Popular */}
            <section className="db-section">
              <div className="db-sectionHeader">
                <h2 className="db-sectionTitle">Popular</h2>
              </div>

              <div className="db-card db-carouselCard">
                <ScrollRow ariaLabel="Popular stories">
                  {filteredPopular.map((s) => (
                    <StoryCard key={s._id} story={s} onClick={() => setSelectedStoryId(s._id)} />
                  ))}
                </ScrollRow>
              </div>
            </section>

            {/* Readers Panel */}
            <section className="db-section">
              <div className="db-sectionHeader">
                <h2 className="db-sectionTitle">Readers Panel</h2>
              </div>

              <div className="db-card db-carouselCard">
                <ScrollRow ariaLabel="Completed stories">
                  {filteredCompleted.length === 0 ? (
                    <div className="db-empty">
                      {q ? "No completed stories match your search." : "No completed stories yet."}
                    </div>
                  ) : (
                    filteredCompleted.map((s) => (
                      <StoryCard key={s._id} story={s} onClick={() => setSelectedStoryId(s._id)} />
                    ))
                  )}
                </ScrollRow>
              </div>
            </section>
          </>
        )}
      </div>

      <StoryModal open={!!selectedStoryId} storyId={selectedStoryId} onClose={() => setSelectedStoryId(null)} />
    </div>
  );
}
