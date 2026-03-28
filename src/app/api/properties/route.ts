import { NextRequest, NextResponse } from 'next/server';
import { getProperties, createProperty } from '@/actions/properties';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { rateLimiters } from '@/lib/rate-limit';

interface PropertyFilters {
  status?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bhk?: number[];
  propertyType?: string[];
  furnishing?: string[];
  search?: string;
  isFeatured?: boolean;
  userId?: string;
  radius?: {
    lat: number;
    lng: number;
    km: number;
  };
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// GET /api/properties - List properties with filters and pagination
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimiters.api(request);
    
    // Add rate limit headers
    const headers = {
      'X-RateLimit-Limit': rateLimitResult.limit.toString(),
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
    };
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers,
        }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    
    // Parse filters
    const filters: PropertyFilters = {};
    
    // Status
    const status = searchParams.get('status');
    if (status) {
      filters.status = status.includes(',') ? status.split(',') : status;
    }
    
    // Price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice) filters.minPrice = parseInt(minPrice);
    if (maxPrice) filters.maxPrice = parseInt(maxPrice);
    
    // Area range
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    if (minArea) filters.minArea = parseInt(minArea);
    if (maxArea) filters.maxArea = parseInt(maxArea);
    
    // BHK
    const bhk = searchParams.get('bhk');
    if (bhk) {
      filters.bhk = bhk.split(',').map(b => parseInt(b));
    }
    
    // Property Type
    const propertyType = searchParams.get('propertyType');
    if (propertyType) {
      filters.propertyType = propertyType.split(',');
    }
    
    // Furnishing
    const furnishing = searchParams.get('furnishing');
    if (furnishing) {
      filters.furnishing = furnishing.split(',');
    }
    
    // Search
    const search = searchParams.get('search');
    if (search) filters.search = search;
    
    // Featured
    const isFeatured = searchParams.get('isFeatured');
    if (isFeatured) filters.isFeatured = isFeatured === 'true';
    
    // User ID
    const userId = searchParams.get('userId');
    if (userId) filters.userId = userId;
    
    // Spatial filters
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    
    if (lat && lng && radius) {
      filters.radius = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        km: parseFloat(radius),
      };
    }
    
    // Bounds
    const north = searchParams.get('north');
    const south = searchParams.get('south');
    const east = searchParams.get('east');
    const west = searchParams.get('west');
    
    if (north && south && east && west) {
      filters.bounds = {
        north: parseFloat(north),
        south: parseFloat(south),
        east: parseFloat(east),
        west: parseFloat(west),
      };
    }
    
    // Parse pagination
    const pagination = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100),
      sortBy: (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'price' | 'area' | 'updatedAt',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    };
    
    const result = await getProperties(filters, pagination);
    
    return NextResponse.json(result, { 
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/properties:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'price', 'area', 'bhk', 'propertyType', 'furnishing', 'address', 'latitude', 'longitude', 'images'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    const result = await createProperty(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error('Error in POST /api/properties:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create property' },
      { status: 500 }
    );
  }
}
