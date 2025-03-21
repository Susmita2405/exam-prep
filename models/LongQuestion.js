const mongoose = require("mongoose");

const LongQuestionSchema = new mongoose.Schema({
    topic: String,
    question: String,
    modelAnswer: String,
});

module.exports = mongoose.model("LongQuestion", LongQuestionSchema);