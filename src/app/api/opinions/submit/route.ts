import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { OpinionTag } from '@/types/opinions';

/**
 * Submit anonymous opinion using admin-controlled trust
 */
export async function POST(request: NextRequest) {
  try {
    const { propertyId, opinionTag } = await request.json();
    const anonymousToken = request.headers.get('X-Anonymous-Token');

    if (!propertyId || !opinionTag || !anonymousToken) {
      return NextResponse.json(
        { error: 'Missing required fields or token' },
        { status: 400 }
      );
    }

    // Verify anonymous token
    const tokenVerification = verifyAnonymousToken(anonymousToken, propertyId);
    if (!tokenVerification.valid || !tokenVerification.nullifierHash) {
      return NextResponse.json(
        { error: tokenVerification.error || 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if this token has already been used
    const existingVote = await prisma.opinionVote.findUnique({
      where: { anonymousHash: tokenVerification.nullifierHash }
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted on this property' },
        { status: 409 }
      );
    }

    // Validate opinion tag
    if (!Object.values(OpinionTag).includes(opinionTag as OpinionTag)) {
      return NextResponse.json(
        { error: 'Invalid opinion tag' },
        { status: 400 }
      );
    }

    // Get or create opinion group for this property
    let opinionGroup = await prisma.propertyOpinionGroup.findUnique({
      where: { propertyId }
    });

    if (!opinionGroup) {
      // Create new opinion group
      opinionGroup = await prisma.propertyOpinionGroup.create({
        data: {
          propertyId,
          radiusKm: 5
        }
      });
    }

    // Record the vote using a transaction
    await prisma.$transaction(async (tx) => {
      // Store anonymous vote to prevent double voting
      await tx.opinionVote.create({
        data: {
          anonymousHash: tokenVerification.nullifierHash,
          opinionGroupId: opinionGroup.id,
          opinionTag: opinionTag as OpinionTag
        }
      });

      // Update or create aggregated statistics
      const existingAggregation = await tx.opinionAggregation.findUnique({
        where: { opinionGroupId: opinionGroup.id }
      });

      if (existingAggregation) {
        // Update existing aggregation
        const updates: any = { totalVotes: { increment: 1 } };
        
        switch (opinionTag) {
          case OpinionTag.OVER_PRICED:
            updates.overPricedCount = { increment: 1 };
            break;
          case OpinionTag.FAIR_PRICE:
            updates.fairPriceCount = { increment: 1 };
            break;
          case OpinionTag.UNDER_PRICED:
            updates.underPricedCount = { increment: 1 };
            break;
        }

        await tx.opinionAggregation.update({
          where: { opinionGroupId: opinionGroup.id },
          data: updates
        });
      } else {
        // Create new aggregation
        const initialCounts = {
          totalVotes: 1,
          overPricedCount: opinionTag === OpinionTag.OVER_PRICED ? 1 : 0,
          fairPriceCount: opinionTag === OpinionTag.FAIR_PRICE ? 1 : 0,
          underPricedCount: opinionTag === OpinionTag.UNDER_PRICED ? 1 : 0
        };

        await tx.opinionAggregation.create({
          data: {
            opinionGroupId: opinionGroup.id,
            ...initialCounts
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Opinion submitted successfully'
    });

  } catch (error) {
    console.error('Opinion submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit opinion' },
      { status: 500 }
    );
  }
}

/**
 * Verify anonymous token and extract nullifier hash
 */
function verifyAnonymousToken(token: string, propertyId: string) {
  try {
    const secret = process.env.OPINION_ADMIN_SECRET || 'default-secret-change-this';
    
    // Decode base64 token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [tokenString, signature] = decoded.split('.');
    
    if (!tokenString || !signature) {
      return { valid: false, error: 'Invalid token format' };
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(tokenString)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid token signature' };
    }

    // Parse token data
    const tokenData = JSON.parse(tokenString);
    
    // Check expiration
    if (Date.now() > tokenData.expiresAt) {
      return { valid: false, error: 'Token expired' };
    }

    // Check property ID
    if (tokenData.propertyId !== propertyId) {
      return { valid: false, error: 'Token not valid for this property' };
    }

    // Generate nullifier hash from token data
    const nullifierHash = crypto
      .createHash('sha256')
      .update(`${tokenData.locationHash}:${tokenData.propertyId}:${tokenData.timestamp}`)
      .digest('hex');

    return {
      valid: true,
      nullifierHash,
      tokenData
    };

  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
}