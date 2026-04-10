import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HostPage from './pages/HostPage';
import JoinPage from './pages/JoinPage';
import PlayerPage from './pages/PlayerPage';
import AdminPage from './pages/AdminPage';
import './index.css';

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-slate-900">
        <Routes>
          <Route path="/" element={<Navigate to="/host" />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/join/:sessionId" element={<JoinPage />} />
          <Route path="/player/:sessionId/:teamName" element={<PlayerPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}
