const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const { generateQuestion } = require("../openaiService").default;

// Generate and Save Question
router.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;
    const questionText = await generateQuestion(topic);
    const [question, ...options] = questionText
      .split("\n")
      .filter((line) => line);
    const correctAnswer = options[options.length - 1]; // Assume last line is the answer

    const questionObj = new Question({
      topic,
      question,
      options,
      correctAnswer,
    });
    await questionObj.save();

    res.json(questionObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Questions
router.get("/", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

module.exports = router;
