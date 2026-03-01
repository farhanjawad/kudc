import { NextResponse } from 'next/server';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  
  if (!uid) return NextResponse.json({ error: 'Missing UID in URL' });
  
  try {
    await adminAuth.setCustomUserClaims(uid, { role: 'admin', status: 'approved' });
    await adminFirestore.collection('users').doc(uid).update({ role: 'admin', status: 'approved' });
    return NextResponse.json({ success: true, message: `Successfully made ${uid} an admin!` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
