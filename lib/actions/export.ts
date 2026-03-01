'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';
import { profileSchema, ProfileFormValues } from '@/lib/validators/profile';

export async function createSessionCookie(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const cookieStore = await cookies();
    cookieStore.set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('__session');
  return { success: true };
}

export async function completeUserProfile(data: ProfileFormValues, uid: string) {
  try {
    const validatedData = profileSchema.parse(data);

    const existingStudentQuery = await adminFirestore
      .collection('users')
      .where('studentId', '==', validatedData.studentId)
      .get();

    if (!existingStudentQuery.empty) {
      return { success: false, error: 'Student ID is already registered.' };
    }

    await adminFirestore.collection('users').doc(uid).set({
      uid,
      ...validatedData,
      status: 'pending',
      role: 'student',
      createdAt: new Date(),
    });

    await adminAuth.setCustomUserClaims(uid, {
      role: 'student',
      status: 'pending',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Profile completion error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function generateResultsCSV(quizId?: string) {
  try {
    let attemptsQuery: FirebaseFirestore.Query = adminFirestore.collection('attempts')
      .where('status', 'in', ['submitted', 'timed-out']);

    if (quizId) {
      attemptsQuery = attemptsQuery.where('quizId', '==', quizId);
    }

    const attemptsSnap = await attemptsQuery.get();
    
    if (attemptsSnap.empty) {
      return { success: false, error: 'No completed attempts found.' };
    }

    const userIds = [...new Set(attemptsSnap.docs.map(d => d.data().uid))];
    const quizIds = [...new Set(attemptsSnap.docs.map(d => d.data().quizId))];

    const usersSnap = await adminFirestore.collection('users').where('uid', 'in', userIds).get();
    const quizzesSnap = await adminFirestore.collection('quizzes').where('__name__', 'in', quizIds).get();

    const userMap = new Map(usersSnap.docs.map(d => [d.id, d.data()]));
    const quizMap = new Map(quizzesSnap.docs.map(d => [d.id, d.data()]));

    const headers = ['Student Name', 'Student ID', 'Discipline', 'Quiz Title', 'Score (%)', 'Passed', 'Time Taken (s)', 'Submitted At'];
    const rows = [headers.join(',')];

    attemptsSnap.docs.forEach(doc => {
      const attempt = doc.data();
      const user = userMap.get(attempt.uid) || {};
      const quiz = quizMap.get(attempt.quizId) || {};

      const row = [
        `"${user.name || 'Unknown'}"`,
        `"${user.studentId || 'N/A'}"`,
        `"${user.discipline || 'N/A'}"`,
        `"${quiz.title || 'Unknown Quiz'}"`,
        attempt.score?.toFixed(2) || '0',
        attempt.passed ? 'Yes' : 'No',
        attempt.timeTakenSeconds || '0',
        attempt.submittedAt ? `"${attempt.submittedAt.toDate().toISOString()}"` : 'N/A'
      ];
      rows.push(row.join(','));
    });

    return { success: true, csvString: rows.join('\n') };

  } catch (error: any) {
    console.error('Export CSV error:', error);
    return { success: false, error: error.message };
  }
}