import crypto from 'crypto';

export function getClientIP(headers: Headers): string {
  return headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown';
}

export function getUserAgent(headers: Headers): string {
  return headers.get('user-agent') || 'unknown';
}

export function generateAnonymousHash(ip: string, userAgent: string, propertyId: string): string {
  return crypto.createHash('sha256').update(`${ip}-${userAgent}-${propertyId}`).digest('hex');
}
