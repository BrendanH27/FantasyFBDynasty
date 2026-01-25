import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/authcontext';
import '../stylesheets/signinpage.css';

type UserLeagueMembership = {
  id: number;
  user_id: number;
  league_id: number;
  league_name: string;
  role: string;
  team_id: number;
};

type ModalType = 'signin' | 'signup' | null;

const SignInPage: React.FC = () => {
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string>('');

  useEffect(() => {
    if (user) {
      setLoginError('');
    }
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const success = await login(email, password);
    if (loading) return <div>Loading...</div>;
    if (!success) {
      setLoginError('Invalid email or password');
      return;
    }
    setEmail('');
    setPassword('');
    setModalType(null);
    navigate('/home');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="signin">
      <header>
        <h1>Fantasy Football Dynasty</h1>
      </header>

      <button onClick={() => setModalType('signin')}>Sign In</button>
      <button onClick={() => setModalType('signup')}>Sign Up</button>

      {modalType && !user && (
        <div className="modal-backdrop">
          <div className="modal">

            {modalType === 'signin' && (
              <>
                <h2>Sign In</h2>
                {loginError && <p className="error-text">{loginError}</p>}
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
                    <button type="button" onClick={() => setModalType(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {modalType === 'signup' && (
              <>
                <h2>Sign Up</h2>
                <form>
                  <input type="email" placeholder="Email" />
                  <input type="password" placeholder="Password" />
                  <input type="password" placeholder="Confirm Password" />
                  <div className="modal-actions">
                    <button type="submit">Create Account</button>
                    <button type="button" onClick={() => setModalType(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}


    </div>
  );

};

export default SignInPage;