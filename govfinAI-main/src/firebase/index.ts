'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase and provides a robust mock system.
 * This ensures the app doesn't crash even if the Firebase configuration is invalid or missing.
 */
export function initializeFirebase(): { app: FirebaseApp; db: Firestore; auth: Auth } {
  let app: any;
  let db: any;
  let auth: any;
  
  // Standardized Mock Auth User for Demo Mode
  const mockUser = {
    uid: 'public-demo-user',
    displayName: 'Gov Visitor',
    email: 'visitor@govfin.ai',
    photoURL: 'https://picsum.photos/seed/visitor/100/100',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({}) as any,
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
  };

  try {
    const isValidConfig = firebaseConfig.projectId && firebaseConfig.projectId !== "undefined" && firebaseConfig.apiKey !== "placeholder-api-key";
    
    if (isValidConfig) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
    } else {
      console.warn("Firebase configuration is missing or invalid. Running in demo mode.");
      app = { options: {} } as any;
      // Marker on the db object so hooks and components know it's a mock
      db = { __isMock: true, type: 'firestore', _databaseId: { projectId: 'demo' } } as any;
      auth = { app, currentUser: mockUser } as any;
    }
  } catch (error) {
    console.error("Firebase Services failed to initialize:", error);
    app = { options: {} } as any;
    db = { __isMock: true, type: 'firestore' } as any;
    auth = { app, currentUser: mockUser } as any;
  }
  
  // Ensure auth object has necessary methods for hooks even in mock mode
  if (!auth.onAuthStateChanged) {
    auth.onAuthStateChanged = (callback: any) => {
      callback(mockUser);
      return () => {};
    };
  }

  if (!auth.signOut) {
    auth.signOut = async () => Promise.resolve();
  }

  return { app, db, auth: auth as Auth };
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';