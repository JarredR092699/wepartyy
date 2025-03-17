import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, users } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isVendor: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: Omit<User, 'id'>) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if there's a saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Check if the current user is a vendor
  const isVendor = currentUser?.role !== 'client';

  // Login function
  const login = async (username: string, password: string) => {
    // In a real app, this would be an API call
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid username or password',
    };
  };

  // Register function
  const register = async (userData: Omit<User, 'id'>) => {
    // Check if username or email already exists
    const userExists = users.some(
      (u) => u.username === userData.username || u.email === userData.email
    );

    if (userExists) {
      return {
        success: false,
        message: 'Username or email already exists',
      };
    }

    // In a real app, this would be an API call
    const newUser: User = {
      ...userData,
      id: `u${users.length + 1}`,
    };

    // Add to users array (in a real app, this would be saved to a database)
    users.push(newUser);

    // Log in the new user
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    return { success: true };
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  // Update user profile
  const updateUserProfile = (userData: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...userData };
    
    // Update in the users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
    }

    // Update current user state and localStorage
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const value = {
    currentUser,
    isAuthenticated,
    isVendor,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 