import * as admin from 'firebase-admin';
import 'server-only'; 

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const adminAuth = admin.auth();
const adminFirestore = admin.firestore();

export { adminAuth, adminFirestore };

export async function verifyCallerIsAdmin(idToken: string) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  if (decodedToken.role !== 'admin') {
    throw new Error('Unauthorized: Admin privileges required.');
  }
  return decodedToken;
}
