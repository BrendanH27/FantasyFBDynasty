import React, { useEffect, useState } from 'react';
import { URLS, SecureFetch } from '../constants';
import { Link } from 'react-router-dom';

type League = {
  id: number;
  name: string;
  available_spots: number;
};

const HomePage: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchLeagues = async () => {
    try {
      const res = await SecureFetch(URLS.API_GET_LEAGUES);
      const data = await res.json();
      setLeagues(data);
    } catch (err) {
      console.error('Error fetching leagues:', err);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await SecureFetch(URLS.API_LOGIN_USER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Login failed');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    console.log('Logged in as:', data.user.username);
    setShowModal(false);
  } catch (err) {
    console.error('Login error:', err);
    alert('An error occurred during login.');
  }
};


  return (
    <div className="home">
      <header>
        <h1>Fantasy Football Dynasty</h1>
        <button onClick={() => setShowModal(true)}>Sign In</button>
      </header>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Sign In</h2>
            <form onSubmit={handleSignIn}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={e => setPassword(e.target.value)}
              />
              <div className="modal-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="leagues">
        <h2>Available Leagues</h2>
        <button onClick={fetchLeagues} style={{ marginBottom: '1rem' }}>Refresh</button>
        <ul>
          {leagues.map(league => (
            <li key={league.id}>
              <Link to={`/league/${league.id}`}>
                <strong>{league.name}</strong> – {league.available_spots} spot{league.available_spots !== 1 ? 's' : ''} open
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
