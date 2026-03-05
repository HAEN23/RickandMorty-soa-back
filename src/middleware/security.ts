import { NextRequest, NextResponse } from 'next/server';




const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60000; 
const MAX_REQUESTS_PER_WINDOW = 100; 


export function validateSecurityHeaders(request: NextRequest): NextResponse | null {
  const contentType = request.headers.get('content-type');
  
  
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    if (contentType && !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type debe ser application/json' },
        { status: 415 }
      );
    }
  }

  return null;
}


export function checkRateLimit(request: NextRequest): NextResponse | null {
  
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
  const now = Date.now();
  
  const rateLimitData = rateLimitMap.get(ip);
  
  if (!rateLimitData || now > rateLimitData.resetTime) {
    
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return null;
  }
  
  if (rateLimitData.count >= MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json(
      { error: 'Demasiadas peticiones. Intente nuevamente más tarde.' },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitData.resetTime - now) / 1000)),
        },
      }
    );
  }
  
  rateLimitData.count++;
  return null;
}


export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>\"'`]/g, '') 
    .substring(0, 100); 
}


export function securityMiddleware(request: NextRequest): NextResponse | null {
  // Valida headers
  const headerValidation = validateSecurityHeaders(request);
  if (headerValidation) return headerValidation;
  
  
  const rateLimitCheck = checkRateLimit(request);
  if (rateLimitCheck) return rateLimitCheck;
  
  
  return null; 
}


export function getSecurityResponseHeaders(): HeadersInit {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
  };
}
