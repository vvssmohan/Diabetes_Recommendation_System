import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!formData.name.trim()) {
      setError('❌ Name is required. Please enter your full name.');
      setLoading(false);
      return;
    }
    if (formData.name.length < 2) {
      setError('❌ Name must be at least 2 characters long.');
      setLoading(false);
      return;
    }
    if (!formData.age) {
      setError('❌ Age is required. Please enter your age.');
      setLoading(false);
      return;
    }
    const ageNum = parseInt(formData.age);
    if (ageNum < 1 || ageNum > 120) {
      setError('❌ Age must be between 1 and 120 years.');
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError('❌ Email is required. Please enter your email address.');
      setLoading(false);
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('❌ Please enter a valid email address (e.g., example@email.com).');
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setError('❌ Password is required. Please enter a password.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('❌ Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    if (!formData.gender) {
      setError('❌ Gender is required. Please select your gender.');
      setLoading(false);
      return;
    }

    try {
      console.log('Signing up with:', formData);
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
      });
      console.log('Signup response:', response.data);
      const token = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', formData.email);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response?.status === 400) {
        setError('❌ Invalid details! Email already exists or parameters are incorrect. Please check and try again.');
      } else if (err.response?.status === 409) {
        setError('❌ Email already registered! Please use a different email or try logging in.');
      } else if (err.response?.status === 422) {
        setError('❌ Wrong parameters! Please check all fields are filled correctly.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('❌ Network error! Cannot connect to server. Please check if backend is running.');
      } else {
        const errorMsg = typeof err.response?.data === 'string' ? err.response.data : 'Signup failed. Please check your details and try again.';
        setError('❌ ' + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '450px' }}>
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
            Personalised Recommendation For Diabetes Patients
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Create your account</p>
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
            Register
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Join our health management platform</p>

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

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="25"
                  min="1"
                  max="120"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981';
                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981';
                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength="6"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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
                background: loading ? '#9ca3af' : 'linear-gradient(to right, #10b981, #059669)',
                color: 'white',
                fontWeight: '600',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontSize: '16px'
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = 'linear-gradient(to right, #059669, #047857)')}
              onMouseOut={(e) => !loading && (e.target.style.background = 'linear-gradient(to right, #10b981, #059669)')}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
          <span>Already have an account? </span>
          <a href="/login" style={{ color: 'white', fontWeight: '600', textDecoration: 'none', cursor: 'pointer' }}>
            Login
          </a>
        </div>
      </div>

      {/* Professional Footer Section */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)',
        padding: '24px 16px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '12px',
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.8)',
        zIndex: 10
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
          By: R V V S S MOHAN (2501050151), HANUMANTHU TARUN (2501050043),<br />
          M S RAMA KRISHNA (2501050020), Y. NICHAL KOTEISHH (2501050052),<br />
          CH NIHAL KUMAR (2501050007)
        </p>
        <p style={{ margin: '0', fontWeight: '500' }}>
          Under the supervision of: DR. V. CHANDRA PRAKASH
        </p>
      </div>

      {/* Spacing for footer */}
      <div style={{ height: '140px' }} />
    </div>
  );
}
