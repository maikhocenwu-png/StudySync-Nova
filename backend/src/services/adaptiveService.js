const LEVELS = ['beginner', 'intermediate', 'advanced'];
const STEP_UP_AT = 80;   // score >= 80 -> move up a level
const STEP_DOWN_AT = 40; // score < 40  -> move down a level

function nextDifficulty(current, score) {
  const i = LEVELS.indexOf(current);
  if (i === -1) return 'beginner';
  if (typeof score !== 'number') return current;
  if (score >= STEP_UP_AT) return LEVELS[Math.min(i + 1, LEVELS.length - 1)];
  if (score < STEP_DOWN_AT) return LEVELS[Math.max(i - 1, 0)];
  return current;
}

function topicStatus(averageScore) {
  if (averageScore >= 80) return 'strong';
  if (averageScore >= 60) return 'improving';
  return 'needs practice';
}

module.exports = { nextDifficulty, topicStatus, LEVELS, STEP_UP_AT, STEP_DOWN_AT };