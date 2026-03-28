'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

// Generate anonymous hash for user to prevent double voting
// Uses IP + User Agent + Property ID + Salt for anonymity
function generateAnonymousHash(propertyId: string, userIdentifier: string): string {
  const salt = process.env.OPINION_ADMIN_SECRET || 'default-salt';
  return crypto
    .createHash('sha256')
    .update(`${propertyId}-${userIdentifier}-${salt}`)
    .digest('hex');
}

export async function submitPriceOpinion(
  propertyId: string,
  opinionTag: 'OVER_PRICED' | 'FAIR_PRICE' | 'UNDER_PRICED',
  userIdentifier: string // IP + User Agent hash from client
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    // Check if user has location set
    if (!user.latitude || !user.longitude) {
      return { success: false, error: 'Please update your location first to submit opinions' };
    }

    // Check if property exists and is in PENDING status
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { 
        id: true, 
        status: true, 
        latitude: true, 
        longitude: true,
        verificationStatus: true
      }
    });

    if (!property) {
      return { success: false, error: 'Property not found' };
    }

    if (property.verificationStatus !== 'PENDING') {
      return { success: false, error: 'Property is not accepting opinions' };
    }

    // Verify user is within radius (5km) - using PostGIS
    const isNearby = await prisma.$queryRaw<Array<{ nearby: boolean }>>`
      SELECT ST_DWithin(
        ST_SetSRID(ST_MakePoint(${user.longitude}, ${user.latitude}), 4326)::geography,
        ST_SetSRID(ST_MakePoint(${property.longitude}, ${property.latitude}), 4326)::geography,
        5000
      ) as nearby
    `;

    console.log('Proximity check:', {
      userId: user.id,
      userLocation: { lat: user.latitude, lng: user.longitude },
      propertyLocation: { lat: property.latitude, lng: property.longitude },
      isNearby: isNearby[0]?.nearby
    });

    if (!isNearby[0]?.nearby) {
      return { success: false, error: 'You must be within 5km to submit opinion. Please update your location if you have moved.' };
    }

    // Generate anonymous hash
    const anonymousHash = generateAnonymousHash(propertyId, userIdentifier);

    // Check if already voted
    const existingVote = await prisma.opinionVote.findUnique({
      where: { anonymousHash }
    });

    if (existingVote) {
      return { success: false, error: 'You have already submitted your opinion' };
    }

    // Get or create opinion group
    let opinionGroup = await prisma.propertyOpinionGroup.findUnique({
      where: { propertyId },
      include: { aggregation: true }
    });

    if (!opinionGroup) {
      opinionGroup = await prisma.propertyOpinionGroup.create({
        data: {
          propertyId,
          radiusKm: 5.0,
          isActive: true
        },
        include: { aggregation: true }
      });
    }

    // Create vote record
    await prisma.opinionVote.create({
      data: {
        anonymousHash,
        opinionGroupId: opinionGroup.id,
        opinionTag
      }
    });

    // Update aggregation
    if (opinionGroup.aggregation) {
      await prisma.opinionAggregation.update({
        where: { opinionGroupId: opinionGroup.id },
        data: {
          totalVotes: { increment: 1 },
          overPricedCount: opinionTag === 'OVER_PRICED' ? { increment: 1 } : undefined,
          fairPriceCount: opinionTag === 'FAIR_PRICE' ? { increment: 1 } : undefined,
          underPricedCount: opinionTag === 'UNDER_PRICED' ? { increment: 1 } : undefined
        }
      });
    } else {
      await prisma.opinionAggregation.create({
        data: {
          opinionGroupId: opinionGroup.id,
          totalVotes: 1,
          overPricedCount: opinionTag === 'OVER_PRICED' ? 1 : 0,
          fairPriceCount: opinionTag === 'FAIR_PRICE' ? 1 : 0,
          underPricedCount: opinionTag === 'UNDER_PRICED' ? 1 : 0
        }
      });
    }

    revalidatePath(`/properties/${propertyId}`);
    revalidatePath('/dashboard/admin');

    return { success: true, message: 'Opinion submitted successfully' };
  } catch (error) {
    console.error('Error submitting opinion:', error);
    return { success: false, error: 'Failed to submit opinion' };
  }
}

