import { NextRequest, NextResponse } from 'next/server';
import { getPropertyById, updateProperty, deleteProperty } from '@/actions/properties';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const property = await getPropertyById(id);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(property, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/properties/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const result = await updateProperty(id, body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Unauthorized' ? 403 : 400 }
      );
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in PUT /api/properties/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }
    
    const result = await deleteProperty(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Unauthorized' ? 403 : 400 }
      );
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/properties/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete property' },
      { status: 500 }
    );
  }
}
