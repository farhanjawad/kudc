import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';
import { ExamCanvas } from '@/components/exam/ExamCanvas';

export const dynamic = 'force-dynamic';

export default async function AttemptPage({ params, searchParams }: { params: { quizId: string }, searchParams: { attemptId: string } }) {
  if (!searchParams.attemptId) redirect(`/quiz/${params.quizId}`);
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) redirect('/login');
  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

  const attemptSnap = await adminFirestore.collection('attempts').doc(searchParams.attemptId).get();
  const quizSnap = await adminFirestore.collection('quizzes').doc(params.quizId).get();
  if (!attemptSnap.exists || !quizSnap.exists) redirect('/dashboard');
  
  const attempt = attemptSnap.data() as any;
  if (attempt.uid !== decodedToken.uid || attempt.status !== 'in-progress') redirect('/dashboard');

  const questionsSnap = await adminFirestore.collection('quizzes').doc(params.quizId).collection('questions').orderBy('order', 'asc').get();
  const questions = questionsSnap.docs.map(doc => ({ id: doc.id, text: doc.data().text, options: doc.data().options }));

  const draftsSnap = await adminFirestore.collection('attempts').doc(searchParams.attemptId).collection('draft_responses').get();
  const initialAnswers: Record<string, string> = {};
  draftsSnap.forEach(doc => { initialAnswers[doc.id] = doc.data().selectedOptionId; });

  return <ExamCanvas attemptId={searchParams.attemptId} quiz={{ id: quizSnap.id, ...quizSnap.data() }} questions={questions} initialAnswers={initialAnswers} startedAtMs={attempt.startedAt.toMillis()} />;
}
