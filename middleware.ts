import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// Route groups
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Routes that require the user to be LOGGED IN.
 * The middleware redirects unauthenticated visitors to /login.
 */
const PROTECTED_PATHS = [
    '/dashboard',
    '/profile',
    '/my-courses',
    '/settings',
    '/admin',
];

/**
 * Routes that should only be accessible to GUESTS (not logged-in users).
 * Already authenticated visitors are redirected to /dashboard.
 */
const AUTH_PATHS = [
    '/login',
    '/signup',
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper – read the auth token from cookies OR the Authorization header
// ─────────────────────────────────────────────────────────────────────────────
function getToken(req: NextRequest): string | null {
    // 1. Prefer HttpOnly cookie set by the server after login
    const cookieToken = req.cookies.get('oit_auth_token')?.value;
    if (cookieToken) return cookieToken;

    // 2. Fall back to Bearer token in Authorization header (API clients / SSR)
    const authHeader = req.headers.get('authorization') ?? '';
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }

    return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────
export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = getToken(req);
    const isAuthenticated = Boolean(token);

    // ── Guard: protected routes ──────────────────────────────────────────────
    const isProtected = PROTECTED_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    );

    if (isProtected && !isAuthenticated) {
        const loginUrl = req.nextUrl.clone();
        // Redirect to /admin-login if it's an admin route, otherwise /login
        loginUrl.pathname = pathname.startsWith('/admin') ? '/admin-login' : '/login';
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── Guard: auth-only routes (guests only) ────────────────────────────────
    const isAuthRoute = AUTH_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    );

    if (isAuthRoute && isAuthenticated) {
        const dashboardUrl = req.nextUrl.clone();
        dashboardUrl.pathname = '/dashboard';
        dashboardUrl.search = '';
        return NextResponse.redirect(dashboardUrl);
    }

    // ── All other routes – pass through ─────────────────────────────────────
    return NextResponse.next();
}

// ─────────────────────────────────────────────────────────────────────────────
// Matcher – only run middleware on relevant paths (skip static assets / API)
// ─────────────────────────────────────────────────────────────────────────────
export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT for:
         *  - _next/static  (static files)
         *  - _next/image   (image optimisation)
         *  - favicon.ico
         *  - public folder files (svg, png, jpg, …)
         *  - /api routes   (handled by route handlers)
         */
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
    ],
};
