import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { ValidationType } from '@prisma/client';

/**
 * Submit anonymous validation comment about a property
 */
export async function POST(request: NextRequest) {
  try {
    const {
      propertyId,
      validationType,
      comment,
      isLocationCorrect,
      isPriceCorrect,
      suggestedPrice,
      userLatitude,
      userLongitude
    } = await request.json();

    if (!propertyId || !validationType) {
      return NextResponse.json(
        { error: 'Property ID and validation type are required' },
        { status: 400 }
      );
    }

    // Get property location to verify user is within 5km
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { latitude: true, longitude: true, title: true }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Calculate distance if user location provided
    if (userLatitude && userLongitude) {
      const distance = calculateDistance(
        userLatitude,
        userLongitude,
        property.latitude,
        property.longitude
      );

      if (distance > 5) {
        return NextResponse.json(
          { error: 'You must be within 5km to validate this property' },
          { status: 403 }
        );
      }
    }

    // Generate anonymous hash to prevent duplicate comments
    const anonymousHash = generateAnonymousHash(
      propertyId,
      userLatitude || 0,
      userLongitude || 0,
      validationType
    );

    // Check if user already commented on this validation type
    const existingComment = await prisma.propertyValidationComment.findUnique({
      where: { anonymousHash }
    });

    if (existingComment) {
      return NextResponse.json(
        { error: 'You have already submitted this type of validation for this property' },
        { status: 409 }
      );
    }

    // Create validation comment
    await prisma.propertyValidationComment.create({
      data: {
        propertyId,
        anonymousHash,
        validationType: validationType as ValidationType,
        comment: comment || null,
        isLocationCorrect: isLocationCorrect ?? null,
        isPriceCorrect: isPriceCorrect ?? null,
        suggestedPrice: suggestedPrice || null,
        isVisible: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Validation comment submitted successfully'
    });

  } catch (error) {
    console.error('Validation comment error:', error);
    return NextResponse.json(
      { error: 'Failed to submit validation comment' },
      { status: 500 }
    );
  }
}

/**
 * Get validation comments for a property (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Get validation comments
    const comments = await prisma.propertyValidationComment.findMany({
      where: {
        propertyId,
        isVisible: true
      },
      select: {
        id: true,
        validationType: true,
        comment: true,
        isLocationCorrect: true,
        isPriceCorrect: true,
        suggestedPrice: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group comments by validation type
    const groupedComments = comments.reduce((acc, comment) => {
      const type = comment.validationType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(comment);
      return acc;
    }, {} as Record<string, typeof comments>);

    // Calculate summary statistics
    const summary = {
      totalComments: comments.length,
      locationAccurate: comments.filter(c => c.isLocationCorrect === true).length,
      locationInaccurate: comments.filter(c => c.isLocationCorrect === false).length,
      priceAccurate: comments.filter(c => c.isPriceCorrect === true).length,
      priceInaccurate: comments.filter(c => c.isPriceCorrect === false).length,
      averageSuggestedPrice: comments
        .filter(c => c.suggestedPrice)
        .reduce((sum, c) => sum + (c.suggestedPrice || 0), 0) / 
        Math.max(1, comments.filter(c => c.suggestedPrice).length)
    };

    return NextResponse.json({
      comments: groupedComments,
      summary
    });

  } catch (error) {
    console.error('Get validation comments error:', error);
    return NextResponse.json(
      { error: 'Failed to get validation comments' },
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
 * Generate anonymous hash for validation comments
 */
function generateAnonymousHash(
  propertyId: string,
  lat: number,
  lng: number,
  validationType: string
): string {
  const secret = process.env.OPINION_ADMIN_SECRET || 'default-secret-change-this';
  
  // Create hash that includes rounded location and validation type
  const locationHash = crypto
    .createHash('sha256')
    .update(`${Math.round(lat * 1000)}:${Math.round(lng * 1000)}:${propertyId}:${validationType}:${secret}`)
    .digest('hex');
  
  return locationHash;
}