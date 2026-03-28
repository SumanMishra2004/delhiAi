'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  Search,
  TrendingUp,
  Grid3X3,
  List,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { PropertyFilters } from '@/components/property-filters';
import { PropertyCard } from '@/components/property-card';
import type { SearchFilters } from '@/types';

interface PropertiesPageClientProps {
  initialProperties: any[];
}

export function PropertiesPageClient({ initialProperties }: PropertiesPageClientProps) {
  const [properties] = useState(initialProperties);
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
    // TODO: Implement client-side filtering or trigger server-side refetch
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
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
                  {properties.length} Properties Found
                </h2>
                <Badge variant="outline" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Recently Updated
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

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              ) : (
                <Card className="col-span-full border-2 border-dashed border-spectron-teal/30">
                  <CardContent className="py-16 text-center">
                    <Search className="mx-auto mb-4 h-16 w-16 text-spectron-teal/50" />
                    <h3 className="mb-2 text-xl font-semibold">No Properties Found</h3>
                    <p className="mb-6 text-muted-foreground">
                      Try adjusting your filters or be the first to list a property in this area.
                    </p>
                    <Link href="/dashboard/properties/new">
                      <Button className="gap-2 bg-gradient-to-r from-spectron-gold to-spectron-teal">
                        <Building2 className="h-4 w-4" />
                        List Your Property
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Load More */}
            {properties.length > 0 && (
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg" className="gap-2">
                  Load More Properties
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
