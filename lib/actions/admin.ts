'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) throw new Error('Unauthorized');
  
  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
  if (decodedToken.role !== 'admin') {
    throw new Error('Forbidden: Admin privileges required.');
  }
  return decodedToken;
}

export async function approveUser(targetUid: string) {
  try {
    const adminToken = await verifyAdmin();

    await adminAuth.setCustomUserClaims(targetUid, { role: 'student', status: 'approved' });
    await adminFirestore.collection('users').doc(targetUid).update({
      status: 'approved', approvedAt: FieldValue.serverTimestamp(), approvedBy: adminToken.uid,
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectUser(targetUid: string, reason: string) {
  try {
    await verifyAdmin();

    await adminAuth.setCustomUserClaims(targetUid, { role: 'student', status: 'rejected' });
    await adminFirestore.collection('users').doc(targetUid).update({
      status: 'rejected', rejectionReason: reason,
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveQuiz(quizId: string | null, metadata: any, questions: any[]) {
  try {
    const adminToken = await verifyAdmin();
    const batch = adminFirestore.batch();
    
    let docRef;
    let newVersion = 1;

    if (quizId) {
      docRef = adminFirestore.collection('quizzes').doc(quizId);
      const snap = await docRef.get();
      if (!snap.exists) throw new Error("Quiz not found");
      const existingData = snap.data();
      newVersion = (existingData?.version || 0) + 1;
    } else {
      docRef = adminFirestore.collection('quizzes').doc();
      metadata.createdAt = FieldValue.serverTimestamp();
      metadata.createdBy = adminToken.uid;
    }

    batch.set(docRef, {
      ...metadata,
      questionCount: questions.length,
      updatedAt: FieldValue.serverTimestamp(),
      version: newVersion,
    }, { merge: true });

    if (quizId) {
      const existingQs = await docRef.collection('questions').get();
      existingQs.forEach(doc => { batch.delete(doc.ref); });
    }

    questions.forEach((q, index) => {
      const qRef = docRef.collection('questions').doc();
      batch.set(qRef, { order: index, text: q.text, options: q.options, correctOptionId: q.correctOptionId, points: q.points || 1 });
    });

    await batch.commit();
    revalidatePath('/admin/quizzes');
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
