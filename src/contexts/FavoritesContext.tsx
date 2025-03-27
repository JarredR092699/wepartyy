import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type ServiceType = 'venue' | 'dj' | 'catering' | 'entertainment' | 'photography' | 'decoration' | 'audioVisual' | 'furniture' | 'barService' | 'security';

interface FavoriteItem {
  id: string;
  type: ServiceType;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (id: string, type: ServiceType) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid || currentUser.id;
      const storedFavorites = localStorage.getItem(`favorites_${userId}`);
      
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites));
        } catch (error) {
          console.error('Failed to parse favorites from localStorage:', error);
          setFavorites([]);
        }
      }
    } else {
      // Clear favorites when user logs out
      setFavorites([]);
    }
  }, [currentUser]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (currentUser && favorites.length > 0) {
      const userId = currentUser.uid || currentUser.id;
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);

  const addFavorite = (id: string, type: ServiceType) => {
    if (!currentUser) return;
    
    setFavorites(prev => {
      // Don't add if already in favorites
      if (prev.some(item => item.id === id)) {
        return prev;
      }
      return [...prev, { id, type }];
    });
  };

  const removeFavorite = (id: string) => {
    if (!currentUser) return;
    
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}; 