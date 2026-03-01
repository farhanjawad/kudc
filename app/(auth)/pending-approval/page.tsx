'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/client';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Clock, XCircle, RefreshCcw, LogOut } from 'lucide-react';
import { clearSessionCookie, createSessionCookie } from '@/lib/actions/auth';

export default function PendingApprovalPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return router.push('/login');
      
      const userRef = doc(db, 'users', user.uid);
      unsubscribeSnapshot = onSnapshot(userRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          
          if (data.status === 'approved') {
            // Force refresh the token to grab the 'approved' claim from the server
            const newToken = await auth.currentUser?.getIdToken(true);
            if (newToken) {
              // Sync to the server so Middleware stops blocking us
              await createSessionCookie(newToken); 
            }
            router.push('/dashboard');
          }
        }
        setLoading(false);
      });
    });
    
    return () => { 
      if (unsubscribeAuth) unsubscribeAuth(); 
      if (unsubscribeSnapshot) unsubscribeSnapshot(); 
    };
  }, [router]);

  const handleLogout = async () => {
    if (auth.authStateReady) await auth.authStateReady();
    await auth.signOut();
    await clearSessionCookie();
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><RefreshCcw className="w-8 h-8 animate-spin text-blue-600" /></div>;

  const isRejected = userData?.status === 'rejected';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-100 text-center p-10">
        {isRejected ? <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" /> : <Clock className="w-20 h-20 text-amber-500 mx-auto mb-6" />}
        <h1 className="text-3xl font-bold text-slate-900 mb-3">{isRejected ? 'Application Rejected' : 'Approval Pending'}</h1>
        <p className="text-slate-600 mb-10 leading-relaxed text-sm">
          {isRejected 
            ? `Reason: ${userData?.rejectionReason || 'Please contact administration.'}` 
            : 'Your application is currently under review by the administration. You will be granted access to the assessments once approved.'}
        </p>
        <button onClick={handleLogout} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 flex justify-center items-center transition-colors">
          <LogOut className="w-5 h-5 mr-2" /> Sign Out
        </button>
      </div>
    </div>
  );
}
