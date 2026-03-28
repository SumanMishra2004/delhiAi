import { NextRequest, NextResponse } from 'next/server';
import { getNearbyProperties } from '@/actions/properties';

// GET /api/properties/nearby - Get nearby properties
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    
    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }
    
    const pagination = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100),
      sortBy: (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'price' | 'area' | 'updatedAt',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    };
    
    const result = await getNearbyProperties(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 5,
      pagination
    );
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/properties/nearby:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch nearby properties' },
      { status: 500 }
    );
  }
}
