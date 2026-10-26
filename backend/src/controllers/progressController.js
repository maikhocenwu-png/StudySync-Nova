const { Op } = require('sequelize');
const { Quiz, Topic, Course } = require('../models');
const { topicStatus } = require('../services/adaptiveService');

// GET /api/progress
async function getProgress(req, res) {
  try {
    const quizzes = await Quiz.findAll({
      where: { user_id: req.user.id, completed_at: { [Op.ne]: null } },
      include: [{ model: Topic, include: [Course] }],
      order: [['completed_at', 'ASC']]
    });

    // Group the scores by topic (one pass over the quizzes)
    const byTopic = new Map();
    for (const q of quizzes) {
      if (!byTopic.has(q.topic_id)) {
        byTopic.set(q.topic_id, {
          topic_id: q.topic_id,
          topic: q.Topic.title,
          course: q.Topic.Course.code,
          scores: [],
          current_difficulty: q.difficulty
        });
      }
      const entry = byTopic.get(q.topic_id);
      entry.scores.push(q.score);
      entry.current_difficulty = q.difficulty;
    }

    const topics = [...byTopic.values()]
      .map(t => {
        const avg = t.scores.reduce((a, b) => a + b, 0) / t.scores.length;
        return {
          topic_id: t.topic_id,
          topic: t.topic,
          course: t.course,
          attempts: t.scores.length,
          average_score: Math.round(avg),
          latest_score: t.scores[t.scores.length - 1],
          current_difficulty: t.current_difficulty,
          status: topicStatus(avg)
        };
      })
      .sort((a, b) => a.average_score - b.average_score); // weakest first

    const weakest = topics.find(t => t.status !== 'strong');
    const recommendation = weakest
      ? {
          topic_id: weakest.topic_id,
          topic: weakest.topic,
          reason: `Average score of ${weakest.average_score}% over ${weakest.attempts} attempt(s)`
        }
      : null;

    res.json({
      topics,
      recommendation,
      message: topics.length === 0
        ? 'No completed quizzes yet'
        : recommendation ? undefined : 'All attempted topics look strong. Try a new topic.'
    });
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ error: 'Could not load progress' });
  }
}

module.exports = { getProgress };