import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card auth-card">
      <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <label>Name
            <input name="name" value={form.name} onChange={update} required />
          </label>
        )}
        <label>Email
          <input name="email" type="email" value={form.email} onChange={update} required />
        </label>
        <label>Password
          <input name="password" type="password" value={form.password} onChange={update}
                 minLength={8} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={loading}>
          {loading ? 'Please wait…' : isRegister ? 'Sign up' : 'Log in'}
        </button>
      </form>
      <p className="muted">
        {isRegister
          ? <>Already have an account? <Link to="/login">Log in</Link></>
          : <>New here? <Link to="/register">Create an account</Link></>}
      </p>
    </div>
  );
}