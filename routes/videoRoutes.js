require("dotenv").config();
const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const YT = require("../models/YT");

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YoutubeApi, // Get API key from Google Cloud Console
});

router.post("/soln", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res
        .status(400)
        .json({ error: "Topic is required in request body" });
    }

    const response = await youtube.search.list({
      part: "snippet",
      q: topic,
      type: "video",
      maxResults: 1,
    });

    const videos = response.data.items;

    if (!videos || videos.length === 0) {
      return res.status(404).json({ error: "No videos found" });
    }

    const videoId = videos[0].id.videoId;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const title = videos[0].snippet.title;
    const description = videos[0].snippet.description;
    const ytObj = new YT({
      topic,
      videoUrl,
      videoId,
      title,
      description,
    });
    await ytObj.save();
    res.json(ytObj);
  } catch (error) {
    console.error("YouTube API error:", error);
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

module.exports = router;
