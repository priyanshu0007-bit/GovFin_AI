'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Since authentication is removed, the login page now redirects to the dashboard.
 */
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-muted-foreground font-medium">Entering GovFinAI...</p>
      </div>
    </div>
  );
}
