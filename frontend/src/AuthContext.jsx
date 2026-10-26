import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const saveSession = useCallback((data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    saveSession(await api('/api/auth/login', { method: 'POST', body: { email, password } }));
  }, [saveSession]);

  const register = useCallback(async (name, email, password) => {
    saveSession(await api('/api/auth/register', { method: 'POST', body: { name, email, password } }));
  }, [saveSession]);

  // Authenticated request: attaches the token, and logs out if the server rejects it
  const request = useCallback(async (path, options = {}) => {
    try {
      return await api(path, { ...options, token });
    } catch (err) {
      if (err.status === 401) logout();
      throw err;
    }
  }, [token, logout]);

  const value = useMemo(
    () => ({ token, user, login, register, logout, request }),
    [token, user, login, register, logout, request]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}