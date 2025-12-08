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

  const storyTexts = [
    "Time was never meant to fold, but in the alley behind Barrow Street, the clocks all pointed to different yesterdays. Mira knew the rules: never touch the hands, never step through the hour that isn’t yours. Tonight, the bells chimed thirteen, and a stranger walked out of tomorrow wearing her face.",
    "The villagers said the wyvern was a myth, a bedtime threat meant to keep children from the cliffs. Yet every dusk, Arlen heard its voice in the wind, ancient and tired. When he finally followed the whispers, they didn’t lead him to a monster—but to a chained guardian begging to be set free.",
    "The invitation was unsigned, the mask delivered to her window in the dead of night. At the masquerade, no one used real names and the mirrors were draped in velvet. When the music stopped and the lights went out, Elara realized the person wearing her mask across the room wasn’t a reflection.",
    "Space wasn’t supposed to have echoes, but the signal repeated anyway: a distorted heartbeat pulsing from beyond the edge of the mapped universe. Captain Reyes knew they should turn back. Instead, she ordered the ship forward, chasing the echo that was calling her by a name she hadn’t heard since childhood.",
    "In the Lantern District, night never really ended—it just flickered between shades of neon and gold. Every lantern carried a memory for sale, sealed in glass and light. When Jun bought the smallest one, the vendor warned, 'Memories don’t like being borrowed.' The flame inside whispered his name before he lit it.",
    "The lullaby ticked softly from the music box, gears turning in perfect, uneasy rhythm. Children in the city slept dreamlessly, their nightmares siphoned away by unseen hands. When Ori broke the music box open, he didn’t find springs or cogs—only a tiny clockwork heart, still beating and trying to sing.",
    "They said the paper planes could only fly inside the old studio, where the ceiling was painted like a cloudy sky. Lyra folded her first one with shaking hands, ink still wet with the confession she’d never say out loud. When she threw it, it didn’t fall—it vanished into a wind only it could feel.",
    "The door appeared between two lockers that had never had space between them before. Its frame glittered faintly, like a held breath. Sam touched the sapphire knob and felt oceans surge behind it, storms and stories pressing to get out. The sign above it read: 'Authorized Imagination Only.'",
    "The city didn’t sleep—it hummed, neon signs blinking like tired eyes. Kai rode the train that only came after midnight, where the windows showed places that didn’t exist on any map. One night, his reflection stayed behind when he stepped off, and the glass flashed a world where he had never been born.",
    "The library had no entrance during the day. At night, its doors grew out of the fog between two abandoned shops. Shelves towered into darkness, filled with books bound in unfamiliar materials. When Rhea pulled one free, it pulsed like a heartbeat, and the title rearranged itself to spell her deepest fear.",
    "Every time the fire roared to life, it sang. Not in words, but in notes that tasted like ash and sugar, loss and promise. Niko was the only one who could hear the melody woven into the flames. When the cinders rose and spiraled into shapes of people long gone, he realized the song was a warning.",
    "The observatory had been closed for years, yet the telescope still turned on its own every clear night. Lira wiped the dust from the lens and peered through, expecting stars. Instead she saw a desk, a lamp, and a version of herself in another universe, writing a story that ended with her name.",
    "The greenhouse in the center of town had no door, just panes of stained glass painted with flowers no one could name. When the first crack appeared, light leaked out like liquid. Emil slipped through and found a garden where every petal reflected memories he hadn’t lived yet—and some he hoped never to.",
    "The staircase descended into water that glowed faintly, like moonlight caught in glass. No one remembered when it had appeared in the middle of the plaza. Children dropped wishes folded into paper boats and watched them sink. Mara took a breath, stepped onto the first wet step, and felt someone else exhale for her.",
    "Rain fell only over the city’s oldest district, never touching the shining towers. Ink pooled in the gutters instead of water, swirling with half-formed words. Theo dipped his fingers in and came back with stories staining his skin. Every storm left him with new lines—and with voices that weren’t his.",
    "The comet was supposed to pass silently, another streak of light across the sky. Instead, it stopped—hung there, like a marble placed gently on black velvet. When the first shards began to fall, they weren’t hot or burning. They were cold, whispering fragments of forgotten wishes to anyone who caught them.",
    "In Silverhour, the city between seconds, everyone moved just a little too slowly to see. Everyone except Aya. She slipped through frozen crowds, reading the suspended expressions on strangers’ faces. The more she wandered, the more she saw the cracks in the world’s ticking rhythm—and the thing prying them open.",
    "The bookshop’s last shelf was always empty, no matter how many times the owner restocked it. When Rowan arrived at closing time, a single book lay there, its cover blank, its pages waiting. As he opened it, ink bled up from the spine, forming the first sentence: 'This is where you choose your ending.'",
    "The wolves didn’t howl at the moon anymore. They howled at the wind turbines dotting the frozen plains, metal giants turning their backs on the old ways. Yara followed the pack, her breath clouding the air, and found that what they hunted wasn’t prey—it was the last echo of winter’s true name.",
    "Everyone in the city wore borrowed names, stitched into the collars of their coats. Names were traded, rented, stolen in the night. Eren’s name had never quite fit, hanging heavy on his tongue. When he met the girl with no name at all, the streets whispered, and the city began rearranging its stories around them.",
  ];

  const genres = ["Sci-Fi", "Fantasy", "Mystery", "Horror", "Adventure", "Thriller"];

  const base = Array.from({ length: STORY_COUNT }).map((_, i) => ({
    title: titles[i] || `Untitled Story ${i + 1}`,
    text:
      storyTexts[i] ||
      "Once upon a time, a story was waiting to be written, and it chose this page to begin on.",
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

  const randUserId = () => users[Math.floor(Math.random() *(users.length))]._id;

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

