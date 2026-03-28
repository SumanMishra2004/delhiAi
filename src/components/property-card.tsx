'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Home, 
  Maximize, 
  IndianRupee,
  Eye,
  Heart,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { PropertyValidationButton } from './property-validation-button';

interface PropertyImage {
  id: string;
  url: string;
  order: number;
}

interface PropertyUser {
  id?: string;
  name: string | null;
  email?: string | null;
  role: string;
  avatar?: string | null;
}

interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  area: number;
  bhk: number;
  propertyType: string;
  furnishing: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  verificationStatus?: string;
  isVerified?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  images?: PropertyImage[];
  user?: PropertyUser;
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const firstImage = property.images?.[0]?.url || '/placeholder-property.jpg';

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'SOLD':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl border-2 hover:border-spectron-teal/50">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={firstImage}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Status Badge */}
        <Badge className={`absolute top-3 left-3 ${getStatusColor(property.status)}`}>
          {property.status}
        </Badge>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm"
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </Button>

        {/* Verification Badge */}
        {property.isVerified && (
          <Badge className="absolute bottom-3 left-3 bg-spectron-gold/90 text-white">
            Verified
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Price */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-spectron-teal">
            {formatPrice(property.price)}
          </h3>
          <Badge variant="outline" className="gap-1">
            <Home className="h-3 w-3" />
            {property.bhk} BHK
          </Badge>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-lg line-clamp-1">
          {property.title}
        </h4>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4 text-muted-foreground" />
            <span>{property.area} sq ft</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {property.furnishing}
          </Badge>
        </div>

        {/* Property Type */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {property.propertyType}
          </Badge>
          {property.user && (
            <span className="text-xs text-muted-foreground">
              by {property.user.name || 'Anonymous'}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {/* Show Validate button for PENDING properties */}
        {property.verificationStatus === 'PENDING' && (
          <PropertyValidationButton
            property={{
              id: property.id,
              title: property.title,
              description: property.description,
              price: property.price,
              area: property.area,
              bhk: property.bhk,
              propertyType: property.propertyType,
              furnishing: property.furnishing,
              address: property.address,
              images: property.images || []
            }}
            variant="outline"
            size="default"
            className="flex-1"
          />
        )}
        
        <Link href={`/properties/${property.id}`} className="flex-1">
          <Button className="w-full gap-2 bg-linear-to-r from-spectron-gold to-spectron-teal hover:opacity-90">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
