const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const connectDB = require('./config/connectDB');
const roadmapRoutes = require('./routes/roadmapRoutes');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/events', eventRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post("/saveQuiz", async (req, res) => {
    console.log("inside api call");
  
    try {
      console.log("insidde try");
      console.log("Received request body:", req.body); // Debugging
  
      const { email, score, topic, questionsAnswered } = req.body;
  
      if (!email || score === undefined || !questionsAnswered || !topic) {
        console.error("Missing fields:", { email, score, topic, questionsAnswered });
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      const user = await Users.findOne({ email });
  
      if (!user) {
        console.error("User not found:", email);
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      if (!user.quizResults) user.quizResults = []; // Ensure quizResults exists
      user.quizResults.push({ score, topic, questionsAnswered });
  
      await user.save();
  
      return res.json({ success: true, message: "Quiz results saved successfully" });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });


