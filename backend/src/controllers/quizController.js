const { Op } = require('sequelize');
const { nextDifficulty } = require('../services/adaptiveService');
const { User, Topic, Quiz, Question, StudyMaterial } = require('../models');
const { generateQuestions } = require('../services/aiService');

// POST /api/quizzes   body: { topic_id, difficulty? }
async function createQuiz(req, res) {
  try {
    const { topic_id } = req.body;
    if (!topic_id) return res.status(400).json({ error: 'topic_id is required' });

    const topic = await Topic.findByPk(topic_id);
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    const user = await User.findByPk(req.user.id);

    let difficulty = req.body.difficulty;
    if (!difficulty) {
    // Adapt to the student's most recent finished quiz on this topic
    const last = await Quiz.findOne({
        where: { user_id: user.id, topic_id: topic.id, completed_at: { [Op.ne]: null } },
        order: [['completed_at', 'DESC']]
    });
    difficulty = last ? nextDifficulty(last.difficulty, last.score) : user.difficulty_pref;
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty' });
    }

    // Use the student's most recent notes for this topic, if they uploaded any
    const material = await StudyMaterial.findOne({
      where: { user_id: user.id, topic_id: topic.id },
      order: [['created_at', 'DESC']]
    });

    const { questions, source } = await generateQuestions({
      topicTitle: topic.title,
      notesText: material ? material.content : '',
      difficulty
    });

    const quiz = await Quiz.create({ user_id: user.id, topic_id: topic.id, difficulty });
    const saved = await Question.bulkCreate(
      questions.map(q => ({
        quiz_id: quiz.id,
        prompt: q.question,
        choices: q.choices,
        correct_index: q.correctIndex
      }))
    );

    // Deliberately leave correct_index OUT of the response
    res.status(201).json({
      quiz: { id: quiz.id, topic_id: topic.id, topic: topic.title, difficulty },
      source,
      questions: saved.map(q => ({ id: q.id, prompt: q.prompt, choices: q.choices }))
    });
  } catch (err) {
    console.error('Create quiz error:', err);
    res.status(500).json({ error: 'Could not create quiz' });
  }
}

// POST /api/quizzes/:id/submit   body: { answers: [{ question_id, answer_index }] }
async function submitQuiz(req, res) {
  try {
    const quiz = await Quiz.findByPk(req.params.id, { include: [Question] });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    if (quiz.user_id !== req.user.id) return res.status(403).json({ error: 'Not your quiz' });
    if (quiz.completed_at) return res.status(409).json({ error: 'Quiz already submitted' });

    const { answers } = req.body;
    if (!Array.isArray(answers)) return res.status(400).json({ error: 'answers must be an array' });

    const answerByQuestion = new Map(answers.map(a => [Number(a.question_id), a.answer_index]));

    let correct = 0;
    const review = [];
    for (const q of quiz.Questions) {
      const given = answerByQuestion.has(q.id) ? answerByQuestion.get(q.id) : null;
      const isCorrect = given === q.correct_index;
      if (isCorrect) correct++;
      await q.update({ user_answer_index: given });
      review.push({
        question_id: q.id,
        prompt: q.prompt,
        choices: q.choices,
        your_answer: given,
        correct_answer: q.correct_index,
        correct: isCorrect
      });
    }

    const total = quiz.Questions.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    await quiz.update({ score, completed_at: new Date() });

    res.json({ quiz_id: quiz.id, score, correct, total, review });
  } catch (err) {
    console.error('Submit quiz error:', err);
    res.status(500).json({ error: 'Could not submit quiz' });
  }
}

module.exports = { createQuiz, submitQuiz };