require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/questionRoutes");
//const videoRoute = require("./routes/videoRoute");
const videoRoutes=require("./routes/videoRoutes");



const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/questions", questionRoutes);
// app.use("/api/video",videoRoute);
app.use("/api/video",videoRoutes)


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("AI Exam Preparation API"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} `));