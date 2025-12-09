// [Backend] api/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("./utils/cloudinary");

const Story = require("./models/Story");
const Scene = require("./models/Scene");
const User = require("./models/User");
const Prompt = require("./models/Prompt"); // needed for seedPrompts

// ---------- DB CONNECT ----------

async function connect() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing in .env");
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");
}

// ---------- HELPERS ----------

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickSome(arr, maxN) {
  if (!arr.length) return [];
  const n = Math.min(maxN, arr.length);
  return shuffle(arr).slice(0, n);
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

// ---------- DEMO USER ----------

async function ensureDemoUser() {
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

  return user;
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

// ---------- STORY + SCENE TEMPLATES ----------
//
// For each template we will create:
// - 1 Story
// - 1 root Scene whose _id === story.firstScene
// - 1 follow-up Scene per choice (2–3 choices per root)
//   so each choice.nextScene points to a real Scene.
//
// Scene schema expected:
// {
//   storyId: ObjectId,
//   parentId: ObjectId | null,
//   author: ObjectId (User),
//   content: String,
//   choices: [{ text: String, nextScene: ObjectId }],
//   hasEnded: Boolean
// }

const STORY_TEMPLATES = [
  {
    title: "The Lost City",
    genre: "Adventure",
    coverImageUrl: "https://example.com/lostcity.jpg",
    storyText: "An ancient map leads to a forgotten world...",
    rootSceneContent: "The map reveals the location of a lost underground city.",
    choices: [
      {
        text: "Follow the map directly into the ruins",
        followContent:
          "You arrive at a crumbling archway, half-buried in sand, with symbols you don’t recognize.",
      },
      {
        text: "Stop in the nearest town to gather supplies",
        followContent:
          "In a dusty tavern, an old explorer warns that no one who rushed in ever returned.",
      },
      {
        text: "Burn the map and try to forget what you saw",
        followContent:
          "Even as the map burns, you see the city’s outline seared into your mind.",
      },
    ],
  },
  {
    title: "Echoes of the Forgotten Realm",
    genre: "Fantasy",
    coverImageUrl: "https://example.com/forgottenrealm.jpg",
    storyText: "Legends speak of a kingdom swallowed by mist, waiting to rise again.",
    rootSceneContent:
      "The mist parts just enough to reveal crumbling towers floating in the air.",
    choices: [
      {
        text: "Step onto the nearest floating bridge",
        followContent:
          "The bridge creaks under your weight, but the mist below feels almost solid.",
      },
      {
        text: "Call out to see if anyone answers",
        followContent:
          "Your voice echoes back twice—once as you, and once as someone who sounds like you from years ago.",
      },
    ],
  },
  {
    title: "Clockwork Skies",
    genre: "Sci-Fi",
    coverImageUrl: "https://example.com/clockworkskies.jpg",
    storyText: "In a world where clouds are gears turning above the horizon...",
    rootSceneContent: "Above you, a gear the size of the moon stutters, then stops entirely.",
    choices: [
      {
        text: "Head to the central clocktower to investigate",
        followContent:
          "Inside the tower, you find an enormous key missing from its socket.",
      },
      {
        text: "Wait and see how the city reacts",
        followContent:
          "Panic spreads; birds fall from the sky as if time has let go of them.",
      },
    ],
  },
  {
    title: "Whispers Beneath the Ice",
    genre: "Horror",
    coverImageUrl: "https://example.com/icewhispers.jpg",
    storyText: "Something ancient stirs beneath the frozen lake...",
    rootSceneContent: "A crack splits the ice and a cold blue light pulses from below.",
    choices: [
      {
        text: "Drop a stone into the crack to test its depth",
        followContent:
          "The stone never hits bottom; instead, you hear a voice counting the seconds out loud.",
      },
      {
        text: "Lie down and press your ear to the ice",
        followContent:
          "You hear muffled screams and a lullaby, overlapping like two radio stations.",
      },
      {
        text: "Run back to shore and pretend you saw nothing",
        followContent:
          "The crack follows you, spiderwebbing toward the shoreline with every step.",
      },
    ],
  },
  {
    title: "Neon Dreams",
    genre: "Cyberpunk",
    coverImageUrl: "https://example.com/neondreams.jpg",
    storyText: "The city glows, but every light hides a shadow waiting to strike.",
    rootSceneContent:
      "A neon billboard flickers and suddenly shows a live feed of your own apartment.",
    choices: [
      {
        text: "Trace the signal to its broadcasting source",
        followContent:
          "The trace leads to a forgotten subway station humming with stolen power.",
      },
      {
        text: "Call someone you trust to check your apartment",
        followContent:
          "Your friend answers in a whisper: someone is already inside, and they look like you.",
      },
    ],
  },
  {
    title: "Garden of Broken Stars",
    genre: "Fantasy",
    coverImageUrl: "https://example.com/brokenstars.jpg",
    storyText: "Stars fall not from the sky, but from the hearts of dying gods...",
    rootSceneContent:
      "Shattered constellations lie scattered among the flowers, still faintly glowing.",
    choices: [
      {
        text: "Collect the brightest fragment you can find",
        followContent:
          "The fragment pulses and shows you a memory that doesn’t belong to you.",
      },
      {
        text: "Listen closely to the hum of the scattered stars",
        followContent:
          "Their song forms a map of somewhere that doesn’t exist on any chart.",
      },
    ],
  },
  {
    title: "Voices in the Fog",
    genre: "Mystery",
    coverImageUrl: "https://example.com/fogvoices.jpg",
    storyText: "Fog rolls in—and with it come whispers from the disappeared.",
    rootSceneContent: "The fog curls upward, forming the blurry outline of a hand reaching for you.",
    choices: [
      {
        text: "Take the fog-formed hand",
        followContent:
          "Your skin goes numb as you’re pulled into a street you’ve never seen before.",
      },
      {
        text: "Demand to know who is calling you",
        followContent:
          "The fog answers with three different names, none of them yours—but all familiar.",
      },
      {
        text: "Turn around and walk directly away from the voices",
        followContent:
          "No matter which way you go, the voices stay just behind your left ear.",
      },
    ],
  },
  {
    title: "Ashes of Tomorrow",
    genre: "Dystopian",
    coverImageUrl: "https://example.com/ashes.jpg",
    storyText: "Humanity rebuilt once—and may have to again.",
    rootSceneContent:
      "A gust of wind scatters the ashes, revealing survivors’ footprints leading away.",
    choices: [
      {
        text: "Follow the freshest set of footprints",
        followContent:
          "They lead to a barricaded doorway with light barely seeping through the cracks.",
      },
      {
        text: "Search the ashes for anything useful",
        followContent:
          "You uncover a half-melted keycard still warm to the touch.",
      },
    ],
  },
  {
    title: "Beneath the Iron Sea",
    genre: "Adventure",
    coverImageUrl: "https://example.com/ironsea.jpg",
    storyText: "A metal ocean hides a labyrinth none have returned from.",
    rootSceneContent:
      "The metal waves part for a moment, exposing a rusted ladder descending into darkness.",
    choices: [
      {
        text: "Climb down the ladder into the depths",
        followContent:
          "The air grows thick with the scent of oil and something like seawater.",
      },
      {
        text: "Mark this spot and search the shoreline first",
        followContent:
          "You find carvings warning that the sea remembers every step you take.",
      },
    ],
  },
  {
    title: "Shadowfall Alley",
    genre: "Thriller",
    coverImageUrl: "https://example.com/shadowfall.jpg",
    storyText: "No one leaves the alley once the shadows choose them.",
    rootSceneContent:
      "The shadow on the wall doesn’t match your movements—it waves you closer instead.",
    choices: [
      {
        text: "Step into the shadow’s reach",
        followContent:
          "You feel the temperature drop as your reflection detaches and walks away.",
      },
      {
        text: "Shine a bright light directly at the wall",
        followContent:
          "The shadow flinches and recoils, revealing a hidden door behind it.",
      },
    ],
  },
  {
    title: "Fragments of Eternity",
    genre: "Fantasy",
    coverImageUrl: "https://example.com/eternity.jpg",
    storyText: "Every shard holds a memory—and a warning.",
    rootSceneContent:
      "The fragment hums with a distant choir and shows your life ending differently.",
    choices: [
      {
        text: "Hold onto the fragment and accept the new ending",
        followContent:
          "You feel time rewinding around you, stitching your choices into a new pattern.",
      },
      {
        text: "Drop the fragment and crush it underfoot",
        followContent:
          "It shatters into dust that rises and forms a question in the air.",
      },
    ],
  },
  {
    title: "The Silent Orchestra",
    genre: "Mystery",
    coverImageUrl: "https://example.com/orchestra.jpg",
    storyText: "Music returns to a city that forgot how to hear.",
    rootSceneContent:
      "In the abandoned concert hall, the instruments are perfectly arranged, waiting.",
    choices: [
      {
        text: "Sit in the first row and wait",
        followContent:
          "Slowly, the instruments begin to tune themselves, one by one.",
      },
      {
        text: "Step onto the conductor’s podium",
        followContent:
          "The baton feels heavy, as if weighed down with unseen expectations.",
      },
    ],
  },
  {
    title: "Dreams of the Last Horizon",
    genre: "Sci-Fi",
    coverImageUrl: "https://example.com/lasthorizon.jpg",
    storyText: "Some horizons are meant to be crossed only once.",
    rootSceneContent:
      "The horizon folds like paper, revealing another sun rising behind it.",
    choices: [
      {
        text: "Walk toward the second sun",
        followContent:
          "Each step feels lighter, as if the ground is forgetting you were ever there.",
      },
      {
        text: "Turn back and watch from a distance",
        followContent:
          "From afar, you see other silhouettes stepping through the fold without hesitation.",
      },
    ],
  },
  {
    title: "When Lanterns Speak",
    genre: "Mystery",
    coverImageUrl: "https://example.com/lanterns.jpg",
    storyText: "Lantern flames whisper the secrets of the missing.",
    rootSceneContent:
      "One lantern’s flame flickers in time with your heartbeat, calling you closer.",
    choices: [
      {
        text: "Ask the lantern who it remembers",
        followContent:
          "The flame whispers a name you’ve never heard, along with your home address.",
      },
      {
        text: "Reach into the flame despite the heat",
        followContent:
          "Your fingers pass through unharmed, grasping something small and metallic inside.",
      },
      {
        text: "Blow the lantern out",
        followContent:
          "Darkness falls instantly, and dozens of other lanterns ignite in response.",
      },
    ],
  },
  {
    title: "Inkheart's Promise",
    genre: "Fantasy",
    coverImageUrl: "https://example.com/inkheart.jpg",
    storyText: "A book that writes back chooses its final author.",
    rootSceneContent:
      "Ink seeps from the book’s spine, sketching your silhouette on the table.",
    choices: [
      {
        text: "Pick up the quill lying beside the book",
        followContent:
          "The quill moves on its own, waiting for you to decide the first word.",
      },
      {
        text: "Close the book before it finishes the drawing",
        followContent:
          "The half-drawn silhouette pounds against the cover from the inside.",
      },
    ],
  },
  {
    title: "The Marble Prophet",
    genre: "Adventure",
    coverImageUrl: "https://example.com/prophet.jpg",
    storyText: "A statue that predicts the future begins whispering your name.",
    rootSceneContent:
      "The prophet’s stone eyes fill with liquid light, reflecting a city in flames.",
    choices: [
      {
        text: "Ask how to stop the fire",
        followContent:
          "The prophet shows you a single person whose choice will decide everything.",
      },
      {
        text: "Ask when the fire will begin",
        followContent:
          "You see tomorrow’s sunrise, tinted orange with smoke.",
      },
    ],
  },
  {
    title: "Nightfall Over Ember City",
    genre: "Thriller",
    coverImageUrl: "https://example.com/embercity.jpg",
    storyText: "The city lights go out—and something else turns on.",
    rootSceneContent:
      "As the final light in Ember City goes out, a hidden elevator door slides open beside you.",
    choices: [
      {
        text: "Enter the elevator without hesitation",
        followContent:
          "The doors close and the floor indicator shows floors that don’t exist on any blueprint.",
      },
      {
        text: "Look around for anyone else who noticed",
        followContent:
          "In the darkness, you see eyes watching from apartment windows.",
      },
    ],
  },
  {
    title: "Through the Silver Gate",
    genre: "Fantasy",
    coverImageUrl: "https://example.com/silvergateway.jpg",
    storyText: "The gate appears once per century—and today is the day.",
    rootSceneContent:
      "The gate ripples like liquid metal as it reflects a world where you never left home.",
    choices: [
      {
        text: "Step through and embrace the other life",
        followContent:
          "Warm air and familiar laughter greet you from the other side.",
      },
      {
        text: "Throw a stone through first to test it",
        followContent:
          "The stone passes through and appears in your reflection’s hand.",
      },
    ],
  },
  {
    title: "The Crimson Cipher",
    genre: "Mystery",
    coverImageUrl: "https://example.com/cipher.jpg",
    storyText: "A coded letter warns of a crime not yet committed.",
    rootSceneContent:
      "Each symbol on the letter glows red, then rearranges into a countdown.",
    choices: [
      {
        text: "Read the symbols aloud as they change",
        followContent:
          "The room shudders, and the clock on the wall ticks backward by one minute.",
      },
      {
        text: "Try to photograph the letter before it shifts again",
        followContent:
          "On the photo, the countdown is replaced by a list of names.",
      },
    ],
  },
  {
    title: "Dreambound",
    genre: "Fantasy",
    coverImageUrl: "https://example.com/dreambound.jpg",
    storyText: "Dreams are portals—and someone has sealed yours shut.",
    rootSceneContent:
      "The dream-barrier shimmers, and you glimpse a version of you who never woke up.",
    choices: [
      {
        text: "Knock on the barrier like a door",
        followContent:
          "Your sleeping self stirs, eyes opening slowly on the other side.",
      },
      {
        text: "Search your room for whoever sealed the portal",
        followContent:
          "You find a note on your pillow written in your own handwriting, warning you not to open it.",
      },
    ],
  },
  {
    title: "Voices of the Deepwood",
    genre: "Adventure",
    coverImageUrl: "https://example.com/deepwood.jpg",
    storyText: "The forest speaks—and tonight, it calls your name.",
    rootSceneContent:
      "The trees lean in, their bark splitting to reveal glowing runes shaped like eyes.",
    choices: [
      {
        text: "Speak the runes aloud",
        followContent:
          "The forest floor rearranges into a path only visible to you.",
      },
      {
        text: "Carve one of the runes into your arm",
        followContent:
          "Your blood glows briefly, and you hear distant footsteps approaching.",
      },
    ],
  },
];

// ---------- SEED STORIES + SCENES ----------

async function seedStoriesAndScenes() {
  const users = await User.find({}, { _id: 1 }).lean();
  if (!users.length) {
    throw new Error("No users found; at least one user is required.");
  }
  const userIds = users.map((u) => u._id);

  await Story.deleteMany({});
  await Scene.deleteMany({});
  console.log("🧹 Cleared Story and Scene collections");

  // get Cloudinary covers, fallback to template URLs
  const cloudCovers = await fetchCloudinaryImageUrls(STORY_TEMPLATES.length);

  const storyDocs = [];
  const sceneDocs = [];

  let idx = 0;
  for (const tmpl of STORY_TEMPLATES) {
    const storyId = new mongoose.Types.ObjectId();
    const rootSceneId = new mongoose.Types.ObjectId();
    const authorId = userIds[randInt(0, userIds.length - 1)];

    // Likes & ratings
    const likes = pickSome(userIds, 5);
    const ratingsUsers = pickSome(userIds, 3);
    const ratings = ratingsUsers.map((uid) => ({
      user: uid,
      value: randInt(3, 5),
    }));

    const coverImageUrl = cloudCovers[idx] || tmpl.coverImageUrl || "";

    const story = {
      _id: storyId,
      title: tmpl.title,
      author: authorId,
      genre: tmpl.genre,
      firstScene: rootSceneId,
      coverImageUrl,
      status: "published",
      text: tmpl.storyText,
      likes,
      ratings,
      commentsCount: randInt(0, 10),
      views: randInt(50, 1500),
    };

    storyDocs.push(story);

    // Create follow-up scenes for each choice
    const choiceScenes = [];
    const choiceEntries = [];

    for (const choice of tmpl.choices) {
      const nextSceneId = new mongoose.Types.ObjectId();

      choiceEntries.push({
        text: choice.text,
        nextScene: nextSceneId,
      });

      choiceScenes.push({
        _id: nextSceneId,
        storyId,
        parentId: rootSceneId,
        author: authorId,
        content: choice.followContent,
        choices: [],
        hasEnded: true,
      });
    }

    // Root scene: _id === firstScene
    sceneDocs.push({
      _id: rootSceneId,
      storyId,
      parentId: null,
      author: authorId,
      content: tmpl.rootSceneContent,
      choices: choiceEntries, // 2–3 contextual choices
      hasEnded: false,
    });

    // Follow-up scenes for each choice
    sceneDocs.push(...choiceScenes);

    idx++;
  }

  const insertedStories = await Story.insertMany(storyDocs);
  const insertedScenes = await Scene.insertMany(sceneDocs);

  console.log(`✅ Seeded stories: ${insertedStories.length}`);
  console.log(`✅ Seeded scenes: ${insertedScenes.length}`);
  console.log(
    "🔎 First story preview:",
    insertedStories[0]
      ? {
          title: insertedStories[0].title,
          firstScene: insertedStories[0].firstScene,
          coverImageUrl: insertedStories[0].coverImageUrl,
          views: insertedStories[0].views,
          likes: insertedStories[0].likes.length,
          ratings: insertedStories[0].ratings.length,
        }
      : "none"
  );
}

// ---------- MAIN ----------

async function run() {
  try {
    await connect();
    await ensureDemoUser();
    // optional: await seedPrompts(); if you want prompts as well
    await seedStoriesAndScenes();
    console.log("🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();