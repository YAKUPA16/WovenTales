// [Backend] api/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("./utils/cloudinary");

const Prompt = require("./models/Prompt");
const Story = require("./models/Story");
const Comment = require("./models/Comment");
const StoryProgress = require("./models/StoryProgress");
const User = require("./models/User");

async function connect() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing in .env");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");
}

async function seedPrompts() {
  const promptDocs = [
    {
      text: "You wake up in a city where every person claims to know you—but you don’t know any of them.",
      theme: { bg: "#22b8d6", fg: "#ffffff" },
      tags: ["mystery"],
      isActive: true,
      weight: 5,
    },
    {
      text: "Your shadow starts acting independently—and it’s tired of following you.",
      theme: { bg: "#b9d81c", fg: "#ffffff" },
      tags: ["fantasy"],
      isActive: true,
      weight: 5,
    },
    {
      text: "A simple dare at school reveals a hidden room no one knew existed.",
      theme: { bg: "#f6b12a", fg: "#ffffff" },
      tags: ["adventure"],
      isActive: true,
      weight: 5,
    },
    {
      text: "You wake up with a tattoo you don’t remember getting—and it marks you for something dangerous.",
      theme: { bg: "#4b46f0", fg: "#ffffff" },
      tags: ["thriller"],
      isActive: true,
      weight: 5,
    },
    {
      text: "You find a notebook in class that predicts tomorrow’s events.",
      theme: { bg: "#ff2ca3", fg: "#ffffff" },
      tags: ["sci-fi"],
      isActive: true,
      weight: 5,
    },
  ];

  await Prompt.deleteMany({});
  const inserted = await Prompt.insertMany(promptDocs);
  console.log(`✅ Seeded prompts: ${inserted.length}`);
  return inserted;
}

async function seedDemoUser() {
  const email = "demo@woventales.com";
  const username = "demo_user";

  let user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    user = await User.create({
      name: "Demo User",
      username,
      email,
      password: "DemoPassword123!", // seeding only
    });
    console.log("✅ Created demo user");
  } else {
    console.log("ℹ️ Demo user already exists");
  }

  return user._id;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ensures at least minN picks (or all if array smaller)
function pickAtLeast(arr, minN, maxN) {
  const shuffled = shuffle(arr);
  const n = Math.min(Math.max(minN, Math.min(maxN, shuffled.length)), shuffled.length);
  return shuffled.slice(0, n);
}

// ---------- Cloudinary helpers ----------

async function fetchCloudinaryImageUrls(targetCount = 20) {
  // We’ll fetch up to 100 images. If you uploaded 20+, you’ll get 20 unique covers.
  // If fewer, we’ll cycle them.
  try {
    const res = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      max_results: 100,
    });

    const resources = res?.resources || [];
    const urls = resources.map((r) => r.secure_url).filter(Boolean);

    console.log(`✅ Cloudinary images found (upload/image): ${urls.length}`);
    console.log(
      "🔎 Cloudinary sanity (first 10 public_ids):",
      resources.slice(0, 10).map((r) => r.public_id)
    );

    if (urls.length === 0) return [];

    // Make sure we return at least targetCount urls by cycling.
    const out = [];
    for (let i = 0; i < targetCount; i++) {
      out.push(urls[i % urls.length]);
    }
    return out;
  } catch (e) {
    console.log("⚠️ Cloudinary fetch failed. Reason:", e.message);
    return [];
  }
}

// ---------- Seeding stories ----------

