import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/trends')
      .then(res => setData(res.data))
      .catch(() => alert('Backend not running!'));
  }, []);

  if (!data) return <div className="loading">⏳ Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>📊 Food Consumption Dashboard</h1>
      <p className="subtitle">Historical trends and waste insights</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🍱</div>
          <div className="stat-label">Avg Daily Prepared</div>
          <div className="stat-value">
            {Math.round(data.weekly_data.reduce((a, b) => a + b.total_prepared, 0) / data.weekly_data.length)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Avg Daily Consumed</div>
          <div className="stat-value">
            {Math.round(data.weekly_data.reduce((a, b) => a + b.total_consumed, 0) / data.weekly_data.length)}
          </div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-icon">♻️</div>
          <div className="stat-label">Avg Daily Waste</div>
          <div className="stat-value">
            {Math.round(data.weekly_data.reduce((a, b) => a + b.total_wasted, 0) / data.weekly_data.length)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📉</div>
          <div className="stat-label">Waste Rate</div>
          <div className="stat-value">
            {Math.round(
              (data.weekly_data.reduce((a, b) => a + b.total_wasted, 0) /
              data.weekly_data.reduce((a, b) => a + b.total_prepared, 0)) * 100
            )}%
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h3>📈 Daily Prepared vs Consumed</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.weekly_data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 11}} />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{background: '#1e293b', border: '1px solid #334155'}} />
            <Legend />
            <Line type="monotone" dataKey="total_prepared" stroke="#3b82f6" name="Prepared" strokeWidth={2} />
            <Line type="monotone" dataKey="total_consumed" stroke="#22c55e" name="Consumed" strokeWidth={2} />
            <Line type="monotone" dataKey="total_wasted" stroke="#ef4444" name="Wasted" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>📊 Waste by Day of Week</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.day_trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{background: '#1e293b', border: '1px solid #334155'}} />
            <Legend />
            <Bar dataKey="avg_prepared" fill="#3b82f6" name="Avg Prepared" radius={[4,4,0,0]} />
            <Bar dataKey="avg_consumed" fill="#22c55e" name="Avg Consumed" radius={[4,4,0,0]} />
            <Bar dataKey="avg_wasted" fill="#ef4444" name="Avg Wasted" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;