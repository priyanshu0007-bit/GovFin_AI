'use client';

import { useState, useEffect } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';

/**
 * Defensive hook for fetching a single document.
 * Handles null refs and mock firestore instances gracefully to prevent crashes.
 */
export function useDoc<T = DocumentData>(docRef: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // CRITICAL: Defensive check to prevent SDK crashes during initialization or demo mode
    if (!docRef || !docRef.firestore || (docRef.firestore as any).__isMock) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot: DocumentSnapshot<T>) => {
          setData(snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } : null);
          setLoading(false);
        },
        (err) => {
          // Log only if it's not a permission error during standard usage
          if (process.env.NODE_ENV === 'development') {
            console.warn("Firestore listener error:", err);
          }
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e: any) {
      setLoading(false);
    }
  }, [docRef]);

  return { data, loading, error };
}
