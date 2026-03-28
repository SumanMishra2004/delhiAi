'use client';

import { useState } from 'react';
import { PropertyCard } from '@/components/property-card';
import { PropertyFilters } from '@/components/property-filters';
import { PropertiesPageSkeleton } from '@/components/properties-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  Search,
  Sparkles,
  Grid3X3,
  List,
  Building2,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import type { SearchFilters } from '@/types';

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
  images?: Array<{ id: string; url: string; order: number }>;
  user?: {
    id?: string;
    name: string | null;
    email?: string | null;
    role: string;
    avatar?: string | null;
  };
}

interface DashboardPropertiesListProps {
  initialProperties: Property[];
  userRole?: string;
}

export function DashboardPropertiesList({ initialProperties, userRole }: DashboardPropertiesListProps) {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties);
  const [isLoading, setIsLoading] = useState(false);

  const handleFiltersChange = (filters: SearchFilters) => {
    setIsLoading(true);
    
    // Client-side filtering
    let filtered = [...initialProperties];

    // Price filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }

    // Area filter
    if (filters.minArea !== undefined) {
      filtered = filtered.filter(p => p.area >= filters.minArea!);
    }
    if (filters.maxArea !== undefined) {
      filtered = filtered.filter(p => p.area <= filters.maxArea!);
    }

    // BHK filter
    if (filters.bhk && filters.bhk.length > 0) {
      filtered = filtered.filter(p => filters.bhk!.includes(p.bhk));
    }

    // Property type filter
    if (filters.propertyType && filters.propertyType.length > 0) {
      filtered = filtered.filter(p => filters.propertyType!.includes(p.propertyType));
    }

    // Furnishing filter
    if (filters.furnishing && filters.furnishing.length > 0) {
      filtered = filtered.filter(p => filters.furnishing!.includes(p.furnishing));
    }

    setFilteredProperties(filtered);
    setIsLoading(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-4">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <Card className="spectron-card sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-spectron-teal" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyFilters onFiltersChange={handleFiltersChange} />
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid */}
      <div className="lg:col-span-3">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {filteredProperties.length} Properties Found
            </h2>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />
              All Verified
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Grid3X3 className="h-4 w-4" />
              Grid
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <List className="h-4 w-4" />
              List
            </Button>
          </div>
        </div>

        {isLoading ? (
          <PropertiesPageSkeleton />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <Card className="col-span-full border-2 border-dashed border-spectron-teal/30 spectron-card">
                <CardContent className="py-16 text-center">
                  <Search className="mx-auto mb-4 h-16 w-16 text-spectron-teal/50" />
                  <h3 className="mb-2 text-xl font-semibold">No Properties Found</h3>
                  <p className="mb-6 text-muted-foreground">
                    Try adjusting your filters or be the first to list a property in this area.
                  </p>
                  {(userRole === 'OWNER' || userRole === 'BROKER') && (
                    <Link href="/dashboard/properties/new">
                      <Button className="gap-2 bg-gradient-to-r from-spectron-gold to-spectron-teal">
                        <Building2 className="h-4 w-4" />
                        List Your Property
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Load More */}
        {filteredProperties.length > 0 && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
              Load More Properties
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
