const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    topic: String,
    question: String,
    options: [String],
    correctAnswer: String,
});

module.exports = mongoose.model("Question", QuestionSchema);