/**
 * API Route: Submit Anonymous Opinion (Web2 Version)
 * 
 * Records opinion using anonymous fingerprinting
 * PRIVACY: Only stores anonymized hash and aggregated counts
 * No user IDs, emails, or identifying information stored
 * 
 * POST /api/opinions/submit
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OpinionTag } from '@/types/opinions';
import {
  generateAnonymousHash,
  getClientIP,
  getUserAgent,
} from '@/lib/anonymous-session';

interface SubmitRequest {
  propertyId: string;
  opinionTag: OpinionTag;
  sessionToken: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: SubmitRequest = await req.json();
    const { propertyId, opinionTag, sessionToken } = body;

    // Validate inputs
    if (!propertyId || !opinionTag || !sessionToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate opinion tag
    if (!Object.values(OpinionTag).includes(opinionTag)) {
      return NextResponse.json(
        { error: 'Invalid opinion tag' },
        { status: 400 }
      );
    }

    // Generate anonymous hash from IP + User-Agent + Property ID
    const ip = getClientIP(req.headers);
    const userAgent = getUserAgent(req.headers);
    const anonymousHash = generateAnonymousHash(ip, userAgent, propertyId);

    // Check if already voted
    const existingVote = await prisma.opinionVote.findUnique({
      where: { anonymousHash },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already submitted an opinion for this property' },
        { status: 409 }
      );
    }

    // Get opinion group
    const opinionGroup = await prisma.propertyOpinionGroup.findUnique({
      where: { propertyId },
      include: { aggregation: true },
    });

    if (!opinionGroup) {
      return NextResponse.json(
        { error: 'Opinion group not found' },
        { status: 404 }
      );
    }

    if (!opinionGroup.isActive) {
      return NextResponse.json(
        { error: 'Opinion system is currently disabled' },
        { status: 400 }
      );
    }

    // Record vote and update aggregation in transaction
    await prisma.$transaction(async (tx) => {
      // Store anonymous vote hash
      await tx.opinionVote.create({
        data: {
          anonymousHash,
          opinionGroupId: opinionGroup.id,
          opinionTag,
        },
      });

      // Update aggregated counts
      const incrementField =
        opinionTag === OpinionTag.OVER_PRICED
          ? 'overPricedCount'
          : opinionTag === OpinionTag.FAIR_PRICE
          ? 'fairPriceCount'
          : 'underPricedCount';

      await tx.opinionAggregation.update({
        where: { opinionGroupId: opinionGroup.id },
        data: {
          totalVotes: { increment: 1 },
          [incrementField]: { increment: 1 },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Opinion submitted successfully',
    });
  } catch (error) {
    console.error('Submit opinion error:', error);
    return NextResponse.json(
      { error: 'Failed to submit opinion' },
      { status: 500 }
    );
  }
}
