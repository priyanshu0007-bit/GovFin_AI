
'use client';

import { initializeFirebase } from '@/firebase';

// Redirect to unified initialization to avoid double-init issues
const { app, db, auth } = initializeFirebase();
const storage = null; // Storage not yet initialized in standardized setup

export { app, auth, db, storage };
