


  const mongoose = require("mongoose");
  
  const YTSchema = new mongoose.Schema({
      topic: String,
      videoUrl: String,
      videoId: String,
      title: String,
      description: String
  });
  
  module.exports = mongoose.model("YT", YTSchema);

