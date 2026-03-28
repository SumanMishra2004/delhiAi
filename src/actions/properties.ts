/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { prisma } from '@/lib/prisma';
import { getStorageClient } from '@/lib/storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { revalidatePath } from 'next/cache';
import type { SearchFilters } from '@/types';
import { Prisma } from '@prisma/client';

interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'price' | 'area' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

interface PropertyFilters extends SearchFilters {
  status?: string | string[];
  userId?: string;
  isFeatured?: boolean;
  minArea?: number;
  maxArea?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export async function getProperties(
  filters?: PropertyFilters,
  pagination?: PaginationParams
) {
  try {
    const page = pagination?.page || 1;
    const limit = Math.min(pagination?.limit || 20, 100); // Max 100 items per page
    const skip = (page - 1) * limit;
    const sortBy = pagination?.sortBy || 'createdAt';
    const sortOrder = pagination?.sortOrder || 'desc';

    const where: Prisma.PropertyWhereInput = {};

    // Status filter
    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        where.status = { in: filters.status as any };
      } else {
        where.status = filters.status as any;
      }
    } else {
      // Default: show only ACTIVE properties
      where.status = 'ACTIVE';
    }

    // User filter
    if (filters?.userId) {
      where.userId = filters.userId;
    }

   

    // Price filter
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    // Area filter
    if (filters?.minArea || filters?.maxArea) {
      where.area = {};
      if (filters.minArea) where.area.gte = filters.minArea;
      if (filters.maxArea) where.area.lte = filters.maxArea;
    }

    // BHK filter
    if (filters?.bhk && filters.bhk.length > 0) {
      where.bhk = { in: filters.bhk };
    }

    // Property type filter
    if (filters?.propertyType && filters.propertyType.length > 0) {
      where.propertyType = { in: filters.propertyType as any };
    }

    // Furnishing filter
    if (filters?.furnishing && filters.furnishing.length > 0) {
      where.furnishing = { in: filters.furnishing as any };
    }

    // Search filter (title, description, address)
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Spatial queries with PostGIS
    if (filters?.bounds || filters?.radius) {
      let spatialQuery = '';
      const baseWhere = Object.entries(where)
        .filter(([key]) => !['OR'].includes(key))
        .map(([key, value]) => {
          if (key === 'status') {
            if (typeof value === 'object' && value !== null && 'in' in value) {
              // Handle array of statuses: status IN ('ACTIVE', 'PENDING')
              const statuses = (value as any).in.map((s: string) => `'${s}'`).join(', ');
              return `status IN (${statuses})`;
            }
            return `status = '${value}'`;
          }
          if (key === 'userId') return `"userId" = '${value}'`;
          return null;
        })
        .filter(Boolean)
        .join(' AND ');

      if (filters.bounds) {
        const { north, south, east, west } = filters.bounds;
        spatialQuery = `
          SELECT p.*, 
            (SELECT json_agg(img)
             FROM (
               SELECT json_build_object('id', pi.id, 'url', pi.url, 'order', pi."order") as img
               FROM "PropertyImage" pi 
               WHERE pi."propertyId" = p.id 
               ORDER BY pi."order"
             ) subquery) as images,
            (SELECT json_build_object('name', u.name, 'role', u.role)
             FROM "User" u 
             WHERE u.id = p."userId") as user
          FROM "Property" p
          WHERE ${baseWhere || 'TRUE'}
            AND latitude BETWEEN ${south} AND ${north}
            AND longitude BETWEEN ${west} AND ${east}
          ORDER BY p."${sortBy}" ${sortOrder.toUpperCase()}
          LIMIT ${limit} OFFSET ${skip}
        `;
      } else if (filters.radius) {
        const { lat, lng, km } = filters.radius;
        spatialQuery = `
          SELECT p.*,
            ST_Distance(
              p.location::geography,
              ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
            ) / 1000 as distance_km,
            (SELECT json_agg(img)
             FROM (
               SELECT json_build_object('id', pi.id, 'url', pi.url, 'order', pi."order") as img
               FROM "PropertyImage" pi 
               WHERE pi."propertyId" = p.id 
               ORDER BY pi."order"
             ) subquery) as images,
            (SELECT json_build_object('name', u.name, 'role', u.role)
             FROM "User" u 
             WHERE u.id = p."userId") as user
          FROM "Property" p
          WHERE ${baseWhere || 'TRUE'}
            AND ST_DWithin(
              p.location::geography,
              ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
              ${km * 1000}
            )
          ORDER BY distance_km ASC
          LIMIT ${limit} OFFSET ${skip}
        `;
      }

      const properties = await prisma.$queryRawUnsafe(spatialQuery);
      
      // Get total count for pagination - construct a simpler count query
      let countQuery = '';
      if (filters.bounds) {
        const { north, south, east, west } = filters.bounds;
        countQuery = `
          SELECT COUNT(*) as count 
          FROM "Property" p
          WHERE ${baseWhere || 'TRUE'}
            AND latitude BETWEEN ${south} AND ${north}
            AND longitude BETWEEN ${west} AND ${east}
        `;
      } else if (filters.radius) {
        const { lat, lng, km } = filters.radius;
        countQuery = `
          SELECT COUNT(*) as count 
          FROM "Property" p
          WHERE ${baseWhere || 'TRUE'}
            AND ST_DWithin(
              p.location::geography,
              ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
              ${km * 1000}
            )
        `;
      }
      
      const countResult: any = await prisma.$queryRawUnsafe(countQuery);
      const total = parseInt(countResult[0]?.count || '0');

      return {
        data: properties,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      } as PaginatedResponse<any>;
    }

