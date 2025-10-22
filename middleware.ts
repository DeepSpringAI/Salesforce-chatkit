import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next()

  // Set COEP (Cross-Origin Embedder Policy) header
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')

  // Set CORP (Cross-Origin Resource Policy) header
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')

  // Set additional CORS headers for iframe compatibility
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Set Content Security Policy to allow iframe embedding
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.openai.com https://*.platform.openai.com; frame-src 'self' https://*.openai.com https://*.platform.openai.com;"
  )

  // Set X-Frame-Options to allow embedding
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
