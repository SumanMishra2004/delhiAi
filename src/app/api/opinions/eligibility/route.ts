import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * Check if user is eligible to vote on property (within 5km radius)
 * Returns anonymous token if eligible
 */
export async function POST(request: NextRequest) {
  try {
    const { propertyId, userLatitude, userLongitude } = await request.json();

    if (!propertyId || !userLatitude || !userLongitude) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get property location
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { latitude: true, longitude: true, title: true }
    });

    if (!property || !property.latitude || !property.longitude) {
      return NextResponse.json(
        { error: 'Property not found or location not available' },
        { status: 404 }
      );
    }

    // Calculate distance using Haversine formula
    const distance = calculateDistance(
      userLatitude,
      userLongitude,
      property.latitude,
      property.longitude
    );

    const RADIUS_KM = 5; // 5km radius
    const isEligible = distance <= RADIUS_KM;

    if (!isEligible) {
      return NextResponse.json({
        isEligible: false,
        distanceKm: Math.round(distance * 100) / 100,
        reason: `You are ${Math.round(distance * 100) / 100}km away. Only neighbors within ${RADIUS_KM}km can vote.`
      });
    }

    // Generate anonymous token (expires in 1 hour)
    const anonymousToken = generateAnonymousToken(propertyId, userLatitude, userLongitude);

    return NextResponse.json({
      isEligible: true,
      distanceKm: Math.round(distance * 100) / 100,
      anonymousToken,
      expiresIn: 3600 // 1 hour
    });

  } catch (error) {
    console.error('Eligibility check error:', error);
    return NextResponse.json(
      { error: 'Failed to check eligibility' },
      { status: 500 }
    );
  }
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Generate anonymous token that can be verified but doesn't reveal identity
 */
function generateAnonymousToken(propertyId: string, lat: number, lng: number): string {
  const secret = process.env.OPINION_ADMIN_SECRET || 'default-secret-change-this';
  const timestamp = Date.now();
  const expiresAt = timestamp + (60 * 60 * 1000); // 1 hour
  
  // Create a hash that includes location (rounded to protect privacy) and property
  const locationHash = crypto
    .createHash('sha256')
    .update(`${Math.round(lat * 1000)}:${Math.round(lng * 1000)}:${propertyId}`)
    .digest('hex')
    .substring(0, 16);
  
  // Create token with expiration
  const tokenData = {
    propertyId,
    locationHash,
    expiresAt,
    timestamp
  };
  
  const tokenString = JSON.stringify(tokenData);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(tokenString)
    .digest('hex');
  
  // Return base64 encoded token
  return Buffer.from(`${tokenString}.${signature}`).toString('base64');
}