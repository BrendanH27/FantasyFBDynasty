import React, { createContext, useContext, useEffect, useState } from 'react';
import { URLS, SecureFetch } from '../constants';

type User = {
  id: number;
  username: string;
  email: string;
  nickname?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user info with existing access token
        const me = await SecureFetch(URLS.API_ME, {
          credentials: 'include',
          skipErrorRedirect: true
        });

        if (me.ok) {
          const data = await me.json();
          setUser(data.user);
          return;
        }

        // If access token expired (401), try to refresh
        if (me.status === 401) {
          const refreshResponse = await SecureFetch(URLS.API_REFRESH, {
            method: 'POST',
            credentials: 'include',
            skipErrorRedirect: true
          });

          if (refreshResponse.ok) {
            // Retry getting user info with new access token
            const me2 = await SecureFetch(URLS.API_ME, {
              credentials: 'include',
              skipErrorRedirect: true
            });

            if (me2.ok) {
              const data = await me2.json();
              setUser(data.user);
              return;
            }
          }
        }

        // If we get here, user is not authenticated
        setUser(null);

      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await SecureFetch(URLS.API_LOGIN_USER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
        skipErrorRedirect: true,
      });

      if (!res.ok) return false;

      const data = await res.json();
      console.log(data);
      setUser(data.user); // assuming response is { user, token }
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await SecureFetch(URLS.API_LOGOUT_USER, {
        method: 'POST',
        credentials: 'include',
        skipErrorRedirect: true
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
