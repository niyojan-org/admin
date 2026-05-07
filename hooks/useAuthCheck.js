/**
 * useAuthCheck Hook
 * 
 * Checks if user is authenticated and opens login popup if not
 * Integrates with Zustand user store
 */

import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { authenticateWithPopup } from '@/lib/authPopup';

/**
 * Hook to check authentication and handle popup login
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - If true, automatically opens login popup when not authenticated
 * @param {boolean} options.checkOnMount - If true, checks authentication on component mount
 * @param {Function} options.onAuthSuccess - Callback when authentication succeeds
 * @param {Function} options.onAuthError - Callback when authentication fails
 * @returns {Object} Auth state and methods
 */
export function useAuthCheck(options = {}) {
  const {
    requireAuth = false,
    checkOnMount = true,
    onAuthSuccess,
    onAuthError,
  } = options;

  const { isAuthenticated, fetchUser, loading } = useUserStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [authError, setAuthError] = useState(null);

  /**
   * Opens the authentication popup
   * @param {string} view - The view to show (login/signup)
   */
  const openLoginPopup = useCallback(async (view = 'login') => {
    setPopupOpen(true);
    setAuthError(null);

    try {
      const result = await authenticateWithPopup(view);
      
      console.log('Authentication successful:', result);

      // Refresh user data from the server
      await fetchUser();

      if (onAuthSuccess) {
        onAuthSuccess(result);
      }

      return result;
    } catch (error) {
      console.error('Authentication failed:', error);
      setAuthError(error.message);

      if (onAuthError) {
        onAuthError(error);
      }

      throw error;
    } finally {
      setPopupOpen(false);
    }
  }, [fetchUser, onAuthSuccess, onAuthError]);

  /**
   * Checks authentication status
   */
  const checkAuth = useCallback(async () => {
    setIsCheckingAuth(true);
    setAuthError(null);

    try {
      const authenticated = await fetchUser();
      
      // If not authenticated and requireAuth is true, open popup
      if (!authenticated && requireAuth) {
        await openLoginPopup('login');
      }

      return authenticated;
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthError(error.message);
      
      // If requireAuth is true, try to open popup even on error
      if (requireAuth) {
        try {
          await openLoginPopup('login');
        } catch (popupError) {
          console.error('Failed to open login popup:', popupError);
        }
      }
      
      return false;
    } finally {
      setIsCheckingAuth(false);
    }
  }, [fetchUser, requireAuth, openLoginPopup]);

  // Check auth on mount if enabled
  useEffect(() => {
    if (checkOnMount) {
      checkAuth();
    }
  }, [checkOnMount]); // Only run on mount

  return {
    isAuthenticated,
    isCheckingAuth: isCheckingAuth || loading,
    popupOpen,
    authError,
    openLoginPopup,
    checkAuth,
    clearError: () => setAuthError(null),
  };
}

/**
 * Hook for manual authentication popup control
 * Use this when you just want popup functionality without automatic checks
 */
export function useAuthPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchUser } = useUserStore();

  const openAuth = useCallback(async (view = 'login') => {
    setIsLoading(true);
    setError(null);
    setIsOpen(true);

    try {
      const result = await authenticateWithPopup(view);
      
      console.log('Authentication successful:', result);
      
      // Refresh user data from the server
      await fetchUser();
      
      return result;
    } catch (err) {
      console.error('Authentication failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }, [fetchUser]);

  return {
    openAuth,
    isOpen,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
