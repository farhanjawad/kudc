import { NextRequest } from 'next/server';

export interface DecodedFirebaseToken {
  uid: string;
  email?: string;
  role?: 'student' | 'admin';
  status?: 'pending' | 'approved' | 'rejected';
  [key: string]: unknown;
}

export async function verifyFirebaseToken(request: NextRequest): Promise<DecodedFirebaseToken | null> {
  const sessionCookie = request.cookies.get('__session')?.value;
  if (!sessionCookie) return null;

  try {
    const parts = sessionCookie.split('.');
    if (parts.length !== 3) return null;

    const payloadBuffer = Buffer.from(parts[1], 'base64url');
    const payloadText = payloadBuffer.toString('utf-8');
    const decodedToken = JSON.parse(payloadText) as DecodedFirebaseToken;

    if (decodedToken.exp && Date.now() >= (decodedToken.exp as number) * 1000) {
      return null;
    }

    return {
      uid: decodedToken.user_id as string,
      email: decodedToken.email,
      role: decodedToken.role,
      status: decodedToken.status,
    };
  } catch (error) {
    console.error('Failed to parse Firebase token in Edge:', error);
    return null;
  }
}