export async function submitValidationComment(
  propertyId: string,
  data: {
    validationType: 'LOCATION_ACCURACY' | 'PRICE_ACCURACY' | 'PROPERTY_EXISTS' | 'GENERAL_FEEDBACK';
    comment?: string;
    isLocationCorrect?: boolean;
    isPriceCorrect?: boolean;
    suggestedPrice?: number;
  },
  userIdentifier: string
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    // Check if user has location set
    if (!user.latitude || !user.longitude) {
      return { success: false, error: 'Please update your location first to submit feedback' };
    }

    // Get property location
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { latitude: true, longitude: true }
    });

    if (!property) {
      return { success: false, error: 'Property not found' };
    }

    // Verify user is nearby (5km)
    const isNearby = await prisma.$queryRaw<Array<{ nearby: boolean }>>`
      SELECT ST_DWithin(
        ST_SetSRID(ST_MakePoint(${user.longitude}, ${user.latitude}), 4326)::geography,
        ST_SetSRID(ST_MakePoint(${property.longitude}, ${property.latitude}), 4326)::geography,
        5000
      ) as nearby
    `;

    if (!isNearby[0]?.nearby) {
      return { success: false, error: 'You must be within 5km to comment. Please update your location if you have moved.' };
    }

    const anonymousHash = generateAnonymousHash(propertyId, userIdentifier);

    // Check if already commented
    const existingComment = await prisma.propertyValidationComment.findUnique({
      where: { anonymousHash }
    });

    if (existingComment) {
      return { success: false, error: 'You have already submitted feedback' };
    }

    await prisma.propertyValidationComment.create({
      data: {
        propertyId,
        anonymousHash,
        validationType: data.validationType,
        comment: data.comment,
        isLocationCorrect: data.isLocationCorrect,
        isPriceCorrect: data.isPriceCorrect,
        suggestedPrice: data.suggestedPrice,
        isVisible: true
      }
    });

    revalidatePath(`/properties/${propertyId}`);
    revalidatePath('/dashboard/admin');

    return { success: true, message: 'Feedback submitted successfully' };
  } catch (error) {
    console.error('Error submitting comment:', error);
    return { success: false, error: 'Failed to submit feedback' };
  }
}

export async function getPropertyOpinions(propertyId: string) {
  try {
    const opinionGroup = await prisma.propertyOpinionGroup.findUnique({
      where: { propertyId },
      include: {
        aggregation: true
      }
    });

    if (!opinionGroup || !opinionGroup.aggregation) {
      return {
        success: true,
        data: {
          totalVotes: 0,
          overPricedCount: 0,
          fairPriceCount: 0,
          underPricedCount: 0,
          consensus: null
        }
      };
    }

    const agg = opinionGroup.aggregation;
    let consensus: 'OVER_PRICED' | 'FAIR_PRICE' | 'UNDER_PRICED' | null = null;

    if (agg.totalVotes >= 5) {
      const max = Math.max(agg.overPricedCount, agg.fairPriceCount, agg.underPricedCount);
      if (agg.overPricedCount === max) consensus = 'OVER_PRICED';
      else if (agg.fairPriceCount === max) consensus = 'FAIR_PRICE';
      else consensus = 'UNDER_PRICED';
    }

    return {
      success: true,
      data: {
        totalVotes: agg.totalVotes,
        overPricedCount: agg.overPricedCount,
        fairPriceCount: agg.fairPriceCount,
        underPricedCount: agg.underPricedCount,
        consensus
      }
    };
  } catch (error) {
    console.error('Error fetching opinions:', error);
    return { success: false, error: 'Failed to fetch opinions' };
  }
}

export async function getPropertyValidationComments(propertyId: string) {
  try {
    const comments = await prisma.propertyValidationComment.findMany({
      where: {
        propertyId,
        isVisible: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        validationType: true,
        comment: true,
        isLocationCorrect: true,
        isPriceCorrect: true,
        suggestedPrice: true,
        createdAt: true
      }
    });

    return { success: true, data: comments };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { success: false, error: 'Failed to fetch comments' };
  }
}
