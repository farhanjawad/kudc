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
