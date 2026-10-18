const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const securityRoutes = require('./routes/securityRoutes');
const lectureRoutes = require('./routes/lectureRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const vmsRoutes = require('./routes/vmsRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadPath = require('path').join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadPath));

// Root Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to GLVMS API." });
});

// Routes - supported both with /api and without /api prefixes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/visitors', visitorRoutes);
app.use('/visitors', visitorRoutes);

app.use('/api/security', securityRoutes);
app.use('/security', securityRoutes);

app.use('/api/lectures', lectureRoutes);
app.use('/lectures', lectureRoutes);

app.use('/api/checklist', checklistRoutes);
app.use('/checklist', checklistRoutes);

app.use('/api/expenses', expenseRoutes);
app.use('/expenses', expenseRoutes);

app.use('/api/feedback', feedbackRoutes);
app.use('/feedback', feedbackRoutes);

app.use('/api', vmsRoutes);
app.use('/', vmsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message || "Something went wrong!" });
});

module.exports = app;
