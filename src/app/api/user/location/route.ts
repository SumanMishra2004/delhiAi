import { NextRequest, NextResponse } from 'next/server';
import { updateUserLocation } from '@/actions/properties';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// PUT /api/user/location - Update user location
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    if (!body.latitude || !body.longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }
    
    // Validate coordinates
    if (body.latitude < -90 || body.latitude > 90) {
      return NextResponse.json(
        { error: 'Invalid latitude (must be between -90 and 90)' },
        { status: 400 }
      );
    }
    
    if (body.longitude < -180 || body.longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid longitude (must be between -180 and 180)' },
        { status: 400 }
      );
    }
    
    const result = await updateUserLocation(
      body.latitude,
      body.longitude,
      body.address
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in PUT /api/user/location:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update location' },
      { status: 500 }
    );
  }
}
