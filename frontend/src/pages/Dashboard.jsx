import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    sugar_fasting: '',
    sugar_post: '',
    blood_pressure: '',
    activity_level: 'Moderate',
    family_history: 'No',
  });
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Real-time warning generation
    generateWarnings({ ...formData, [name]: value });
  };

  const generateWarnings = (data) => {
    const tempWarnings = [];
    
    if (data.sugar_fasting && parseFloat(data.sugar_fasting) >= 126) {
      tempWarnings.push('⚠️ Fasting sugar indicates diabetic range.');
    } else if (data.sugar_fasting && parseFloat(data.sugar_fasting) >= 100) {
      tempWarnings.push('⚠️ Fasting sugar indicates pre-diabetic condition.');
    }

    if (data.sugar_post && parseFloat(data.sugar_post) >= 200) {
      tempWarnings.push('⚠️ Post-meal sugar is in diabetic range.');
    }

    if (data.height && data.weight) {
      const h = parseFloat(data.height);
      const w = parseFloat(data.weight);
      if (h > 0 && w > 0) {
        const bmi = w / (h * h);
        if (bmi >= 30) {
          tempWarnings.push('⚠️ BMI suggests obesity stage. Please consult a doctor.');
        } else if (bmi >= 25) {
          tempWarnings.push('⚠️ BMI suggests overweight condition.');
        }
      }
    }

    if (data.blood_pressure && data.blood_pressure.startsWith('140')) {
      tempWarnings.push('⚠️ High blood pressure detected.');
    }

    setWarnings(tempWarnings);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setErrors('');
    setLoading(true);

    // Comprehensive client-side validation
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const sugarFasting = parseFloat(formData.sugar_fasting);
    const sugarPost = parseFloat(formData.sugar_post);

    // Height validation (convert feet to meters)
    if (!formData.height.trim()) {
      setErrors('❌ Height is required. Please enter your height in feet (e.g., 5.9).');
      setLoading(false);
      return;
    }
    if (isNaN(height) || height <= 0) {
      setErrors('❌ Height must be a valid positive number (e.g., 5.9 feet).');
      setLoading(false);
      return;
    }
    if (height < 3.5 || height > 8) {
      setErrors('❌ Height should be between 3.5 feet (1.07m) and 8 feet (2.44m). Please check and try again.');
      setLoading(false);
      return;
    }

    // Weight validation
    if (!formData.weight.trim()) {
      setErrors('❌ Weight is required. Please enter your weight in kilograms (e.g., 70).');
      setLoading(false);
      return;
    }
    if (isNaN(weight) || weight <= 0) {
      setErrors('❌ Weight must be a valid positive number (e.g., 75 kg).');
      setLoading(false);
      return;
    }
    if (weight < 30 || weight > 250) {
      setErrors('❌ Weight should be between 30 kg and 250 kg. Please check and try again.');
      setLoading(false);
      return;
    }

    // Fasting blood sugar validation (Normal: 70-100 mg/dL, Pre-diabetic: 100-125, Diabetic: ≥126)
    if (!formData.sugar_fasting.trim()) {
      setErrors('❌ Fasting Blood Sugar is required. Enter after 8+ hours without food (Normal: 70-100 mg/dL).');
      setLoading(false);
      return;
    }
    if (isNaN(sugarFasting) || sugarFasting < 0) {
      setErrors('❌ Fasting Blood Sugar must be a valid non-negative number (e.g., 95 mg/dL).');
      setLoading(false);
      return;
    }
    if (sugarFasting < 50 || sugarFasting > 600) {
      setErrors('❌ Fasting Blood Sugar should be between 50-600 mg/dL. Normal: 70-100, Pre-diabetic: 100-125, Diabetic: ≥126.');
      setLoading(false);
      return;
    }

    // Post-meal blood sugar validation (Normal: <140, Pre-diabetic: 140-199, Diabetic: ≥200)
    if (!formData.sugar_post.trim()) {
      setErrors('❌ Post-Meal Blood Sugar is required. Measure 2 hours after eating (Normal: <140 mg/dL).');
      setLoading(false);
      return;
    }
    if (isNaN(sugarPost) || sugarPost < 0) {
      setErrors('❌ Post-Meal Blood Sugar must be a valid non-negative number (e.g., 130 mg/dL).');
      setLoading(false);
      return;
    }
    if (sugarPost < 50 || sugarPost > 600) {
      setErrors('❌ Post-Meal Blood Sugar should be between 50-600 mg/dL. Normal: <140, Pre-diabetic: 140-199, Diabetic: ≥200.');
      setLoading(false);
      return;
    }

    // Blood pressure validation (Normal: <120/80, Elevated: 120-129/<80, High BP: ≥130/80)
    if (!formData.blood_pressure.trim()) {
      setErrors('❌ Blood Pressure is required. Enter in format: Systolic/Diastolic (e.g., 120/80 mmHg).');
      setLoading(false);
      return;
    }
    const bpParts = formData.blood_pressure.split('/');
    if (bpParts.length !== 2) {
      setErrors('❌ Blood Pressure format is invalid. Use format: Systolic/Diastolic (e.g., 120/80).');
      setLoading(false);
      return;
    }
    const systolic = parseFloat(bpParts[0]);
    const diastolic = parseFloat(bpParts[1]);
    if (isNaN(systolic) || isNaN(diastolic) || systolic < 0 || diastolic < 0) {
      setErrors('❌ Blood Pressure values must be valid non-negative numbers (e.g., 120/80).');
      setLoading(false);
      return;
    }
    if (systolic < 80 || systolic > 220 || diastolic < 40 || diastolic > 140) {
      setErrors('❌ Blood Pressure out of range. Normal: <120/80, Elevated: 120-129/<80, High: ≥130/80.');
      setLoading(false);
      return;
    }
    if (systolic <= diastolic) {
      setErrors('❌ Systolic pressure must be greater than Diastolic pressure (e.g., 120/80, not 80/120).');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:8080/api/health/analyze',
        {
          user_id: 1,
          height: height * 0.3048, // Convert feet to meters
          weight: weight,
          sugar_fasting: sugarFasting,
          sugar_post: sugarPost,
          blood_pressure: formData.blood_pressure,
          activity_level: formData.activity_level,
          family_history: formData.family_history,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem('analysisResult', JSON.stringify(response.data));
      navigate('/results');
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors('❌ Invalid health parameters! Please check all values are in valid ranges.');
      } else if (err.response?.status === 401) {
        setErrors('❌ Session expired! Please login again.');
      } else if (err.code === 'ERR_NETWORK') {
        setErrors('❌ Network error! Cannot connect to server. Please check if backend is running.');
      } else {
        setErrors('❌ Error analyzing health data: ' + (err.response?.data || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          color: 'white'
        }}>
          <div>
            <h1 style={{
              fontSize: '42px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              Health Dashboard
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.9 }}>
              💙 Monitor your diabetes health metrics
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            style={{
              background: 'linear-gradient(to right, #f87171, #dc2626)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(to right, #dc2626, #b91c1c)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(to right, #f87171, #dc2626)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            🚪 Logout
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* Form Section - Main Card */}
          <div style={{
            gridColumn: 'span 2',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            padding: '40px',
            borderTop: '6px solid #667eea'
          }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                📋 Enter Your Health Details
              </h2>
              <p style={{ color: '#6b7280' }}>Track your health metrics for personalized recommendations</p>
            </div>

            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Error Message Display */}
              {errors && (
                <div style={{
                  background: '#fee2e2',
                  border: '2px solid #fecaca',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#991b1b',
                  fontWeight: '600',
                  fontSize: '14px',
                  animation: 'slideDown 0.3s ease-out'
                }}>
                  {errors}
                </div>
              )}

              {/* Success Message Display */}
              {warnings.length === 0 && formData.height && formData.weight && formData.sugar_fasting && formData.sugar_post && formData.blood_pressure && !errors && (
                <div style={{
                  background: '#dcfce7',
                  border: '2px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#166534',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  ✅ All parameters are within normal ranges! Ready to analyze.
                </div>
              )}
              {/* Measurements Section */}
              <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '16px' }}>
                  📏 Body Measurements
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Height (feet)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      step="0.1"
                      required
                      placeholder="5.9"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Weight (kilograms)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      step="0.1"
                      required
                      placeholder="75"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Blood Sugar Section */}
              <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #dc2626' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#7f1d1d', marginBottom: '16px' }}>
                  🩸 Blood Sugar Levels (mg/dL)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Fasting Sugar
                    </label>
                    <input
                      type="number"
                      name="sugar_fasting"
                      value={formData.sugar_fasting}
                      onChange={handleChange}
                      required
                      placeholder="110"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #fecaca',
                        borderRadius: '10px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.3s',
                        backgroundColor: '#fff5f5',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#dc2626';
                        e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#fecaca';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Post-Meal Sugar
                    </label>
                    <input
                      type="number"
                      name="sugar_post"
                      value={formData.sugar_post}
                      onChange={handleChange}
                      required
                      placeholder="180"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #fecaca',
                        borderRadius: '10px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.3s',
                        backgroundColor: '#fff5f5',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#dc2626';
                        e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#fecaca';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Blood Pressure Section */}
              <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #0284c7' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0c2d48', marginBottom: '16px' }}>
                  💊 Blood Pressure
                </h3>
                <input
                  type="text"
                  name="blood_pressure"
                  value={formData.blood_pressure}
                  onChange={handleChange}
                  required
                  placeholder="120/80"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #bfdbfe',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    backgroundColor: '#f8fbff',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0284c7';
                    e.target.style.boxShadow = '0 0 0 4px rgba(2, 132, 199, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#bfdbfe';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Lifestyle Section */}
              <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#78350f', marginBottom: '16px' }}>
                  🏃 Lifestyle Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Activity Level
                    </label>
                    <select
                      name="activity_level"
                      value={formData.activity_level}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #fcd34d',
                        borderRadius: '10px',
                        fontSize: '15px',
                        outline: 'none',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f59e0b';
                        e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#fcd34d';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Family History of Diabetes
                    </label>
                    <select
                      name="family_history"
                      value={formData.family_history}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #fcd34d',
                        borderRadius: '10px',
                        fontSize: '15px',
                        outline: 'none',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f59e0b';
                        e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#fcd34d';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#9ca3af' : 'linear-gradient(to right, #667eea, #764ba2)',
                  color: 'white',
                  fontWeight: '600',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.3s',
                  boxShadow: loading ? 'none' : '0 8px 20px rgba(102, 126, 234, 0.3)'
                }}
                onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
              >
                {loading ? '⏳ Analyzing...' : '🔍 Analyze Health'}
              </button>
            </form>
          </div>

          {/* Alerts Section - Side Card */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            padding: '32px',
            borderTop: '6px solid #f59e0b',
            height: 'fit-content',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '28px' }}>⚠️</span> Real-Time Alerts
            </h3>

            {warnings.length === 0 ? (
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: '2px solid #6ee7b7',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px'
                }}>
                  ✅ All Looks Good!
                </p>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  Your current values are within normal range
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {warnings.map((warning, idx) => (
                  <div key={idx} style={{
                    background: '#fef3c7',
                    border: '2px solid #fcd34d',
                    borderRadius: '10px',
                    padding: '16px',
                    borderLeft: '4px solid #f59e0b'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#78350f',
                      fontWeight: '600',
                      margin: 0
                    }}>
                      {warning}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Info Box */}
            <div style={{
              marginTop: '24px',
              background: '#eff6ff',
              border: '2px solid #bfdbfe',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <p style={{
                fontSize: '13px',
                color: '#0c2d48',
                margin: 0,
                lineHeight: '1.6'
              }}>
                <strong>📌 Note:</strong> Alerts update in real-time as you enter data. Consult with a healthcare provider for medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
