const mongoose = require("mongoose");

const ShortQuestionSchema = new mongoose.Schema({
    topic: String,
    question: String,
    correctAnswer: String,
});

module.exports = mongoose.model("ShortQuestion", ShortQuestionSchema);