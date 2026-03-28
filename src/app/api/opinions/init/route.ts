/**
 * API Route: Initialize Opinion Group for Property (Web2 Version)
 * 
 * Creates opinion group for a property
 * Only property owner/broker can initialize
 * 
 * POST /api/opinions/init
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

interface InitRequest {
  propertyId: string;
  radiusKm?: number;
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: InitRequest = await req.json();
    const { propertyId, radiusKm = 5.0 } = body;

    // Verify property ownership
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { userId: true, opinionGroup: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    if (property.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not own this property' },
        { status: 403 }
      );
    }

    if (property.opinionGroup) {
      return NextResponse.json(
        { error: 'Opinion group already exists for this property' },
        { status: 409 }
      );
    }

    // Create opinion group and aggregation
    const opinionGroup = await prisma.propertyOpinionGroup.create({
      data: {
        propertyId,
        radiusKm,
        isActive: true,
        aggregation: {
          create: {
            totalVotes: 0,
            overPricedCount: 0,
            fairPriceCount: 0,
            underPricedCount: 0,
          },
        },
      },
      include: {
        aggregation: true,
      },
    });

    return NextResponse.json({
      success: true,
      opinionGroup,
    });
  } catch (error) {
    console.error('Init opinion group error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize opinion group' },
      { status: 500 }
    );
  }
}
