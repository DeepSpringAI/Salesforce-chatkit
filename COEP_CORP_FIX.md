# COEP/CORP Error Fix

This document explains the changes made to resolve the "COEP/CORP Error: ChatKit iframe blocked from loading sentinel frame" issue.

## Problem

The ChatKit iframe was being blocked due to missing or incorrect Cross-Origin Embedder Policy (COEP) and Cross-Origin Resource Policy (CORP) headers.

## Solution

### 1. Middleware Configuration (`middleware.ts`)

Created a Next.js middleware file that sets the required headers for all requests:

- `Cross-Origin-Embedder-Policy: require-corp`
- `Cross-Origin-Resource-Policy: cross-origin`
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- `Content-Security-Policy: frame-ancestors 'self' https://*.openai.com https://*.platform.openai.com; frame-src 'self' https://*.openai.com https://*.platform.openai.com;`
- `X-Frame-Options: SAMEORIGIN`

### 2. Next.js Configuration (`next.config.ts`)

Updated the Next.js configuration to include headers configuration that applies the same headers at the application level.

### 3. API Route Updates (`app/api/create-session/route.ts`)

Updated the API route to include proper CORS headers in all responses:

- Added CORS headers to all response functions
- Added OPTIONS handler for preflight requests
- Updated error responses to include CORS headers

## Testing

Use the provided test script to verify headers are properly set:

```bash
# Start the development server
npm run dev

# In another terminal, test the headers
node test-headers.js http://localhost:3000
```

## Headers Explained

- **COEP (Cross-Origin Embedder Policy)**: Controls which cross-origin resources can be loaded into your page
- **CORP (Cross-Origin Resource Policy)**: Specifies which resources can be loaded by the page from external origins
- **CORS Headers**: Allow cross-origin requests from browsers
- **CSP (Content Security Policy)**: Controls which sources can embed your page in frames
- **X-Frame-Options**: Additional protection against clickjacking

## Security Considerations

The current configuration allows cross-origin access (`Access-Control-Allow-Origin: *`). In production, you may want to restrict this to specific domains:

```javascript
"Access-Control-Allow-Origin": "https://yourdomain.com"
```

## Files Modified

1. `middleware.ts` - New file for request-level header configuration
2. `next.config.ts` - Updated with headers configuration
3. `app/api/create-session/route.ts` - Updated with CORS headers
4. `test-headers.js` - New test script for verifying headers
5. `COEP_CORP_FIX.md` - This documentation file
