#!/usr/bin/env node

/**
 * Test script to verify COEP/CORP headers are properly configured
 * Run this after starting the development server to check headers
 */

const https = require('https');
const http = require('http');

const testUrl = process.argv[2] || 'http://localhost:3000';

console.log(`Testing COEP/CORP headers for: ${testUrl}`);
console.log('='.repeat(50));

const client = testUrl.startsWith('https') ? https : http;

const req = client.request(testUrl, { method: 'HEAD' }, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:');
  console.log('-'.repeat(30));
  
  const headers = res.headers;
  const requiredHeaders = [
    'cross-origin-embedder-policy',
    'cross-origin-resource-policy',
    'access-control-allow-origin',
    'access-control-allow-methods',
    'access-control-allow-headers',
    'content-security-policy',
    'x-frame-options'
  ];
  
  requiredHeaders.forEach(header => {
    const value = headers[header];
    if (value) {
      console.log(`✅ ${header}: ${value}`);
    } else {
      console.log(`❌ ${header}: MISSING`);
    }
  });
  
  console.log('\nAll headers:');
  Object.keys(headers).forEach(key => {
    console.log(`${key}: ${headers[key]}`);
  });
});

req.on('error', (err) => {
  console.error('Error testing headers:', err.message);
  console.log('\nMake sure the development server is running:');
  console.log('npm run dev');
});

req.end();
