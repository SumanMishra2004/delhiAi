import { NextRequest, NextResponse } from 'next/server';
import { getMyProperties } from '@/actions/properties';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// GET /api/properties/my - Get current user's properties
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    
    const pagination = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100),
      sortBy: (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'price' | 'area' | 'updatedAt',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    };
    
    const result = await getMyProperties(pagination);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/properties/my:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
