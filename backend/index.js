require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('./models/User');
const ActivityLog = require('./models/ActivityLog');
const Routine = require('./models/Routine');
const Meal = require('./models/Meal');
const WeightLog = require('./models/WeightLog');
const Post = require('./models/Post');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitsync';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seeder Helpers
const seedActivityLogs = async (userId) => {
  const defaultLogs = [
    { dayName: 'MON', dayNum: 12, steps: 6200, km: 4.2, activeMin: 30, recovery: 65, sleep: '6.5', bpm: 68, water: 5, sets: 12, reps: 110, chest: 70, triceps: 60, shoulders: 50, workout: 'Pull Day', calories: 420, runMiles: 3.1 },
    { dayName: 'TUE', dayNum: 13, steps: 8100, km: 5.8, activeMin: 38, recovery: 70, sleep: '6.8', bpm: 64, water: 6, sets: 14, reps: 140, chest: 75, triceps: 65, shoulders: 55, workout: 'Leg Day', calories: 590, runMiles: 8.4 },
    { dayName: 'WED', dayNum: 14, steps: 12482, km: 8.2, activeMin: 54, recovery: 88, sleep: '7.3', bpm: 58, water: 7, sets: 18, reps: 182, chest: 92, triceps: 78, shoulders: 64, workout: 'Push Day', calories: 712, runMiles: 0.0 },
    { dayName: 'THU', dayNum: 15, steps: 9500, km: 6.8, activeMin: 40, recovery: 78, sleep: '7.0', bpm: 62, water: 6, sets: 15, reps: 150, chest: 80, triceps: 70, shoulders: 60, workout: 'Pull Day', calories: 680, runMiles: 6.9 },
    { dayName: 'FRI', dayNum: 16, steps: 10800, km: 7.4, activeMin: 49, recovery: 80, sleep: '7.2', bpm: 60, water: 7, sets: 16, reps: 160, chest: 85, triceps: 75, shoulders: 62, workout: 'Push Day', calories: 650, runMiles: 6.2 },
    { dayName: 'SAT', dayNum: 17, steps: 4200, km: 3.0, activeMin: 20, recovery: 85, sleep: '8.5', bpm: 55, water: 8, sets: 0, reps: 0, chest: 0, triceps: 0, shoulders: 0, workout: 'Rest Day', calories: 240, runMiles: 0.0 },
    { dayName: 'SUN', dayNum: 18, steps: 11200, km: 8.0, activeMin: 55, recovery: 82, sleep: '7.8', bpm: 59, water: 6, sets: 10, reps: 90, chest: 60, triceps: 50, shoulders: 45, workout: 'Cardio Day', calories: 390, runMiles: 0.0 }
  ];
  await ActivityLog.insertMany(defaultLogs.map(log => ({ ...log, userId })));
};

const seedRoutines = async (userId) => {
  const defaultRoutines = [
    { name: 'Bench Press', routine: 'Chest & Triceps', repinfo: '4 Sets x 8 Reps', exercises: [{ name: 'Bench Press', reps: '4 Sets x 8 Reps', note: 'Focus on bar control' }] },
    { name: 'Incline Dumbbell Flys', routine: 'Chest Focus', repinfo: '3 Sets x 12 Reps', exercises: [{ name: 'Incline Dumbbell Flys', reps: '3 Sets x 12 Reps', note: 'Stretch at bottom' }] },
    { name: 'Dips (Weighted)', routine: 'Triceps & Lower Chest', repinfo: '3 Sets x 8 Reps', exercises: [{ name: 'Dips', reps: '3 Sets x 8 Reps', note: 'Keep torso slightly leaned forward' }] }
  ];
  await Routine.insertMany(defaultRoutines.map(r => ({ ...r, userId })));
};

const seedMeals = async (userId) => {
  const defaultMeals = [
    {
      name: "Avocado Toast with Egg",
      calories: 380,
      protein: 16,
      carbs: 42,
      fats: 18,
      type: "Breakfast",
      time: "08:15 AM",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCV7IXAaqBntuTh8n7T6_8zYT_lyrU9CJR0qksXGrpxzmanxR-ftEcKBdgBYWhgomr8ygc0XK39Kj92CSTVap9WBNynJi2_Bmyk-L0n0nk1wPj7Lkg-G5ZceQ9jocykOIl2nqmB6wX0ErPs9zvZgbMQrXyiTZsOLrCDkV9cLiedjkp3AiGS7gdu5V4bPz-vqCxWqqler075pyCTnrgGmZi-WnjuAK19L4WQdOKEgvGo97GplawSu5Qq8XA8BUezD2DzC3CEOgFbzOf-"
    },
    {
      name: "Grilled Chicken Salad",
      calories: 520,
      protein: 42,
      carbs: 22,
      fats: 28,
      type: "Lunch",
      time: "01:30 PM",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCV7IXAaqBntuTh8n7T6_8zYT_lyrU9CJR0qksXGrpxzmanxR-ftEcKBdgBYWhgomr8ygc0XK39Kj92CSTVap9WBNynJi2_Bmyk-L0n0nk1wPj7Lkg-G5ZceQ9jocykOIl2nqmB6wX0ErPs9zvZgbMQrXyiTZsOLrCDkV9cLiedjkp3AiGS7gdu5V4bPz-vqCxWqqler075pyCTnrgGmZi-WnjuAK19L4WQdOKEgvGo97GplawSu5Qq8XA8BUezD2DzC3CEOgFbzOf-"
    }
  ];
  await Meal.insertMany(defaultMeals.map(m => ({ ...m, userId })));
};

