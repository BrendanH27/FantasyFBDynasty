import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './shared/authcontext';
import HomePage from './pages/homepage';
import SignInPage from './pages/signinpage';
import LeaguePage from './pages/leaguepage';
import TeamPage from './pages/teampage';
import PlayerPage from './pages/playerpage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/home" element={<HomePage />}/>
          <Route path="/league/:id" element={<LeaguePage />} />
          <Route path="/team/:id" element={<TeamPage />} />
          <Route path="/player/:id" element={<PlayerPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
