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

    // Only check for duplicate Student IDs if the user is actually a student
    if (validatedData.userType === 'student' && validatedData.studentId) {
      const existingStudentQuery = await adminFirestore
        .collection('users')
        .where('studentId', '==', validatedData.studentId)
        .where('userType', '==', 'student')
        .get();

      if (!existingStudentQuery.empty) {
        return { success: false, error: 'This Student ID is already registered.' };
      }
    }

    // CORE LOGIC: Auto-approve if they are NOT buying the book
    // If they ARE buying the book, put them in 'pending' so an admin can verify the TrxID
    const assignedStatus = validatedData.wantsToBuyBook ? 'pending' : 'approved';

    // Build the document safely to avoid Firestore "undefined" errors
    const docData = {
      uid,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      gender: validatedData.gender,
      discipline: validatedData.discipline,
      userType: validatedData.userType,
      wantsToBuyBook: validatedData.wantsToBuyBook,
      studentId: validatedData.studentId || null,
      designation: validatedData.designation || null,
      transactionId: validatedData.transactionId || null,
      status: assignedStatus,
      role: 'student', // 'student' here just means "examinee" (non-admin) in our system
      createdAt: new Date(),
    };

    // Save to Firestore
    await adminFirestore.collection('users').doc(uid).set(docData);

    // Set Custom Claims for Middleware Routing
    await adminAuth.setCustomUserClaims(uid, {
      role: 'student',
      status: assignedStatus,
    });

    return { success: true, status: assignedStatus };
  } catch (error: any) {
    console.error('Profile completion error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
