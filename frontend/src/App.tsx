import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import LeaguePage from './pages/leaguepage';
import TeamPage from './pages/teampage';
import PlayerPage from './pages/playerpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/league/:id" element={<LeaguePage />} />
        <Route path="/team/:id" element={<TeamPage />} />
        <Route path="/player/:id" element={<PlayerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
