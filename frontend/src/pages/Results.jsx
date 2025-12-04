import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function Results() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const result = localStorage.getItem('analysisResult');
    if (!result) {
      navigate('/dashboard');
      return;
    }
    setAnalysis(JSON.parse(result));
    fetchRecommendations();
  }, [navigate]);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/recommendations/1', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      } else {
        setRecommendations({
          diet_plan: 'Reduce refined carbohydrates. Increase fiber intake from vegetables and fruits. Limit sugar and processed foods. Focus on whole grains and lean proteins. Monitor portion sizes.',
          exercise_plan: 'Aim for 150 minutes of moderate exercise per week. Include walking, swimming, or cycling. Add strength training 2-3 times per week. Avoid prolonged sitting.',
          lifestyle_tips: 'Maintain consistent meal times. Drink plenty of water. Get adequate sleep (7-9 hours). Manage stress through meditation or yoga. Regular health check-ups. Reduce sodium intake.'
        });
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setRecommendations({
        diet_plan: 'Reduce refined carbohydrates. Increase fiber intake from vegetables and fruits. Limit sugar and processed foods. Focus on whole grains and lean proteins. Monitor portion sizes.',
        exercise_plan: 'Aim for 150 minutes of moderate exercise per week. Include walking, swimming, or cycling. Add strength training 2-3 times per week. Avoid prolonged sitting.',
        lifestyle_tips: 'Maintain consistent meal times. Drink plenty of water. Get adequate sleep (7-9 hours). Manage stress through meditation or yoga. Regular health check-ups. Reduce sodium intake.'
      });
    }
  };

  if (!analysis) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'white', fontSize: '24px' }}>Loading...</div>;

  const getRiskBgColor = (risk) => {
    if (risk === 'Low') return '#22c55e';
    if (risk === 'Medium') return '#eab308';
    return '#ef4444';
  };

  const bmiGaugeData = [
    { name: 'BMI', value: Math.min(analysis.bmi, 50), fill: getRiskBgColor(analysis.riskScore) },
    { name: 'remaining', value: 50 - Math.min(analysis.bmi, 50), fill: '#e5e7eb' },
  ];

  const diabetesData = [
    { name: 'Baseline', value: 70 },
    { name: 'Current Fasting', value: Math.min((analysis.bmi * 3), 100) },
    { name: 'Post Meal', value: Math.min((analysis.bmi * 3.5), 120) },
    { name: 'Target', value: 85 }
  ];

  const TabButton = ({ tabId, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      style={{
        padding: '12px 20px',
        borderRadius: '12px',
        border: 'none',
        background: activeTab === tabId ? 'white' : 'rgba(255,255,255,0.2)',
        color: activeTab === tabId ? '#667eea' : 'white',
        fontWeight: activeTab === tabId ? '700' : '500',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: activeTab === tabId ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );

  const StatCard = ({ title, value, unit, color, icon, subtitle }) => (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      borderTop: `6px solid ${color}`,
      flex: 1,
      minWidth: '200px'
    }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <p style={{ fontSize: '14px', color: '#9ca3af', margin: '0 0 8px 0', fontWeight: '600' }}>{title}</p>
      <p style={{
        fontSize: '42px',
        fontWeight: 'bold',
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '8px 0'
      }}>
        {value}
      </p>
      {unit && <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{unit}</p>}
      {subtitle && <p style={{ fontSize: '12px', color: '#9ca3af', margin: '8px 0 0 0' }}>{subtitle}</p>}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          color: 'white',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h1 style={{ fontSize: '40px', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.1)', margin: 0 }}>
            📊 Health Analysis Results
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '10px',
              border: '2px solid rgba(255,255,255,0.3)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ← Back
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '28px',
          overflowX: 'auto',
          paddingBottom: '8px',
          flexWrap: 'wrap'
        }}>
          <TabButton tabId="overview" label="Overview" icon="📊" />
          <TabButton tabId="analysis" label="Analysis" icon="📈" />
          <TabButton tabId="diet" label="Diet" icon="🍎" />
          <TabButton tabId="exercise" label="Exercise" icon="💪" />
          <TabButton tabId="lifestyle" label="Lifestyle" icon="💡" />
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Key Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              <StatCard
                title="Overall Risk Score"
                value={analysis.riskScore}
                icon="⚠️"
                color={analysis.riskScore === 'Low' ? '#10b981' : analysis.riskScore === 'Medium' ? '#f59e0b' : '#ef4444'}
                subtitle={analysis.riskScore === 'Low' ? '✅ Excellent' : analysis.riskScore === 'Medium' ? '⚠️ Monitor' : '🔴 High'}
              />
              <StatCard
                title="Diabetes Status"
                value={analysis.diabetesStage}
                icon="🩸"
                color={analysis.diabetesStage === 'Normal' ? '#10b981' : analysis.diabetesStage === 'Pre-Diabetic' ? '#f59e0b' : '#ef4444'}
                subtitle={analysis.diabetesStage === 'Normal' ? '🟢 No risk' : analysis.diabetesStage === 'Pre-Diabetic' ? '🟡 Pre-diabetic' : '🔴 Diabetic'}
              />
              <StatCard
                title="BMI Status"
                value={analysis.bmi.toFixed(1)}
                unit="kg/m²"
                icon="📏"
                color="#f59e0b"
                subtitle={analysis.obesityStage}
              />
            </div>

            {/* Warnings Alert */}
            {analysis.warnings && analysis.warnings.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                borderLeft: '6px solid #ef4444'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <span>⚠️</span> Important Health Alerts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {analysis.warnings.map((warning, idx) => (
                    <div key={idx} style={{
                      background: '#fef2f2',
                      border: '2px solid #fecaca',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      borderLeft: '4px solid #ef4444',
                      fontSize: '14px',
                      color: '#991b1b'
                    }}>
                      {warning}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === 'analysis' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {/* BMI Analysis */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              borderTop: '6px solid #667eea'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                📏 BMI Analysis
              </h3>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '12px 0'
                }}>
                  {analysis.bmi.toFixed(1)}
                </p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={bmiGaugeData}
                      cx="50%"
                      cy="50%"
                      startAngle={180}
                      endAngle={0}
                      dataKey="value"
                    >
                      {bmiGaugeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '12px', fontWeight: '600' }}>
                  Status: {analysis.obesityStage}
                </p>
              </div>
            </div>

            {/* Diabetes Risk */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              borderTop: '6px solid #dc2626'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                🩸 Diabetes Risk Trend
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={diabetesData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    dot={{ fill: '#dc2626', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* DIET & NUTRITION TAB */}
        {activeTab === 'diet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Food Recommendations */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              borderTop: '6px solid #f59e0b'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#92400e', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                🥗 Food & Nutrition Guide
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Recommended Foods */}
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#16a34a', marginBottom: '12px' }}>✅ Recommended Foods:</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Leafy greens (spinach, kale)', 'Whole grains (brown rice, oats)', 'Lean proteins (chicken, fish)', 'Legumes (beans, lentils)', 'Berries (blueberries, strawberries)', 'Nuts & seeds (almonds, walnuts)'].map((food, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#374151' }}>
                        <span style={{ flexShrink: 0 }}>🌱</span> {food}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Foods to Avoid */}
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626', marginBottom: '12px' }}>❌ Foods to Avoid:</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Sugary drinks & sodas', 'Refined carbohydrates', 'Fried & processed foods', 'High-fat dairy products', 'White bread & pastries', 'Desserts & candies'].map((food, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#374151' }}>
                        <span style={{ flexShrink: 0 }}>⛔</span> {food}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Daily Meal Plan */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              borderTop: '6px solid #8b5cf6'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#5b21b6', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                🍽️ Sample Daily Meal Plan
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {[
                  { time: '🌅 Breakfast (7-8 AM)', meal: 'Oatmeal with berries and almonds, or 2 boiled eggs with whole wheat toast and green tea' },
                  { time: '🥤 Mid-Morning Snack (10-11 AM)', meal: 'Apple with peanut butter, or cucumber slices with hummus' },
                  { time: '🍲 Lunch (12-1 PM)', meal: 'Grilled chicken/fish with brown rice and steamed vegetables, or lentil soup with salad' },
                  { time: '🥒 Afternoon Snack (3-4 PM)', meal: 'Mixed nuts, or yogurt with berries, or carrot sticks' },
                  { time: '🍱 Dinner (7-8 PM)', meal: 'Baked fish with roasted vegetables and quinoa, or chickpea curry with brown rice' }
                ].map((plan, idx) => (
                  <div key={idx} style={{
                    background: '#faf5ff',
                    padding: '14px',
                    borderRadius: '10px',
                    borderLeft: '4px solid #8b5cf6'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '6px', margin: 0 }}>{plan.time}</h4>
                    <p style={{ fontSize: '12px', color: '#374151', margin: 0 }}>{plan.meal}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Natural Remedies */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              borderTop: '6px solid #06b6d4'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0e7490', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                🌿 Natural Remedies & Supplements
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  { name: 'Cinnamon', benefit: 'May help regulate blood sugar levels' },
                  { name: 'Fenugreek Seeds', benefit: 'Traditional remedy for blood sugar' },
                  { name: 'Bitter Melon', benefit: 'May improve glucose tolerance' },
                  { name: 'Turmeric', benefit: 'Anti-inflammatory properties' },
                  { name: 'Garlic', benefit: 'Regulate blood sugar & cholesterol' },
                  { name: 'Ginger', benefit: 'Anti-inflammatory & metabolism' },
                  { name: 'Alpha-Lipoic Acid', benefit: 'Improves insulin sensitivity' },
                  { name: 'Chromium', benefit: 'Improve glucose metabolism' }
                ].map((remedy, idx) => (
                  <div key={idx} style={{
                    background: '#f0f9ff',
                    padding: '12px',
                    borderRadius: '10px',
                    borderLeft: '3px solid #06b6d4'
                  }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#0e7490', margin: '0 0 4px 0' }}>🌿 {remedy.name}</h4>
                    <p style={{ fontSize: '11px', color: '#374151', margin: 0 }}>{remedy.benefit}</p>
                  </div>
                ))}
              </div>
              <div style={{
                background: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '8px',
                padding: '10px 12px',
                marginTop: '14px',
                fontSize: '11px',
                color: '#92400e'
              }}>
                ⚠️ <strong>Important:</strong> Consult your healthcare provider before starting any supplements.
              </div>
            </div>
          </div>
        )}

        {/* EXERCISE TAB */}
        {activeTab === 'exercise' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            borderTop: '6px solid #0284c7'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0c2d48', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              🏃 Exercise & Fitness Plan
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {recommendations && recommendations.exercise_plan && recommendations.exercise_plan.split('. ').filter(item => item.trim()).map((item, idx) => (
                <div key={idx} style={{
                  background: '#f0f9ff',
                  padding: '16px',
                  borderRadius: '10px',
                  borderLeft: '4px solid #0284c7'
                }}>
                  <p style={{ fontSize: '14px', color: '#0c2d48', margin: 0, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ marginTop: '2px', flexShrink: 0 }}>💪</span>
                    <span>{item}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIFESTYLE TAB */}
        {activeTab === 'lifestyle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Lifestyle Tips */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              borderTop: '6px solid #9333ea'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#4c1d95', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                💡 Lifestyle Tips & Habits
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px'
              }}>
                {recommendations && recommendations.lifestyle_tips && recommendations.lifestyle_tips.split('. ').filter(item => item.trim()).map((item, idx) => (
                  <div key={idx} style={{
                    background: '#faf5ff',
                    padding: '12px',
                    borderRadius: '10px',
                    borderLeft: '3px solid #9333ea',
                    fontSize: '13px',
                    color: '#374151'
                  }}>
                    <span style={{ fontSize: '16px', marginRight: '6px' }}>★</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Diet Guidelines */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              borderTop: '6px solid #14b8a6'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0d5c56', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                📋 Advanced Diet Guidelines
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
                {[
                  { title: '🎯 Portion Control', desc: 'Use the plate method: ½ plate vegetables, ¼ plate protein, ¼ plate grains' },
                  { title: '⏰ Meal Timing', desc: 'Eat meals at consistent times. Space meals 3-4 hours apart' },
                  { title: '💧 Hydration', desc: 'Drink 8-10 glasses of water daily. Limit sugary drinks' },
                  { title: '🥗 Fiber Intake', desc: 'Aim for 25-30g fiber daily from vegetables, fruits, grains' },
                  { title: '🧂 Sodium Reduction', desc: 'Limit salt to less than 2,300mg per day' },
                  { title: '📊 Carbs Management', desc: 'Choose low-glycemic foods. Pair carbs with protein' }
                ].map((guideline, idx) => (
                  <div key={idx} style={{
                    background: '#f0fdf4',
                    padding: '14px',
                    borderRadius: '10px',
                    borderLeft: '4px solid #14b8a6'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f766e', margin: '0 0 6px 0' }}>{guideline.title}</h4>
                    <p style={{ fontSize: '12px', color: '#374151', margin: 0 }}>{guideline.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Medical Disclaimer */}
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          borderLeft: '6px solid #0284c7',
          borderRadius: '16px',
          padding: '20px',
          marginTop: '32px',
          border: '2px solid #bfdbfe'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#0c2d48',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0
          }}>
            <span>⚕️</span> Medical Disclaimer
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#0c2d48',
            lineHeight: '1.5',
            margin: '8px 0 0 0'
          }}>
            This system provides <strong>general health guidance</strong> based on your inputs. It is <strong>NOT a substitute for professional medical advice</strong>.
            Please consult with a qualified healthcare provider for accurate diagnosis and personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
