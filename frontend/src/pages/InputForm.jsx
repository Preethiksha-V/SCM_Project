import React, { useState } from 'react';
import axios from 'axios';
import './InputForm.css';

function InputForm() {
  const [form, setForm] = useState({
    day: 'Monday',
    event: 'None',
    meal_type: 'Lunch',
    planned: 200
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/predict', {
        ...form,
        planned: parseInt(form.planned)
      });
      setResult(res.data);
    } catch (err) {
      alert('Backend not running! Start uvicorn first.');
    }
    setLoading(false);
  };

  return (
    <div className="input-page">
      <h1>🍽️ Food Demand Predictor</h1>
      <p className="subtitle">Enter today's meal details to predict demand and detect waste</p>

      <div className="form-card">
        <div className="form-grid">
          <div className="form-group">
            <label>📅 Day</label>
            <select value={form.day} onChange={e => setForm({...form, day: e.target.value})}>
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>🎉 Event</label>
            <select value={form.event} onChange={e => setForm({...form, event: e.target.value})}>
              {['None','Fest','Sports','Exam','Holiday','Guest'].map(e => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>🥘 Meal Type</label>
            <select value={form.meal_type} onChange={e => setForm({...form, meal_type: e.target.value})}>
              <option>Lunch</option>
              <option>Dinner</option>
            </select>
          </div>

          <div className="form-group">
            <label>🍱 Planned Quantity</label>
            <input
              type="number"
              value={form.planned}
              onChange={e => setForm({...form, planned: e.target.value})}
              min="50"
              max="1000"
            />
          </div>
        </div>

        <button className="predict-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ Predicting...' : '🔮 Predict Demand'}
        </button>
      </div>

      {result && (
        <div className="results">
          <div className={`alert-banner ${result.prediction.alert ? 'alert-red' : 'alert-green'}`}>
            {result.prediction.alert
              ? '⚠️ HIGH SURPLUS ALERT — Redistribution Recommended!'
              : '✅ Demand looks balanced — Minimal waste expected'}
          </div>

          <div className="result-grid">
            <div className="result-card">
              <div className="result-icon">🎯</div>
              <div className="result-label">Predicted Demand</div>
              <div className="result-value">{result.prediction.predicted_demand}</div>
              <div className="result-sub">meals</div>
            </div>

            <div className="result-card">
              <div className="result-icon">📦</div>
              <div className="result-label">Planned</div>
              <div className="result-value">{result.prediction.planned}</div>
              <div className="result-sub">meals</div>
            </div>

            <div className="result-card highlight">
              <div className="result-icon">♻️</div>
              <div className="result-label">Expected Surplus</div>
              <div className="result-value">{result.prediction.expected_surplus}</div>
              <div className="result-sub">{result.prediction.surplus_percentage}% waste</div>
            </div>

            <div className="result-card">
              <div className="result-icon">📈</div>
              <div className="result-label">Confidence</div>
              <div className="result-value">{result.prediction.confidence}</div>
              <div className="result-sub">prediction accuracy</div>
            </div>
          </div>

          <div className="ai-explanation">
            <h3>🤖 How AI Predicted This</h3>
            <div className="explanation-grid">
              <div className="exp-item">
                <span>Linear Regression:</span>
                <strong>{result.prediction.lr_prediction} meals</strong>
              </div>
              <div className="exp-item">
                <span>Moving Average (7-day):</span>
                <strong>{result.prediction.moving_avg_baseline} meals</strong>
              </div>
              <div className="exp-item">
                <span>Final Prediction:</span>
                <strong>{result.prediction.predicted_demand} meals (average of both)</strong>
              </div>
            </div>
          </div>

          {result.redistribution.suggestions.length > 0 && (
            <div className="redistribution-preview">
              <h3>🤝 Suggested Redistribution</h3>
              {result.redistribution.suggestions.map((s, i) => (
                <div key={i} className="ngo-card">
                  <div className="ngo-name">{s.ngo}</div>
                  <div className="ngo-details">
                    <span>📍 {s.area}</span>
                    <span>📞 {s.contact}</span>
                    <span className="ngo-meals">🍱 {s.allocated_meals} meals</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InputForm;