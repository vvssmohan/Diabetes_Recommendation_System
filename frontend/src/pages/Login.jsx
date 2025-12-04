import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!email.trim()) {
      setError('❌ Email is required. Please enter your email address.');
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setError('❌ Password is required. Please enter your password.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('❌ Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    if (!email.includes('@')) {
      setError('❌ Please enter a valid email address (e.g., example@email.com).');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { email, password });
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });
      console.log('Login response:', response.data);
      const token = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('❌ Wrong Credentials! Email or password is incorrect. Please try again.');
      } else if (err.response?.status === 404) {
        setError('❌ User not found! Please check your email or sign up for a new account.');
      } else if (err.response?.status === 400) {
        setError('❌ Invalid input! Please check your email and password format.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('❌ Network error! Cannot connect to server. Please check if backend is running.');
      } else {
        setError(typeof err.response?.data === 'string' ? err.response.data : '❌ Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'white',
            borderRadius: '50%',
            marginBottom: '16px',
            fontSize: '32px'
          }}>
            🩺
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
            DiabetesCare
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Personalized Health Management</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Login to your account</p>

          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#9ca3af' : 'linear-gradient(to right, #3b82f6, #2563eb)',
                color: 'white',
                fontWeight: '600',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontSize: '16px'
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)')}
              onMouseOut={(e) => !loading && (e.target.style.background = 'linear-gradient(to right, #3b82f6, #2563eb)')}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
          <span>Don't have an account? </span>
          <a href="/signup" style={{ color: 'white', fontWeight: '600', textDecoration: 'none', cursor: 'pointer' }}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
