import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export default async function ResultPage({ params, searchParams }: { params: { quizId: string }, searchParams: { attemptId: string } }) {
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) redirect('/login');
  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

  const attemptSnap = await adminFirestore.collection('attempts').doc(searchParams.attemptId).get();
  const attempt = attemptSnap.data() as any;
  if (attempt.uid !== decodedToken.uid) redirect('/dashboard');

  const quizSnap = await adminFirestore.collection('quizzes').doc(params.quizId).get();
  const quiz = quizSnap.data() as any;

  return (
    <div className="min-h-screen bg-slate-50 py-12 flex justify-center items-center">
      <div className="bg-white p-12 rounded-xl text-center shadow">
        <h1 className="text-3xl font-bold mb-4">{attempt.passed ? 'Passed!' : 'Failed'}</h1>
        <p className="text-xl mb-8">Score: {attempt.score}%</p>
        <Link href="/dashboard"><button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold">Back to Dashboard</button></Link>
      </div>
    </div>
  );
}
