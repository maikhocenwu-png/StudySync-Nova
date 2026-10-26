import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useStartQuiz } from '../useStartQuiz';

// Wrapper: a new location.key remounts the session, so a fresh quiz starts with clean state
export default function Quiz() {
  const { state, key } = useLocation();
  if (!state?.quizData) return <Navigate to="/" replace />;
  return <QuizSession key={key} quizData={state.quizData} />;
}

function QuizSession({ quizData }) {
  const { request } = useAuth();
  const { startQuiz, starting, error: startError } = useStartQuiz();
  const { quiz, questions, source } = quizData;

  const [answers, setAnswers] = useState({});   // { questionId: chosenIndex }
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = Object.keys(answers).length === questions.length;

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const payload = questions.map((q) => ({ question_id: q.id, answer_index: answers[q.id] }));
      setResult(await request(`/api/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        body: { answers: payload }
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <>
        <h1>{quiz.topic}: {result.score}%</h1>
        <p className="muted">{result.correct} of {result.total} correct</p>

        <div className="stack">
          {result.review.map((r, n) => (
            <div key={r.question_id} className="card">
              <p><strong>{n + 1}. {r.prompt}</strong></p>
              {r.choices.map((c, i) => {
                let cls = 'choice';
                if (i === r.correct_answer) cls += ' correct';
                else if (i === r.your_answer) cls += ' wrong';
                return <div key={i} className={cls}>{c}</div>;
              })}
            </div>
          ))}
        </div>

        {startError && <p className="error">{startError}</p>}
        <div className="row-gap">
          <button className="btn" disabled={starting} onClick={() => startQuiz(quiz.topic_id)}>
            {starting ? 'Generating…' : 'Try another quiz on this topic'}
          </button>
          <Link to="/" className="btn btn-outline">Back to dashboard</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>{quiz.topic}</h1>
      <p className="muted">
        Difficulty: {quiz.difficulty}
        {source === 'mock' && <span className="badge badge-yellow">sample questions</span>}
      </p>

      <div className="stack">
        {questions.map((q, n) => (
          <div key={q.id} className="card">
            <p><strong>{n + 1}. {q.prompt}</strong></p>
            {q.choices.map((c, i) => (
              <label key={i} className={`choice selectable ${answers[q.id] === i ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === i}
                  onChange={() => setAnswers({ ...answers, [q.id]: i })}
                />
                {c}
              </label>
            ))}
          </div>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={!allAnswered || submitting} onClick={handleSubmit}>
        {submitting ? 'Scoring…' : allAnswered ? 'Submit answers' : `Answer all questions (${Object.keys(answers).length}/${questions.length})`}
      </button>
    </>
  );
}