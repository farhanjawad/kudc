'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/client';
import { clearSessionCookie } from '@/lib/actions/auth';
import { Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await auth.signOut();
      await clearSessionCookie();
      router.push('/login');
    };
    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
      <h1 className="text-xl font-bold text-slate-900">Signing you out...</h1>
    </div>
  );
}
