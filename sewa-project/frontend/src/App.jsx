import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthSystem from './components/Auth/AuthSystem';
import HotelDashboard from './pages/Hotel/Dashboard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Role-based login using AuthSystem */}
          <Route path="/auth/individual" element={<AuthSystem initialUserType="individual" />} />
          <Route path="/auth/ngo" element={<AuthSystem initialUserType="ngo" />} />
          <Route path="/auth/hotel" element={<AuthSystem initialUserType="hotel" />} />

          <Route path="/donate" element={<Home section="Donate" />} />
          <Route path="/about" element={<Home section="About" />} />
          <Route path="/hotel" element={<HotelDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
