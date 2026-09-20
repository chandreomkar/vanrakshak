import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isGuest: boolean;
  switchRole: (newRole: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const defaultUser: User = {
  id: 'user-ranger',
  username: 'ranger',
  name: 'Ranger Vikram Singh',
  role: 'ranger',
  email: 'vikram.singh@forest.gov.in',
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  role: 'ranger',
  isAuthenticated: true,
  isGuest: false,
  switchRole: async () => {},
  logout: async () => {},
  loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.getMe();
        if (res.user) {
          setUser(res.user);
        }
      } catch (e) {
        // Fallback to default ranger for friction-free hackathon experience
        setUser(defaultUser);
      }
    }
    loadUser();
  }, []);

  const switchRole = async (newRole: UserRole) => {
    setLoading(true);
    try {
      const res = await api.login(newRole);
      setUser(res.user);
    } catch (e) {
      console.error('Failed to switch role', e);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      await switchRole('guest');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const role: UserRole = user?.role || 'ranger';
  const isGuest = role === 'guest';
  const isAuthenticated = !isGuest;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isGuest,
        switchRole,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
