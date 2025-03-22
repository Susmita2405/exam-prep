// const express = require("express");
// const router = express.Router();
// const Question = require("../models/Question");
// const { generateQuestion } = require("../openaiService").default;

// // Generate and Save Question
// router.post("/generate", async (req, res) => {
//   try {
//     const { topic } = req.body;
//     const questionText = await generateQuestion(topic);
//     const [question, ...options] = questionText
//       .split("\n")
//       .filter((line) => line);
//     const correctAnswer = options[options.length - 1]; // Assume last line is the answer

//     const questionObj = new Question({
//       topic,
//       question,
//       options,
//       correctAnswer,
//     });
//     await questionObj.save();

//     res.json(questionObj);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get All Questions
// router.get("/", async (req, res) => {
//   const questions = await Question.find();
//   res.json(questions);
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const ShortQuestion = require("../models/ShortQuestion");
const LongQuestion = require("../models/LongQuestion");
const openaiService = require("../openaiService").default;

// Generate and Save Single MCQ Question
router.post("/generate-mcq", async (req, res) => {
  try {
    const { topic, classLevel } = req.body;
    const questionText = await openaiService.generateMCQQuestion(topic, classLevel);
    const lines = questionText.split("\n").filter(line => line.trim());
    
    // Extract question and options
    const question = lines[0].replace(/^(Question:|Q:|)\s*/, '').trim();
    const options = lines.slice(1, 5).map(line => line.replace(/^[A-D]\.\s*/, '').trim());
    
    // Extract correct answer
    const correctAnswerLine = lines.find(line => line.toLowerCase().includes("correct answer")) || "";
    const correctAnswer = correctAnswerLine.replace(/^.*:\s*/, '').trim();

    const questionObj = new Question({
      topic,
      classLevel,
      question,
      options,
      correctAnswer,
    });
    await questionObj.save();

    res.json(questionObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generate Multiple MCQ Questions (10 by default)
router.post("/generate-multiple-mcqs", async (req, res) => {
  try {
    const { topic, count = 10 } = req.body;
    const questionsText = await openaiService.generateMultipleMCQs(topic, count);
    
    // Split the returned text into individual questions
    const questionBlocks = questionsText.split(/\n\s*\n/).filter(block => block.trim());
    const savedQuestions = [];

    for (const block of questionBlocks) {
      const lines = block.split("\n").filter(line => line.trim());
      
      if (lines.length < 5) continue; // Skip incomplete questions
      
      // Extract question
      const questionLine = lines[0];
      const question = questionLine.replace(/^(Question:|Q:|)\s*/, '').trim();
      
      // Extract options
      const options = lines.slice(1, 5).map(line => line.replace(/^[A-D]\.\s*/, '').trim());
      
      // Extract correct answer
      const correctAnswerLine = lines.find(line => line.toLowerCase().includes("correct answer")) || "";
      const correctAnswer = correctAnswerLine.replace(/^.*:\s*/, '').trim();

      const questionObj = new Question({
        topic,
        question,
        options,
        correctAnswer,
      });
      await questionObj.save();
      savedQuestions.push(questionObj);
    }

    res.json({
      count: savedQuestions.length,
      questions: savedQuestions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generate and Save Short Question
router.post("/generate-short", async (req, res) => {
  try {
    const { topic } = req.body;
    const questionText = await openaiService.generateShortQuestion(topic);
    const lines = questionText.split("\n").filter(line => line.trim());
    
    // Extract question and answer
    const question = lines[0].replace(/^(Question:|Q:|)\s*/, '').trim();
    const answer = lines.slice(1).join("\n").replace(/^(Answer:|A:|)\s*/, '').trim();

    const questionObj = new ShortQuestion({
      topic,
      question,
      correctAnswer: answer,
    });
    await questionObj.save();

    res.json(questionObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generate Multiple Short Questions (10 by default)
router.post("/generate-multiple-short", async (req, res) => {
  try {
    const { topic, count = 10 } = req.body;
    const questionsText = await openaiService.generateMultipleShortQuestions(topic, count);
    
    // Split the returned text into individual questions
    const questionBlocks = questionsText.split(/\n\s*\n/).filter(block => block.trim());
    const savedQuestions = [];

    for (const block of questionBlocks) {
      const lines = block.split("\n").filter(line => line.trim());
      
      if (lines.length < 2) continue; // Skip incomplete questions
      
      // Extract question
      const questionLine = lines[0];
      const question = questionLine.replace(/^(Question:|Q:|)\s*/, '').trim();
      
      // Extract answer
      const answerLine = lines.slice(1).join("\n");
      const answer = answerLine.replace(/^(Answer:|A:|)\s*/, '').trim();

      const questionObj = new ShortQuestion({
        topic,
        question,
        correctAnswer: answer,
      });
      await questionObj.save();
      savedQuestions.push(questionObj);
    }

    res.json({
      count: savedQuestions.length,
      questions: savedQuestions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generate and Save Long Question
router.post("/generate-long", async (req, res) => {
  try {
    const { topic } = req.body;
    const questionText = await openaiService.generateLongQuestion(topic);
    const lines = questionText.split("\n").filter(line => line.trim());
    
    // Extract question and model answer
    const question = lines[0].replace(/^(Question:|Q:|)\s*/, '').trim();
    const modelAnswer = lines.slice(1).join("\n").replace(/^(Model Answer:|Answer:|A:|)\s*/, '').trim();

    const questionObj = new LongQuestion({
      topic,
      question,
      modelAnswer,
    });
    await questionObj.save();

    res.json(questionObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generate Multiple Long Questions (10 by default)
router.post("/generate-multiple-long", async (req, res) => {
  try {
    const { topic, count = 10 } = req.body;
    const questionsText = await openaiService.generateMultipleLongQuestions(topic, count);
    
    // Split the returned text into individual questions
    const questionBlocks = questionsText.split(/\n\s*\n/).filter(block => block.trim());
    const savedQuestions = [];

    for (const block of questionBlocks) {
      const lines = block.split("\n").filter(line => line.trim());
      
      if (lines.length < 2) continue; // Skip incomplete questions
      
      // Extract question
      const questionLine = lines[0];
      const question = questionLine.replace(/^(Question:|Q:|)\s*/, '').trim();
      
      // Extract model answer
      const modelAnswerLines = lines.slice(1).join("\n");
      const modelAnswer = modelAnswerLines.replace(/^(Model Answer:|Answer:|A:|)\s*/, '').trim();

      const questionObj = new LongQuestion({
        topic,
        question,
        modelAnswer,
      });
      await questionObj.save();
      savedQuestions.push(questionObj);
    }

    res.json({
      count: savedQuestions.length,
      questions: savedQuestions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get All MCQ Questions
router.get("/mcq", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Short Questions
router.get("/short", async (req, res) => {
  try {
    const questions = await ShortQuestion.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Long Questions
router.get("/long", async (req, res) => {
  try {
    const questions = await LongQuestion.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete MCQ Question
router.delete("/mcq/:id", async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Short Question
router.delete("/short/:id", async (req, res) => {
  try {
    const deletedQuestion = await ShortQuestion.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Long Question
router.delete("/long/:id", async (req, res) => {
  try {
    const deletedQuestion = await LongQuestion.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;