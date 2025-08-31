// netlify/functions/api.js
import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

// --- Mongoose models ---
const { Schema, model } = mongoose;

const OfferSchema = new Schema({
  employer: String,
  base: Number,
  bonus: Number,
  benefits: Number,
  fairness: Number,
  total: Number
}, { _id: false });

const ProfileSchema = new Schema({
  pid: String,
  name: String,
  role: String,
  skill: String,
  score: Number,
  masked: Boolean
}, { _id: false });

const JobSchema = new Schema({
  title: { type: String, required: true },
  budget: Number,
  type: { type: String, default: "Full-time" },
  location: String,
  approvals: {
    policy: { type: Boolean, default: false },
    internal: { type: Boolean, default: false }
  },
  profiles: [ProfileSchema],
  profilesUnlocked: { type: Boolean, default: false },
  interviews: { type: Number, default: 0 },
  offers: [OfferSchema],
  selectedOfferIndex: { type: Number, default: null }
}, { timestamps: true });

const Job = model("Job", JobSchema);

// --- Maintain a single MongoDB connection ---
let cached = { conn: null };
async function connectMongo() {
  if (cached.conn) return cached.conn;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set");
  cached.conn = mongoose.connect(uri);
  return cached.conn;
}

// --- Express app ---
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", async (_req, res) => {
  try {
    await connectMongo();
    res.json({ ok: true, ts: Date.now() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const skills = [
  "AI", "Cloud", "HR", "Data",
  "Security", "Ops", "Analytics", "Compliance",
  "DevOps", "QA"
];

function genProfiles(title) {
  const count = 7 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, (_, i) => ({
    pid: "P" + (1000 + i),
    name: "Candidate " + (i + 1),
    role: title || "Role",
    skill: skills[i % skills.length],
    score: 70 + Math.floor(Math.random() * 29),
    masked: true
  }));
}

function genOffers() {
  const fair = [0.92, 0.88, 0.95];
  const names = ["Alpha GmbH", "Beta AG", "Gamma LLC"];
  return Array.from({ length: 3 }, (_, i) => {
    const base = (58 + Math.floor(Math.random() * 21)) * 1000;
    const bonus = 5 + Math.floor(Math.random() * 11);
    const benefits = 2 + Math.floor(Math.random() * 4);
    const total = Math.round((base * (1 + bonus / 100) + benefits * 1200) * fair[i]);
    return { employer: names[i], base, bonus, benefits, fairness: fair[i], total };
  });
}

// --- API routes ---
app.post("/api/jobs", async (req, res) => {
  try {
    await connectMongo();
    const { title, budget, type, location } = req.body;
    if (!title) return res.status(400).json({ error: "Missing title" });
    const job = await Job.create({ title, budget, type, location });
    res.json({ id: job._id, message: "Job created" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/jobs/:id/approvals", async (req, res) => {
  try {
    await connectMongo();
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    const { policy, internal } = req.body;
    if (typeof policy === "boolean") job.approvals.policy = policy;
    if (typeof internal === "boolean") job.approvals.internal = internal;
    await job.save();
    res.json({ ok: true, approvals: job.approvals });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/jobs/:id/profiles", async (req, res) => {
  try {
    await connectMongo();
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (!job.approvals.policy) return res.status(400).json({ error: "Policy approval required" });
    if (!job.profiles?.length) {
      job.profiles = genProfiles(job.title);
      await job.save();
    }
    const view = job.profiles.map(p => ({
      ...p.toObject(),
      name: job.profilesUnlocked ? p.name : "Masked",
      masked: !job.profilesUnlocked
    }));
    res.json({ profiles: view, unlocked: job.profilesUnlocked });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/jobs/:id/unlock", async (req, res) => {
  try {
    await connectMongo();
    const { payment2, reviewer } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (payment2 !== true || reviewer !== "REVIEW-123") {
      return res.status(400).json({ error: "Unlock requires payment2=true and reviewer code" });
    }
    job.profilesUnlocked = true;
    await job.save();
    res.json({ ok: true, unlocked: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/jobs/:id/interviews", async (req, res) => {
  try {
    await connectMongo();
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (!job.profiles?.length) return res.status(400).json({ error: "Fetch profiles first" });
    const count = Number(req.body.count || 0);
    job.interviews = Math.max(0, Math.min(count, job.profiles.length));
    await job.save();
    res.json({ ok: true, interviews: job.interviews });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/jobs/:id/offers", async (req, res) => {
  try {
    await connectMongo();
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (!job.profiles?.length) return res.status(400).json({ error: "Fetch profiles first" });
    if (!job.offers?.length) {
      job.offers = genOffers();
      await job.save();
    }
    res.json({ offers: job.offers });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/jobs/:id/select", async (req, res) => {
  try {
    await connectMongo();
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (!job.offers?.length) return res.status(400).json({ error: "Generate offers first" });
    const i = Number(req.body.index);
    if (isNaN(i) || i < 0 || i >= job.offers.length) {
      return res.status(400).json({ error: "Invalid index" });
    }
    job.selectedOfferIndex = i;
    await job.save();
    res.json({ ok: true, selected: job.offers[i] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/jobs/:id/onboarding/start", async (req, res) => {
  try {
    await connectMongo();
    res.json({
      ok: true,
      tasks: ["Joining", "Induction", "KPIs", "Mentor", "Training", "Well-Being"].map(name => ({
        name,
        status: "DONE"
      }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export const handler = serverless(app);
