import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';
import { startAttempt } from '@/lib/actions/quiz';

export const revalidate = 120;

async function getQuizData(quizId: string) {
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) redirect('/login');
  
  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
  
  // URL PROTECTION: If a pending user somehow types this URL, bounce them back!
  if (decodedToken.status !== 'approved') {
    redirect('/dashboard');
  }
  
  const [quizSnap, attemptQuery] = await Promise.all([
    adminFirestore.collection('quizzes').doc(quizId).get(),
    adminFirestore.collection('attempts').where('uid', '==', decodedToken.uid).where('quizId', '==', quizId).get()
  ]);

  if (!quizSnap.exists) return null;
  return {
    quiz: { id: quizSnap.id, ...quizSnap.data() } as any,
    attempt: attemptQuery.empty ? null : { id: attemptQuery.docs[0].id, ...attemptQuery.docs[0].data() } as any
  };
}

export default async function QuizDetailPage({ params }: { params: { quizId: string } }) {
  const data = await getQuizData(params.quizId);
  if (!data) return <div>Quiz not found.</div>;
  
  const { quiz, attempt } = data;
  if (attempt && (attempt.status === 'submitted' || attempt.status === 'timed-out')) redirect(`/quiz/${quiz.id}/result?attemptId=${attempt.id}`);

  const handleStart = async () => {
    'use server';
    const res = await startAttempt(quiz.id);
    if (res.success) redirect(`/quiz/${quiz.id}/attempt?attemptId=${res.attemptId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{quiz.title}</h1>
        <p className="text-slate-600 mb-8">{quiz.description}</p>
        <form action={handleStart}>
          <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">
            {attempt ? 'Resume Assessment' : 'Start Assessment'}
          </button>
        </form>
      </div>
    </div>
  );
}
