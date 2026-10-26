require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'StudySync Nova API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/progress', require('./routes/progress'));

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Could not start server:', err);
    process.exit(1);
  });
