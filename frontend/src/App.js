import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import InputForm from './pages/InputForm';
import Dashboard from './pages/Dashboard';
import Redistribution from './pages/Redistribution';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            🌾 FoodAI <span>Waste Reducer</span>
          </div>
          <div className="nav-links">
            <NavLink to="/" end className={({isActive}) => isActive ? "active" : ""}>
              🏠 Predict
            </NavLink>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? "active" : ""}>
              📊 Dashboard
            </NavLink>
            <NavLink to="/redistribution" className={({isActive}) => isActive ? "active" : ""}>
              🤝 Redistribute
            </NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<InputForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/redistribution" element={<Redistribution />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;