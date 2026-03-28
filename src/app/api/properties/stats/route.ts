import { NextRequest, NextResponse } from 'next/server';
import { getPropertyStats } from '@/actions/properties';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// GET /api/properties/stats - Get property statistics
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
    const userId = searchParams.get('userId');
    
    const result = await getPropertyStats(userId || undefined);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Unauthorized' ? 401 : 500 }
      );
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/properties/stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch property stats' },
      { status: 500 }
    );
  }
}
