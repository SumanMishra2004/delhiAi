import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Notify users within 5km radius about new property upload
 * Called automatically when a property is created
 */
export async function POST(request: NextRequest) {
  try {
    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Get property details
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        title: true,
        address: true,
        latitude: true,
        longitude: true,
        price: true,
        propertyType: true,
        user: {
          select: { name: true }
        }
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Find users within 5km radius using PostGIS
    const nearbyUsers = await prisma.$queryRaw`
      SELECT id, name, email
      FROM "User"
      WHERE location IS NOT NULL
      AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(${property.longitude}, ${property.latitude}), 4326)::geography,
        5000
      )
      AND id != ${property.user}
    ` as Array<{ id: string; name: string; email: string }>;

    if (nearbyUsers.length === 0) {
      return NextResponse.json({
        message: 'No nearby users to notify',
        notifiedCount: 0
      });
    }

    // Create notifications for nearby users
    const notifications = nearbyUsers.map(user => ({
      userId: user.id,
      propertyId: property.id,
      message: `New property "${property.title}" uploaded near you at ${property.address}. Help verify its accuracy!`
    }));

    await prisma.propertyNotification.createMany({
      data: notifications
    });

    // Create opinion group for this property
    await prisma.propertyOpinionGroup.create({
      data: {
        propertyId: property.id,
        radiusKm: 5.0,
        isActive: true
      }
    });

    return NextResponse.json({
      message: `Notified ${nearbyUsers.length} nearby users`,
      notifiedCount: nearbyUsers.length,
      propertyTitle: property.title
    });

  } catch (error) {
    console.error('Neighbor notification error:', error);
    return NextResponse.json(
      { error: 'Failed to notify neighbors' },
      { status: 500 }
    );
  }
}