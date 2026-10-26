import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useStartQuiz } from '../useStartQuiz';

export default function CourseTopics() {
  const { id } = useParams();
  const { request } = useAuth();
  const { startQuiz, starting, error: startError } = useStartQuiz();
  const [topics, setTopics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    request(`/api/courses/${id}/topics`)
      .then((data) => { if (!cancelled) setTopics(data); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [id, request]);

  if (error) return <p className="error">{error}</p>;
  if (!topics) return <p>Loading…</p>;

  return (
    <>
      <Link to="/">← Back to dashboard</Link>
      <h1>Choose a topic</h1>
      {startError && <p className="error">{startError}</p>}
      {topics.length === 0 && <p>No topics for this course yet.</p>}
      <div className="stack">
        {topics.map((t) => (
          <div key={t.id} className="card row">
            <strong>{t.title}</strong>
            <button className="btn" disabled={starting} onClick={() => startQuiz(t.id)}>
              {starting ? 'Generating…' : 'Start quiz'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}