const seedWeightLogs = async (userId) => {
  const defaultWeightLogs = [
    { date: "May 15", weight: 69.8 },
    { date: "May 18", weight: 69.2 },
    { date: "May 21", weight: 68.9 },
    { date: "May 24", weight: 68.5 },
    { date: "May 27", weight: 68.2 },
    { date: "May 29", weight: 68.0 }
  ];
  await WeightLog.insertMany(defaultWeightLogs.map(w => ({ ...w, userId })));
};

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Auth - Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all registration details.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email address is already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Seed mock data for the user
    await seedActivityLogs(user._id);
    await seedRoutines(user._id);
    await seedMeals(user._id);
    await seedWeightLogs(user._id);

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        height: user.height,
        weight: user.weight,
        targetBmi: user.targetBmi,
        fitnessGoal: user.fitnessGoal,
        avatar: user.avatar,
        goals: user.goals
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed. Server error.' });
  }
});

// Auth - Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    // Fallback for legacy plain text passwords during dev, otherwise compare hash
    let isMatch = false;
    if (user.password.length === 60 || user.password.startsWith('$2')) {
       isMatch = await bcrypt.compare(password, user.password);
    } else {
       isMatch = password === user.password;
    }
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        height: user.height,
        weight: user.weight,
        targetBmi: user.targetBmi,
        fitnessGoal: user.fitnessGoal,
        avatar: user.avatar,
        goals: user.goals
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed. Server error.' });
  }
});

// Profile Updates
app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { name, level, height, weight, targetBmi, avatar, goals } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name !== undefined) user.name = name;
    if (level !== undefined) user.level = level;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (targetBmi !== undefined) user.targetBmi = targetBmi;
    if (avatar !== undefined) user.avatar = avatar;
    if (goals !== undefined) user.goals = { ...user.goals, ...goals };

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Profile update failed.' });
  }
});

// Fetch Activity Logs
app.get('/api/logs/:userId', async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.params.userId }).sort({ dayNum: 1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch logs.' });
  }
});

// Update Activity Log
app.put('/api/logs/:userId/:dayNum', async (req, res) => {
  try {
    const { steps, water, sets, reps, workout, runMiles, km, activeMin, bpm } = req.body;
    const log = await ActivityLog.findOne({ userId: req.params.userId, dayNum: parseInt(req.params.dayNum) });
    if (!log) return res.status(404).json({ error: 'Log not found' });

    if (steps !== undefined) log.steps = steps;
    if (water !== undefined) log.water = water;
    if (sets !== undefined) log.sets = sets;
    if (reps !== undefined) log.reps = reps;
    if (workout !== undefined) log.workout = workout;
    if (runMiles !== undefined) log.runMiles = runMiles;
    if (km !== undefined) log.km = km;
    if (activeMin !== undefined) log.activeMin = activeMin;
    if (bpm !== undefined) log.bpm = bpm;

    await log.save();
    res.status(200).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update activity log.' });
  }
});

// Fetch Routines
app.get('/api/routines/:userId', async (req, res) => {
  try {
    const routines = await Routine.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(routines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch routines.' });
  }
});

// Create Routine
app.post('/api/routines/:userId', async (req, res) => {
  try {
    const { name, routine, repinfo, exercises } = req.body;
    const newRoutine = new Routine({
      userId: req.params.userId,
      name,
      routine,
      repinfo,
      exercises
    });
    await newRoutine.save();
    res.status(201).json(newRoutine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create routine.' });
  }
});

// Fetch Meals
app.get('/api/meals/:userId', async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch meals.' });
  }
});

// Log Meal
app.post('/api/meals/:userId', async (req, res) => {
  try {
    const { name, calories, protein, carbs, fats, type, time, img } = req.body;
    const newMeal = new Meal({
      userId: req.params.userId,
      name,
      calories,
      protein,
      carbs,
      fats,
      type,
      time,
      img
    });
    await newMeal.save();
    res.status(201).json(newMeal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log meal.' });
  }
});

// Fetch Weight Logs
app.get('/api/weight/:userId', async (req, res) => {
  try {
    const logs = await WeightLog.find({ userId: req.params.userId }).sort({ createdAt: 1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weight logs.' });
  }
});

// Log Weight
app.post('/api/weight/:userId', async (req, res) => {
  try {
    const { weight, date } = req.body;
    const newLog = new WeightLog({
      userId: req.params.userId,
      weight,
      date
    });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log weight.' });
  }
});

// Fetch Community Posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch community posts.' });
  }
});

// Create Post
app.post('/api/posts', async (req, res) => {
  try {
    const { userId, author, avatar, tag, content, image } = req.body;
    const newPost = new Post({
      userId,
      author,
      avatar,
      tag,
      content,
      image
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

// Toggle Post Reaction
app.post('/api/posts/:postId/react', async (req, res) => {
  try {
    const { userId, reactionType } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const reactedIdx = post.reactedUsers[reactionType].indexOf(userId);
    if (reactedIdx > -1) {
      // User already reacted, pull the reaction
      post.reactedUsers[reactionType].splice(reactedIdx, 1);
      post.reactions[reactionType] = Math.max(0, post.reactions[reactionType] - 1);
    } else {
      // Add reaction
      post.reactedUsers[reactionType].push(userId);
      post.reactions[reactionType] += 1;
    }

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update reaction.' });
  }
});

// Add Post Comment
app.post('/api/posts/:postId/comment', async (req, res) => {
  try {
    const { author, text } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({ author, text, time: 'Just now' });
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post comment.' });
  }
});

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-user', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on('new-post', (data) => {
    socket.broadcast.emit('feed-update', data);
    console.log('Broadcasting new post from:', data.author);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health Checks
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'active', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`FitSync Backend running on port ${PORT}`);
});
