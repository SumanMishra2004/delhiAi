import { User as PrismaUser, Property as PrismaProperty, PropertyImage, Subscription } from '@prisma/client';

export type User = PrismaUser;
export type Property = PrismaProperty;
export type { PropertyImage, Subscription };

export type PropertyWithImages = Property & {
  images: PropertyImage[];
};

export type PropertyWithDetails = Property & {
  images: PropertyImage[];
  user: User;
};

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  bhk?: number[];
  propertyType?: string[];
  furnishing?: string[];
  minArea?: number;
  maxArea?: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  radius?: {
    lat: number;
    lng: number;
    km: number;
  };
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
