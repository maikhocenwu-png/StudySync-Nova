import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function useStartQuiz() {
  const { request } = useAuth();
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  async function startQuiz(topicId) {
    setStarting(true);
    setError('');
    try {
      const data = await request('/api/quizzes', { method: 'POST', body: { topic_id: topicId } });
      navigate('/quiz', { state: { quizData: data } });
    } catch (err) {
      setError(err.message);
      setStarting(false);
    }
  }

  return { startQuiz, starting, error };
}