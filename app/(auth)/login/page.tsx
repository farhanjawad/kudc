'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/client';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createSessionCookie } from '@/lib/actions/auth';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSuccess = async (user: any) => {
    try {
      // Force refresh the token to grab the latest server-side claims
      const tokenResult = await user.getIdTokenResult(true); 
      const sessionResult = await createSessionCookie(tokenResult.token);
      
      if (!sessionResult.success) throw new Error('Failed to establish secure session.');

      // ADMIN CHECK: If the user has the admin claim, send them straight to the admin console!
      if (tokenResult.claims.role === 'admin') {
        router.push('/admin/dashboard');
        return; // Stop execution here for admins so it doesn't query the students table
      }

      // Normal Student Flow
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        router.push('/complete-profile');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true); setError('');

    try {
      // Wait for Firebase internal IndexedDB storage to initialize completely
      if (auth.authStateReady) await auth.authStateReady();

      let userCredential;
      if (isLogin) userCredential = await signInWithEmailAndPassword(auth, email, password);
      else userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await handleAuthSuccess(userCredential.user);
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (isLoading) return;
    setIsLoading(true); setError('');
    
    try {
      // Wait for Firebase internal IndexedDB storage to initialize completely
      if (auth.authStateReady) await auth.authStateReady();

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleAuthSuccess(userCredential.user);
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputClass = "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors";
  const btnClass = "inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full transition-colors disabled:opacity-50 shadow-sm hover:shadow-md";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{isLogin ? 'Welcome back' : 'Create an account'}</h1>
          <p className="text-sm text-slate-500 mt-2">Sign in to access the Learning Management System</p>
        </div>

        {error && <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100 break-word">{error}</div>}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div><label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="student@institute.edu" /></div>
          <div><label className="text-sm font-semibold text-slate-700 mb-1.5 block">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" /></div>
          <button type="submit" disabled={isLoading} className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700 mt-2`}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-7"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span></div></div>

        <button onClick={handleGoogleAuth} disabled={isLoading} type="button" className={`${btnClass} border border-slate-200 bg-white hover:bg-slate-50 text-slate-700`}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          Google
        </button>

        <div className="mt-8 text-center text-sm">
          <span className="text-slate-500">{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-semibold text-blue-600 hover:text-blue-500">{isLogin ? 'Sign up' : 'Sign in'}</button>
        </div>
      </div>
    </div>
  );
}