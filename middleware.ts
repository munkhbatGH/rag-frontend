import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get(process.env.NEXT_PUBLIC_TOKEN || 'rag-token');
  const path = req.nextUrl.pathname;
  const isProtected = path.startsWith('/admin');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