async function seedStories(prompts, authorUserId, users) {
  const userIds = users.map((u) => u._id);
  if (!userIds.length) throw new Error("No users found (needed for likes/ratings).");

  const STORY_COUNT = 20;

  // Prefer Cloudinary covers for ALL stories
  const cloudCovers = await fetchCloudinaryImageUrls(STORY_COUNT);

  // Fallback local covers if Cloudinary has none
  const localFallback = [
    "/images/stories/chronos.jpg",
    "/images/stories/wyvern.jpg",
    "/images/stories/masquerade.jpg",
    "/images/stories/void.jpg",
  ];

  const titles = [
    "The Chronos Paradox",
    "Whispers of the Wyvern",
    "Midnight Masquerade",
    "Echoes from the Void",
    "The Lantern District",
    "Clockwork Lullaby",
    "Paper Skies",
    "The Sapphire Door",
    "Neon Afterglow",
    "The Hollow Library",
    "Cindersong",
    "A Study in Starlight",
    "Garden of Glass",
    "The Sunken Staircase",
    "Ink & Thunder",
    "The Marble Comet",
    "Silverhour Secrets",
    "The Last Page",
    "Wolves of the East Wind",
    "City of Borrowed Names",
  ];

  const genres = ["Sci-Fi", "Fantasy", "Mystery", "Horror", "Adventure", "Thriller"];

  const base = Array.from({ length: STORY_COUNT }).map((_, i) => ({
    title: titles[i] || `Untitled Story ${i + 1}`,
    genre: genres[i % genres.length],
    coverImageUrl: cloudCovers[i] || localFallback[i % localFallback.length], // ✅ cloudinary for all (fallback if none)
    promptRef: prompts[i % prompts.length]?._id,
    author: authorUserId,
    status: "published",
    commentsCount: 0,
    // Make numbers varied so popular sort feels real:
    views: randInt(50, 1500),
  }));

  const storyDocs = base.map((s) => {
    // likes/ratings NOT empty
    const likesUsers = pickAtLeast(userIds, 3, Math.min(15, userIds.length));
    const ratingUsers = pickAtLeast(userIds, 3, Math.min(15, userIds.length));

    const ratings = ratingUsers.map((uid) => ({
      user: uid,
      value: randInt(3, 5),
    }));

    return { ...s, likes: likesUsers, ratings };
  });

  await Story.deleteMany({});
  const inserted = await Story.insertMany(storyDocs);

  console.log(
    "✅ Stories seeded (first 5 preview):",
    inserted.slice(0, 5).map((x) => ({
      title: x.title,
      cover: x.coverImageUrl ? "✅" : "❌",
      likes: x.likes?.length || 0,
      ratings: x.ratings?.length || 0,
      views: x.views || 0,
    }))
  );

  console.log(`✅ Seeded stories: ${inserted.length}`);
  return inserted;
}

// ---------- Seeding progress/comments ----------

async function seedProgressForAllUsers(stories) {
  await StoryProgress.deleteMany({});

  const users = await User.find({}, { _id: 1 }).lean();
  if (!users.length) {
    console.log("⚠️ No users found. Skipping StoryProgress seeding.");
    return;
  }

  // ✅ give each user 10 completed stories so Readers Panel can show 10+
  const completedSet = stories.slice(0, Math.min(10, stories.length));

  const docs = [];
  for (const u of users) {
    completedSet.forEach((st, idx) => {
      docs.push({
        user: u._id,
        story: st._id,
        status: "completed",
        completedAt: new Date(Date.now() - idx * 86400000),
        progressPercent: 100,
      });
    });
  }

  const inserted = await StoryProgress.insertMany(docs);
  console.log(`✅ Seeded story progress: ${inserted.length} (for ${users.length} users)`);
}

async function seedCommentsForAllUsers(stories) {
  await Comment.deleteMany({});

  const users = await User.find({}, { _id: 1 }).lean();
  if (!users.length) {
    console.log("⚠️ No users found. Skipping Comment seeding.");
    return;
  }

  const randUserId = () => users[Math.floor(Math.random() * users.length)]._id;

  // ✅ spread comments across many stories
  const sampleTexts = [
    "That twist at the end was wild 👀",
    "Loved the pacing — keep writing!",
    "The world-building here is *so* good.",
    "I NEED the next chapter immediately 😭",
    "This atmosphere is perfect.",
    "The ending gave me chills.",
    "Beautiful writing style.",
    "The dialogue felt super real.",
  ];

  const docs = [];
  const commentCount = Math.min(60, stories.length * 3); // ~3 per story up to 60

  for (let i = 0; i < commentCount; i++) {
    const st = stories[i % stories.length];
    docs.push({
      story: st._id,
      user: randUserId(),
      text: sampleTexts[i % sampleTexts.length],
    });
  }

  const inserted = await Comment.insertMany(docs);
  console.log(`✅ Seeded comments: ${inserted.length}`);

  // Update commentsCount per story
  const counts = new Map();
  for (const c of inserted) {
    const key = String(c.story);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const updates = [];
  for (const [storyId, count] of counts.entries()) {
    updates.push(Story.updateOne({ _id: storyId }, { $set: { commentsCount: count } }));
  }
  await Promise.all(updates);
  console.log("✅ Updated stories.commentsCount");
}

async function wipeCollections() {
  await Comment.deleteMany({});
  await StoryProgress.deleteMany({});
  await Story.deleteMany({});
  await Prompt.deleteMany({});
  // keep users
}

async function run() {
  await connect();
  await wipeCollections();

  const demoUserId = await seedDemoUser();
  const users = await User.find({}, { _id: 1 }).lean();

  const prompts = await seedPrompts();
  const stories = await seedStories(prompts, demoUserId, users);

  await seedProgressForAllUsers(stories);
  await seedCommentsForAllUsers(stories);

  console.log("🎉 Seeding done!");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