    // Standard query with pagination
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatar: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return {
      data: properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    } as PaginatedResponse<any>;
  } catch (error) {
    console.warn('Database Connection Warning: Failed to fetch properties gracefully.');
    // Instead of throwing an error that crashes the entire page layout on connection failure,
    // we gracefully return an empty array with empty pagination.
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasMore: false,
      },
      error: 'Failed to fetch properties from Database (Connection issue)',
    } as any;
  }
}

export async function getPropertyById(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            avatar: true,
          },
        },
        urbanSprawlData: {
          orderBy: { year: 'asc' },
        },
      },
    });

    return property;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw new Error('Failed to fetch property');
  }
}

export async function createProperty(data: {
  title: string;
  description?: string;
  price: number;
  area: number;
  bhk: number;
  propertyType: string;
  furnishing: string;
  address: string;
  latitude: number;
  longitude: number;
  images: { url: string; order: number }[];
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Unauthorized - Please sign in to create a property');
    }

    const result = await prisma.$queryRaw<{ id: string }[]>`
      INSERT INTO "Property" (
        id, title, description, price, area, bhk, 
        "propertyType", furnishing, address, latitude, longitude, location,
        "userId", status, "verificationStatus", "isVerified", "createdAt", "updatedAt"
      )
      VALUES (
        gen_random_uuid()::text,
        ${data.title},
        ${data.description || null},
        ${data.price},
        ${data.area},
        ${data.bhk},
        ${data.propertyType}::"PropertyType",
        ${data.furnishing}::"FurnishingStatus",
        ${data.address},
        ${data.latitude},
        ${data.longitude},
        ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)::geography,
        ${session.user.id},
        'PENDING'::"PropertyStatus",
        'PENDING'::"PropertyVerificationStatus",
        false,
        NOW(),
        NOW()
      )
      RETURNING id
    `;

    const propertyId = result[0]?.id;

    if (propertyId && data.images.length > 0) {
      await prisma.propertyImage.createMany({
        data: data.images.map((img) => ({
          url: img.url,
          propertyId: propertyId,
          order: img.order,
        })),
      });
    }

    // Get the created property with relations
    const createdProperty = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Fetch urban sprawl data asynchronously (don't wait for it)
    fetchAndStoreUrbanSprawlData(propertyId, data.latitude, data.longitude).catch((error) => {
      console.error('Error fetching urban sprawl data:', error);
      // Don't fail the property creation if urban sprawl data fetch fails
    });

    // Notify nearby neighbors asynchronously (don't wait for it)
    notifyNearbyNeighbors(propertyId).catch((error) => {
      console.error('Error notifying neighbors:', error);
      // Don't fail the property creation if neighbor notification fails
    });

    revalidatePath('/');
    revalidatePath('/properties');
    revalidatePath('/dashboard/properties');

    return { success: true, property: createdProperty };
  } catch (error) {
    console.error('Error creating property:', error);
    return { success: false, error: 'Failed to create property' };
  }
}

