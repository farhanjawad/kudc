import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase/admin-edge';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.match(/\.(.*)$/) || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = await verifyFirebaseToken(request);

  const isAdminRoute = pathname.startsWith('/admin');
  const isStudentRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/quiz');
  const isPendingRoute = pathname.startsWith('/pending-approval');
  const isRegistrationRoute = pathname.startsWith('/complete-profile') || pathname.startsWith('/registration-success');

  if (!token) {
    if (isAdminRoute || isStudentRoute || isPendingRoute || isRegistrationRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const { role, status } = token;

  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!status && !isRegistrationRoute && !isAdminRoute) {
    return NextResponse.redirect(new URL('/complete-profile', request.url));
  }

  if (isStudentRoute && status !== 'approved' && role !== 'admin') {
    return NextResponse.redirect(new URL('/pending-approval', request.url));
  }

  if (isPendingRoute && status === 'approved') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
