import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

/**
 * Admin endpoint to verify/reject properties
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, id: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { propertyId, action, notes } = await request.json();

    if (!propertyId || !action) {
      return NextResponse.json(
        { error: 'Property ID and action are required' },
        { status: 400 }
      );
    }

    if (!['APPROVED', 'REJECTED', 'NEEDS_REVIEW'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be APPROVED, REJECTED, or NEEDS_REVIEW' },
        { status: 400 }
      );
    }

    // Update property verification status
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        verificationStatus: action,
        isVerified: action === 'APPROVED',
        status: action === 'APPROVED' ? 'ACTIVE' : action === 'REJECTED' ? 'REJECTED' : 'PENDING',
        verificationNotes: notes || null,
        verifiedAt: new Date(),
        verifiedBy: user.id
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Notify property owner about verification result
    await prisma.propertyNotification.create({
      data: {
        userId: updatedProperty.userId,
        propertyId: propertyId,
        message: action === 'APPROVED' 
          ? `Your property "${updatedProperty.title}" has been approved and is now live!`
          : action === 'REJECTED'
          ? `Your property "${updatedProperty.title}" was rejected. ${notes ? `Reason: ${notes}` : ''}`
          : `Your property "${updatedProperty.title}" needs review. ${notes ? `Notes: ${notes}` : ''}`
      }
    });

    return NextResponse.json({
      success: true,
      message: `Property ${action.toLowerCase()} successfully`,
      property: {
        id: updatedProperty.id,
        title: updatedProperty.title,
        verificationStatus: updatedProperty.verificationStatus,
        isVerified: updatedProperty.isVerified
      }
    });

  } catch (error) {
    console.error('Property verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify property' },
      { status: 500 }
    );
  }
}

/**
 * Get properties pending verification (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get properties with validation comments and opinion stats
    const properties = await prisma.property.findMany({
      where: {
        verificationStatus: status as any
      },
      include: {
        user: {
          select: { name: true, email: true, role: true }
        },
        images: {
          select: { url: true, order: true },
          orderBy: { order: 'asc' }
        },
        validationComments: {
          where: { isVisible: true },
          select: {
            validationType: true,
            comment: true,
            isLocationCorrect: true,
            isPriceCorrect: true,
            suggestedPrice: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        },
        opinionGroup: {
          include: {
            aggregation: true
          }
        },
        urbanSprawlData: {
          select: {
            year: true,
            urbanSqKm: true,
            percentage: true
          },
          orderBy: { year: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalCount = await prisma.property.count({
      where: {
        verificationStatus: status as any
      }
    });

    // Process properties to include summary statistics
    const processedProperties = properties.map(property => {
      const comments = property.validationComments;
      const opinionStats = property.opinionGroup?.aggregation;
      
      return {
        ...property,
        validationSummary: {
          totalComments: comments.length,
          locationAccurate: comments.filter(c => c.isLocationCorrect === true).length,
          locationInaccurate: comments.filter(c => c.isLocationCorrect === false).length,
          priceAccurate: comments.filter(c => c.isPriceCorrect === true).length,
          priceInaccurate: comments.filter(c => c.isPriceCorrect === false).length,
          averageSuggestedPrice: comments
            .filter(c => c.suggestedPrice)
            .reduce((sum, c) => sum + (c.suggestedPrice || 0), 0) / 
            Math.max(1, comments.filter(c => c.suggestedPrice).length) || null
        },
        opinionStats: opinionStats ? {
          totalVotes: opinionStats.totalVotes,
          overPricedPercentage: opinionStats.totalVotes > 0 
            ? (opinionStats.overPricedCount / opinionStats.totalVotes) * 100 
            : 0,
          fairPricePercentage: opinionStats.totalVotes > 0 
            ? (opinionStats.fairPriceCount / opinionStats.totalVotes) * 100 
            : 0,
          underPricedPercentage: opinionStats.totalVotes > 0 
            ? (opinionStats.underPricedCount / opinionStats.totalVotes) * 100 
            : 0
        } : null
      };
    });

    return NextResponse.json({
      properties: processedProperties,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Get properties for verification error:', error);
    return NextResponse.json(
      { error: 'Failed to get properties' },
      { status: 500 }
    );
  }
}