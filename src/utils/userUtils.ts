import { User } from '../data/mockData';

/**
 * Gets the user ID in a format compatible with both our app and Firebase
 * This handles the case where some parts of our code expect a uid property
 * and others expect an id property
 */
export const getUserId = (user: User | null | undefined): string | null => {
  if (!user) return null;
  
  // Return uid if available, otherwise fall back to id
  return user.uid || user.id || null;
};

/**
 * Gets the user's display name in a format compatible with both our app and Firebase
 * This handles the case where some parts of our code expect a displayName property
 * and others expect a name property
 */
export const getUserDisplayName = (user: User | null | undefined): string => {
  if (!user) return 'Anonymous User';
  
  // Return displayName if available, otherwise fall back to name
  return user.displayName || user.name || 'Anonymous User';
}; 