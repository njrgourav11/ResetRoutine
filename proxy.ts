import { NextResponse } from 'next/server';

// Auth state is managed client-side via Firebase Auth.
// This proxy just ensures all routes pass through without server-side blocking.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

