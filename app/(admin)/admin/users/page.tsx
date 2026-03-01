'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/client';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { approveUser, rejectUser } from '@/lib/actions/admin';
import { Check, X, Loader2 } from 'lucide-react';

export default function UserManagementPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (uid: string) => { setProcessingId(uid); await approveUser(uid); setProcessingId(null); };
  const handleReject = async (uid: string) => { const r = prompt("Reason:"); if (r) { setProcessingId(uid); await rejectUser(uid, r); setProcessingId(null); } };

  if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div><h1 className="text-3xl font-bold">User Management</h1><p className="text-slate-500">Review and approve new students.</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {pendingUsers.length === 0 ? <div className="p-12 text-center text-slate-500">No pending registrations.</div> : (
          <table className="w-full text-sm text-left"><thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b"><tr><th className="px-6 py-4">Student</th><th className="px-6 py-4">ID & Discipline</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
          <tbody>{pendingUsers.map(user => (
            <tr key={user.id} className="border-b"><td className="px-6 py-4"><div className="font-medium">{user.name}</div><div className="text-slate-500">{user.email}</div></td>
            <td className="px-6 py-4"><div className="font-medium">{user.studentId}</div><div className="text-slate-500">{user.discipline}</div></td>
            <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleReject(user.id)} disabled={processingId === user.id} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><X className="w-5 h-5" /></button><button onClick={() => handleApprove(user.id)} disabled={processingId === user.id} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">{processingId === user.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}</button></div></td></tr>
          ))}</tbody></table>
        )}
      </div>
    </div>
  );
}