// Fetch and store urban sprawl data for a property
async function fetchAndStoreUrbanSprawlData(
  propertyId: string,
  latitude: number,
  longitude: number
) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_URBAN_SPRAWL_API_KEY;
    
    if (!apiUrl) {
      console.warn('NEXT_PUBLIC_URBAN_SPRAWL_API_KEY not configured');
      return;
    }

    console.log('Fetching urban sprawl data for property:', propertyId);

    const response = await fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Urban sprawl API error: ${response.status}`);
    }

    const data: Array<{
      year: number;
      urban_sq_km: number;
      percentage: number;
    }> = await response.json();

    console.log('Urban sprawl data received:', data.length, 'records');

    // Store the data in the database
    await prisma.urbanSprawlData.createMany({
      data: data.map((item) => ({
        propertyId,
        year: item.year,
        urbanSqKm: item.urban_sq_km,
        percentage: item.percentage,
      })),
    });

    console.log('Urban sprawl data stored successfully for property:', propertyId);
  } catch (error) {
    console.error('Error in fetchAndStoreUrbanSprawlData:', error);
    throw error;
  }
}

// Notify nearby neighbors about new property upload
async function notifyNearbyNeighbors(propertyId: string) {
  try {
    console.log('Notifying nearby neighbors for property:', propertyId);

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
        userId: true,
        user: {
          select: { name: true }
        }
      }
    });

    if (!property) {
      throw new Error('Property not found');
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
      AND id != ${property.userId}
    ` as Array<{ id: string; name: string; email: string }>;

    if (nearbyUsers.length === 0) {
      console.log('No nearby users to notify for property:', propertyId);
      return;
    }

    // Create notifications for nearby users
    const notifications = nearbyUsers.map(user => ({
      userId: user.id,
      propertyId: property.id,
      message: `New property "${property.title}" uploaded near you at ${property.address}. Help verify its accuracy and share your opinion!`
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

    console.log(`Notified ${nearbyUsers.length} nearby users about property:`, propertyId);
  } catch (error) {
    console.error('Error in notifyNearbyNeighbors:', error);
    throw error;
  }
}

export async function uploadPropertyImages(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return { success: false, error: 'No images provided' };
    }
    
    if (files.length < 2) {
      return { success: false, error: 'Please upload at least 2 images' };
    }
    
    if (files.length > 5) {
      return { success: false, error: 'Maximum 5 images allowed' };
    }

    const storage = getStorageClient();
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file
      if (!file || !(file instanceof File)) {
        console.error('Invalid file at index', i, file);
        return { success: false, error: `Invalid file at position ${i + 1}` };
      }
      
      if (!file.type.startsWith('image/')) {
        return { success: false, error: `File ${i + 1} is not an image (${file.type})` };
      }
      
      if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: `Image ${i + 1} exceeds 10MB limit` };
      }

      // Convert file to buffer for upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `properties/${session.user.id}/${fileName}`;

      console.log('Uploading file:', { fileName, fileSize: file.size, fileType: file.type });

      const { data, error } = await storage.storage
        .from('properties_images')
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return { 
          success: false, 
          error: `Failed to upload image ${i + 1}: ${error.message || 'Unknown error'}` 
        };
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = storage.storage
        .from('properties_images')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);
      uploadedUrls.push(publicUrl);
    }

    return { 
      success: true, 
      urls: uploadedUrls.map((url, index) => ({ url, order: index }))
    };
  } catch (error: any) {
    console.error('Error uploading images:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to upload images' 
    };
  }
}

export async function getNearbyProperties(
  lat: number,
  lng: number,
  radiusKm: number = 5,
  pagination?: PaginationParams
) {
  try {
    return await getProperties(
      {
        radius: { lat, lng, km: radiusKm },
        status: 'ACTIVE',
      },
      pagination
    );
  } catch (error) {
    console.error('Error fetching nearby properties:', error);
    throw new Error('Failed to fetch nearby properties');
  }
}

