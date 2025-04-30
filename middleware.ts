import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/login'];

// Paths that require specific roles
const roleRestrictedPaths = {
  '/admin1': ['ADMIN'],
  // '/dashboard/admin': ['ADMIN'],
  // '/user-management': ['ADMIN'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (
    publicPaths.some(
      (path) => pathname === path || pathname.startsWith(path + '/')
    )
  ) {
    return NextResponse.next();
  }

  // Check for API routes - we typically don't protect these with middleware
  // as they handle their own auth
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check if assets, images, or _next paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.') // Static files usually have extensions
  ) {
    return NextResponse.next();
  }

  // Get user token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If the user is not logged in and trying to access a protected route
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Check role restrictions for certain paths
  for (const [path, allowedRoles] of Object.entries(roleRestrictedPaths)) {
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      const userRole = token.role as string;

      if (!allowedRoles.includes(userRole)) {
        // Redirect to dashboard if role doesn't match
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // If everything checks out, proceed to the requested page
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images).*)'],
};
