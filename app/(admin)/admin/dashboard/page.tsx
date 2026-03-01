import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) redirect('/login');
  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
  if (decodedToken.role !== 'admin') redirect('/dashboard');

  const [usersSnap, quizzesSnap] = await Promise.all([
    adminFirestore.collection('users').get(),
    adminFirestore.collection('quizzes').get()
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded shadow text-xl">Total Users: {usersSnap.size}</div>
        <div className="p-6 bg-white rounded shadow text-xl">Total Quizzes: {quizzesSnap.size}</div>
      </div>
    </div>
  );
}