export async function updateUserLocation(lat: number, lng: number, providedAddress?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    let address = providedAddress || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    if (!providedAddress) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          {
            headers: {
              'User-Agent': 'PropertyPlatform/1.0'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          address = data.display_name || address;
        }
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed, using coordinates:', geocodeError);
        // Continue with coordinates as address
      }
    }

    await prisma.$executeRaw`
      UPDATE "User"
      SET 
        latitude = ${lat},
        longitude = ${lng},
        location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        address = ${address},
        "updatedAt" = NOW()
      WHERE id = ${session.user.id}
    `;

    return { success: true, address };
  } catch (error) {
    console.error('Error updating user location:', error);
    return { success: false, error: 'Failed to update location' };
  }
}

export async function getFeaturedProperties(limit: number = 6) {
  try {
    const properties = await prisma.property.findMany({
      where: {
        status: 'ACTIVE',
       
       
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        user: {
          select: {
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 20),
    });

    return { success: true, properties };
  } catch (error) {
    console.warn('Database Connection Warning: Failed to fetch featured properties gracefully.');
    return { success: false, error: 'Failed to fetch featured properties', properties: [] };
  }
}

export async function getPropertyStats(userId?: string) {
  try {
    const session = await getServerSession(authOptions);
    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      return { success: false, error: 'Unauthorized' };
    }

    const [total, active, pending, sold] = await Promise.all([
      prisma.property.count({ where: { userId: targetUserId } }),
      prisma.property.count({ where: { userId: targetUserId, status: 'ACTIVE' } }),
      prisma.property.count({ where: { userId: targetUserId, status: 'PENDING' } }),
      prisma.property.count({ where: { userId: targetUserId, status: 'SOLD' } }),
     
    ]);

    return {
      success: true,
      stats: {
        total,
        active,
        pending,
        sold,
      },
    };
  } catch (error) {
    console.error('Error fetching property stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}

export async function getMyProperties(pagination?: PaginationParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const result = await getProperties(
      { userId: session.user.id },
      pagination
    );

    return result;
  } catch (error) {
    console.error('Error fetching user properties:', error);
    throw new Error('Failed to fetch properties');
  }
}

export async function updateProperty(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    price: number;
    area: number;
    bhk: number;
    propertyType: string;
    furnishing: string;
    address: string;
    latitude: number;
    longitude: number;
    status: string;
  }>
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check ownership
    const property = await prisma.property.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!property) {
      return { success: false, error: 'Property not found' };
    }

    if (property.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // If location changed, update PostGIS location
    if (data.latitude !== undefined && data.longitude !== undefined) {
      await prisma.$executeRaw`
        UPDATE "Property"
        SET 
          title = COALESCE(${data.title}, title),
          description = COALESCE(${data.description}, description),
          price = COALESCE(${data.price}, price),
          area = COALESCE(${data.area}, area),
          bhk = COALESCE(${data.bhk}, bhk),
          "propertyType" = COALESCE(${data.propertyType}::"PropertyType", "propertyType"),
          furnishing = COALESCE(${data.furnishing}::"FurnishingStatus", furnishing),
          address = COALESCE(${data.address}, address),
          latitude = ${data.latitude},
          longitude = ${data.longitude},
          location = ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)::geography,
          "updatedAt" = NOW()
        WHERE id = ${id}
      `;
    } else {
      const updateData: any = {};
      if (data.title) updateData.title = data.title;
      if (data.description) updateData.description = data.description;
      if (data.price) updateData.price = data.price;
      if (data.area) updateData.area = data.area;
      if (data.bhk) updateData.bhk = data.bhk;
      if (data.address) updateData.address = data.address;
      updateData.updatedAt = new Date();
      
      await prisma.property.update({
        where: { id },
        data: updateData,
      });
    }

    revalidatePath('/properties');
    revalidatePath('/dashboard/properties');

    return { success: true };
  } catch (error) {
    console.error('Error updating property:', error);
    return { success: false, error: 'Failed to update property' };
  }
}

export async function deleteProperty(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check ownership
    const property = await prisma.property.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!property) {
      return { success: false, error: 'Property not found' };
    }

    if (property.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.property.delete({
      where: { id },
    });

    revalidatePath('/properties');
    revalidatePath('/dashboard/properties');

    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { success: false, error: 'Failed to delete property' };
  }
}
