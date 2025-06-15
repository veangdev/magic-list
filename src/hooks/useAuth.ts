import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  streak: number;
}

export function useAuth() {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      try {
        // In a real app, you would validate the token with your backend
        if (user) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: 'user-1',
        name: 'John Doe',
        email,
        points: 1250,
        streak: 7,
      };

      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: crypto.randomUUID(),
        name,
        email,
        points: 0,
        streak: 0,
      };

      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to create account' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Clear other user-related data
    localStorage.removeItem('userPoints');
    localStorage.removeItem('userStreak');
  };

  const resetPassword = async (email: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to send reset email' };
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    resetPassword,
  };
}