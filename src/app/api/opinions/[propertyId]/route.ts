import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Get aggregated opinion statistics for a property
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Get opinion group for this property
    const opinionGroup = await prisma.propertyOpinionGroup.findUnique({
      where: { propertyId },
      include: {
        aggregation: true
      }
    });

    if (!opinionGroup || !opinionGroup.aggregation) {
      // No opinions yet
      return NextResponse.json({
        stats: {
          totalVotes: 0,
          overPricedCount: 0,
          fairPriceCount: 0,
          underPricedCount: 0,
          overPricedPercentage: 0,
          fairPricePercentage: 0,
          underPricedPercentage: 0
        },
        lastUpdated: new Date().toISOString()
      });
    }

    const aggregation = opinionGroup.aggregation;
    
    // Calculate percentages
    const totalVotes = aggregation.totalVotes;
    const overPricedPercentage = totalVotes > 0 ? (aggregation.overPricedCount / totalVotes) * 100 : 0;
    const fairPricePercentage = totalVotes > 0 ? (aggregation.fairPriceCount / totalVotes) * 100 : 0;
    const underPricedPercentage = totalVotes > 0 ? (aggregation.underPricedCount / totalVotes) * 100 : 0;

    return NextResponse.json({
      stats: {
        totalVotes: aggregation.totalVotes,
        overPricedCount: aggregation.overPricedCount,
        fairPriceCount: aggregation.fairPriceCount,
        underPricedCount: aggregation.underPricedCount,
        overPricedPercentage: Math.round(overPricedPercentage * 100) / 100,
        fairPricePercentage: Math.round(fairPricePercentage * 100) / 100,
        underPricedPercentage: Math.round(underPricedPercentage * 100) / 100
      },
      lastUpdated: aggregation.lastUpdated.toISOString()
    });

  } catch (error) {
    console.error('Get opinion stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get opinion statistics' },
      { status: 500 }
    );
  }
}