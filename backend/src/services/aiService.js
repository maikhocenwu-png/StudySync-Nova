const { GoogleGenAI } = require('@google/genai');

// ---------- Mock generator (no network, always works) ----------
function mockGenerateQuestions(topicTitle, count = 5) {
  const correctPositions = [0, 1, 2, 3, 1]; // vary the answer position so tests aren't trivial
  const questions = [];
  for (let i = 0; i < count; i++) {
    const correctIndex = correctPositions[i % correctPositions.length];
    const choices = [
      `Wrong option A about ${topicTitle}`,
      `Wrong option B about ${topicTitle}`,
      `Wrong option C about ${topicTitle}`,
      `Wrong option D about ${topicTitle}`
    ];
    choices[correctIndex] = `Correct answer about ${topicTitle}`;
    questions.push({
      question: `[Mock] Practice question ${i + 1} on ${topicTitle}`,
      choices,
      correctIndex
    });
  }
  return questions;
}

// ---------- Helpers for handling LLM output ----------
function safeParseJSON(text) {
  const cleaned = String(text).replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// Gemini output is untrusted input: check the shape before using it
function isValidQuestionSet(data) {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      q =>
        typeof q.question === 'string' &&
        Array.isArray(q.choices) &&
        q.choices.length === 4 &&
        Number.isInteger(q.correctIndex) &&
        q.correctIndex >= 0 &&
        q.correctIndex <= 3
    )
  );
}

// ---------- Main function the rest of the app calls ----------
async function generateQuestions({ topicTitle, notesText, difficulty = 'beginner', count = 5 }) {
  if (!process.env.GEMINI_API_KEY) {
    return { questions: mockGenerateQuestions(topicTitle, count), source: 'mock' };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const notes = notesText ? notesText.slice(0, 6000) : '';

    const prompt = `Write ${count} multiple-choice questions about "${topicTitle}" for a college student at ${difficulty} level.
${notes ? `Base them on these study notes:\n${notes}\n` : ''}
Return ONLY a JSON array, no markdown and no commentary, in exactly this shape:
[{"question":"...","choices":["...","...","...","..."],"correctIndex":0}]
Rules: exactly 4 choices per question; correctIndex is the 0-based index of the correct choice.`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = safeParseJSON(response.text);
    if (!isValidQuestionSet(parsed)) {
      throw new Error('Gemini returned an unexpected format');
    }
    return { questions: parsed, source: 'gemini' };
  } catch (err) {
    console.error('Gemini failed, using mock questions:', err.message);
    return { questions: mockGenerateQuestions(topicTitle, count), source: 'mock' };
  }
}

module.exports = { generateQuestions, mockGenerateQuestions, safeParseJSON, isValidQuestionSet };