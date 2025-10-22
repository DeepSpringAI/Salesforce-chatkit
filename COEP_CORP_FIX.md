# COEP/CORP Error Fix

This document explains the changes made to resolve the "COEP/CORP Error: ChatKit iframe blocked from loading sentinel frame" issue and the "ChatKit web component is unavailable" error.

## Problems

1. The ChatKit iframe was being blocked due to missing or incorrect Cross-Origin Embedder Policy (COEP) and Cross-Origin Resource Policy (CORP) headers.
2. The ChatKit script was failing to load due to overly restrictive Content Security Policy (CSP) headers.
3. The sentinel frame (`https://sentinel.openai.com/backend-api/sentinel/frame.html`) was failing to load due to CSP restrictions.
4. Cloudflare challenge scripts (`https://sentinel.openai.com/cdn-cgi/challenge-platform/scripts/jsd/main.js`) were being blocked.
5. Sentinel API requests (`https://sentinel.openai.com/backend-api/sentinel/req`) were failing due to CSP restrictions.

## Solution

### 1. Middleware Configuration (`middleware.ts`)

Created a Next.js middleware file that sets the required headers for all requests:

- `Cross-Origin-Embedder-Policy: unsafe-none` (changed from `require-corp` for ChatKit compatibility)
- `Cross-Origin-Resource-Policy: cross-origin`
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.platform.openai.com https://*.openai.com https://sentinel.openai.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://*.openai.com https://sentinel.openai.com; frame-ancestors 'self' https://*.openai.com https://*.platform.openai.com; frame-src 'self' https://*.openai.com https://*.platform.openai.com https://sentinel.openai.com; worker-src 'self' https://sentinel.openai.com;`
- Removed `X-Frame-Options` to allow iframe embedding (CSP frame-src handles this)

### 2. Next.js Configuration (`next.config.ts`)

Updated the Next.js configuration to include headers configuration that applies the same headers at the application level.

### 3. API Route Updates (`app/api/create-session/route.ts`)

Updated the API route to include proper CORS headers in all responses:

- Added CORS headers to all response functions
- Added OPTIONS handler for preflight requests
- Updated error responses to include CORS headers
- Changed COEP policy to `unsafe-none` for ChatKit compatibility

### 4. Test Pages (`public/test-chatkit.html` and `public/test-sentinel.html`)

Created test pages to verify ChatKit script loading and all sentinel endpoints work correctly.

## Testing

Use the provided test script to verify headers are properly set:

```bash
# Start the development server
npm run dev

# In another terminal, test the headers
node test-headers.js http://localhost:3000

# Test ChatKit script loading
# Open http://localhost:3000/test-chatkit.html in your browser

# Test all sentinel endpoints
# Open http://localhost:3000/test-sentinel.html in your browser
```

## Headers Explained

- **COEP (Cross-Origin Embedder Policy)**: Changed to `unsafe-none` to allow ChatKit script loading
- **CORP (Cross-Origin Resource Policy)**: Specifies which resources can be loaded by the page from external origins
- **CORS Headers**: Allow cross-origin requests from browsers
- **CSP (Content Security Policy)**: Updated to allow ChatKit script loading from `cdn.platform.openai.com`, sentinel frame from `sentinel.openai.com`, and Cloudflare challenge scripts with `unsafe-eval` for dynamic script execution
- **Worker-src**: Added to allow service workers from sentinel domain
- **X-Frame-Options**: Removed to allow iframe embedding (CSP frame-src handles this)

## Security Considerations

The current configuration allows cross-origin access (`Access-Control-Allow-Origin: *`) and uses `unsafe-none` for COEP. In production, you may want to restrict this to specific domains:

```javascript
"Access-Control-Allow-Origin": "https://yourdomain.com"
```

## Files Modified

1. `middleware.ts` - New file for request-level header configuration
2. `next.config.ts` - Updated with headers configuration
3. `app/api/create-session/route.ts` - Updated with CORS headers
4. `test-headers.js` - New test script for verifying headers
5. `public/test-chatkit.html` - New test page for ChatKit script loading
6. `public/test-sentinel.html` - New comprehensive test page for all sentinel endpoints
7. `COEP_CORP_FIX.md` - This documentation file
