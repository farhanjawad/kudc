'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

async function getSession() {
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) throw new Error('Unauthorized');
  return await adminAuth.verifySessionCookie(sessionCookie, true);
}

export async function startAttempt(quizId: string) {
  try {
    const decodedToken = await getSession();
    const uid = decodedToken.uid;

    const quizRef = adminFirestore.collection('quizzes').doc(quizId);
    const quizSnap = await quizRef.get();

    if (!quizSnap.exists) throw new Error('Quiz not found');
    const quiz = quizSnap.data() as any;

    if (quiz.status !== 'published') throw new Error('Quiz is not available');

    const existingAttempts = await adminFirestore.collection('attempts')
      .where('uid', '==', uid).where('quizId', '==', quizId).where('status', '==', 'in-progress').get();

    if (!existingAttempts.empty) return { success: true, attemptId: existingAttempts.docs[0].id };

    const attemptRef = adminFirestore.collection('attempts').doc();
    await attemptRef.set({
      uid, quizId, quizVersion: quiz.version, startedAt: FieldValue.serverTimestamp(),
      status: 'in-progress', answers: {}, focusLossEvents: [], autoSubmitted: false,
    });

    return { success: true, attemptId: attemptRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitAttempt(attemptId: string, autoSubmitted: boolean = false) {
  try {
    const decodedToken = await getSession();
    const attemptRef = adminFirestore.collection('attempts').doc(attemptId);
    const attemptSnap = await attemptRef.get();

    if (!attemptSnap.exists) throw new Error('Attempt not found');
    const attempt = attemptSnap.data() as any;

    if (attempt.uid !== decodedToken.uid) throw new Error('Unauthorized');
    if (attempt.status !== 'in-progress') throw new Error('Attempt already submitted');

    const quizRef = adminFirestore.collection('quizzes').doc(attempt.quizId);
    const quizSnap = await quizRef.get();
    const quiz = quizSnap.data() as any;

    const now = Date.now();
    const startedAt = attempt.startedAt.toMillis();
    const elapsedSeconds = Math.floor((now - startedAt) / 1000);
    const allowedSeconds = (quiz.timeLimit * 60) + 30;

    let finalStatus = 'submitted';
    if (elapsedSeconds > allowedSeconds) finalStatus = 'timed-out';

    const draftsSnap = await attemptRef.collection('draft_responses').get();
    const finalAnswers: Record<string, string> = {};
    draftsSnap.forEach(doc => { finalAnswers[doc.id] = doc.data().selectedOptionId; });

    const questionsSnap = await quizRef.collection('questions').get();
    let score = 0;
    let maxScore = 0;

    questionsSnap.forEach(doc => {
      const q = doc.data();
      maxScore += q.points;
      if (finalAnswers[doc.id] === q.correctOptionId) score += q.points;
    });

    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const passed = percentage >= quiz.passingScore;

    await attemptRef.update({
      status: finalStatus, answers: finalAnswers, score: percentage, passed,
      timeTakenSeconds: Math.min(elapsedSeconds, quiz.timeLimit * 60),
      submittedAt: FieldValue.serverTimestamp(), autoSubmitted,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
