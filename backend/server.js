const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://tamim:h7EKzliq7Cak7OoI@cluster0.oapgbwv.mongodb.net/ProfileMaker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define a schema for the user data
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

// Handle POST requests to /api/signup
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(200).json({ message: 'Account created successfully!' });
  } catch (error) {
    console.error('Error saving to database:', error);
    res.status(500).json({ message: 'Failed to create account.' });
  }
});

// Handle POST requests to /api/login
app.post('/api/login', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ message: 'Login successful!' });
    } else {
      res.status(400).json({ message: 'User not found. Please sign up.' });
    }
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ message: 'Failed to log in.' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
