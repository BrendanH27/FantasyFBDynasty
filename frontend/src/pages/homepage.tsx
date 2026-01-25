import React, { useEffect, useState } from 'react';
import { URLS, SecureFetch } from '../constants';
import { Link } from 'react-router-dom';
import { useAuth } from '../shared/authcontext';
import '../stylesheets/homepage.css';

type League = {
  id: number;
  name: string;
  available_spots: number;
};

type UserLeagueMembership = {
  id: number;
  user_id: number;
  league_id: number;
  league_name: string;
  role: string;
  team_id: number;
};


const HomePage: React.FC = () => {
  const { user, loading, login, logout } = useAuth();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [myLeagues, setMyLeagues] = useState<UserLeagueMembership[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchLeagues = async () => {
    try {
      const res = await SecureFetch(URLS.API_GET_LEAGUES, {
        skipErrorRedirect: true
      });
      if (res.ok) {
        const data = await res.json();
        setLeagues(data);
      }
    } catch (err) {
      console.error('Error fetching leagues:', err);
    }
  };

  const fetchMyLeagues = async () => {
    if (!user) return;
    try {
      const res = await SecureFetch(URLS.API_GET_MEMBERSHIPS_BY_USER_ID(user.id), {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        credentials: 'include',
        skipErrorRedirect: true
      });
      if (!res.ok) throw new Error('Failed to fetch my leagues');
      const data = await res.json();
      setMyLeagues(data);
    } catch (err) {
      console.error('Error fetching my leagues:', err);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyLeagues();
      setShowModal(false);
    } else {
      setMyLeagues([]);
    }
  }, [user]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <div className="home-inner">
        <header>
          <h1>Fantasy Football Dynasty</h1>
          {!user ? (
            <button onClick={() => setShowModal(true)}>Sign In</button>
          ) : (
            <>
              <span>Welcome, {user.email}!</span>
            </>
          )}
        </header>

        {user && (
          <section className="my-leagues">
            <h2>My Leagues</h2>
            {myLeagues.length === 0 ? (
              <p>You are not a member of any leagues.</p>
            ) : (
              <ul>
                {myLeagues.map(league => (
                  <li key={league.id}>
                    <Link to={`/league/${league.league_id}`}>
                      <strong>{league.league_name}</strong>
                    </Link>
                  </li>

                ))}
              </ul>
            )}
          </section>
        )}

        <section className="leagues">
          <h2>Available Leagues</h2>
          <button onClick={fetchLeagues} style={{ marginBottom: '1rem' }}>
            Refresh
          </button>
          <ul>
            {leagues.map(league => (
              <li key={league.id}>
                <Link to={`/league/${league.id}`}>
                  <strong>{league.name}</strong> – {league.available_spots}{' '}
                  spot{league.available_spots !== 1 ? 's' : ''} open
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
