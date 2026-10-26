import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useStartQuiz } from '../useStartQuiz';

const STATUS_CLASS = {
  strong: 'badge-green',
  improving: 'badge-yellow',
  'needs practice': 'badge-red'
};

export default function Dashboard() {
  const { request, user } = useAuth();
  const { startQuiz, starting, error: startError } = useStartQuiz();
  const [progress, setProgress] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([request('/api/progress'), request('/api/courses')])
      .then(([p, c]) => {
        if (!cancelled) { setProgress(p); setCourses(c); }
      })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [request]);

  if (error) return <p className="error">{error}</p>;
  if (!progress) return <p>Loading…</p>;

  const { topics, recommendation, message } = progress;

  return (
    <>
      <h1>Hi, {user?.name}</h1>

      <section className="card highlight">
        <h2>Study next</h2>
        {recommendation ? (
          <>
            <p><strong>{recommendation.topic}</strong> — {recommendation.reason}</p>
            <button className="btn" disabled={starting} onClick={() => startQuiz(recommendation.topic_id)}>
              {starting ? 'Generating quiz…' : 'Practice this topic'}
            </button>
          </>
        ) : (
          <p>{message || 'Pick a course below to take your first quiz.'}</p>
        )}
        {startError && <p className="error">{startError}</p>}
      </section>

      {topics.length > 0 && (
        <section className="card">
          <h2>Your progress</h2>
          <table>
            <thead>
              <tr><th>Topic</th><th>Course</th><th>Attempts</th><th>Average</th><th>Level</th><th>Status</th></tr>
            </thead>
            <tbody>
              {topics.map((t) => (
                <tr key={t.topic_id}>
                  <td>{t.topic}</td>
                  <td>{t.course}</td>
                  <td>{t.attempts}</td>
                  <td>{t.average_score}%</td>
                  <td>{t.current_difficulty}</td>
                  <td><span className={`badge ${STATUS_CLASS[t.status]}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section>
        <h2>Courses</h2>
        <div className="grid">
          {courses.map((c) => (
            <Link key={c.id} to={`/courses/${c.id}`} className="card course-card">
              <span className="muted">{c.code}</span>
              <strong>{c.name}</strong>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}