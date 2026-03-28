import { NextRequest, NextResponse } from 'next/server';
import { uploadPropertyImages } from '@/actions/properties';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// POST /api/properties/upload - Upload property images
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }
    
    const formData = await request.formData();
    const result = await uploadPropertyImages(formData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /api/properties/upload:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload images' },
      { status: 500 }
    );
  }
}
