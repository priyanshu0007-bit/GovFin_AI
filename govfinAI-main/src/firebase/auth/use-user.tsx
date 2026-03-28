'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../provider';

/**
 * Hook to access the current (mocked) user.
 * Guaranteed to return a valid user object to support auth-free operation.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<any>(auth.currentUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In demo mode, the user is always available immediately
    if (auth.currentUser) {
      setUser(auth.currentUser);
    }
    setLoading(false);
  }, [auth]);

  return { user, loading };
}
