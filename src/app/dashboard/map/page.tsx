'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PropertyWithImages } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MapIcon, 
  Search, 
  X, 
  Home,
  Navigation,
  Layers,
  Maximize2,
  Filter,
  MapPin,
  Bed,
  Maximize,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Dynamically import MapInterface component
const MapInterface = dynamic(() => import('@/components/map-interface').then(mod => mod.MapInterface), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-muted">
      <div className="text-center">
        <MapIcon className="mx-auto mb-4 h-16 w-16 animate-pulse text-spectron-teal" />
        <p className="text-lg font-medium">Loading Interactive Map...</p>
        <p className="text-sm text-muted-foreground">Preparing map explorer</p>
      </div>
    </div>
  ),
});

export default function MapExplorerPage() {
  const [properties, setProperties] = useState<PropertyWithImages[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 22.5726,
    lng: 88.3639,
  });
  const [mapZoom, setMapZoom] = useState(12);

  // Load properties based on map bounds
  const loadPropertiesInView = useCallback(async (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        north: bounds.north.toString(),
        south: bounds.south.toString(),
        east: bounds.east.toString(),
        west: bounds.west.toString(),
        status: 'ACTIVE,PENDING',
        limit: '100', // Show more properties on map
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/properties?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data.data || []);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Handle map bounds change
  const handleMapBoundsChange = useCallback((bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => {
    setMapBounds(bounds);
    loadPropertiesInView(bounds);
  }, [loadPropertiesInView]);

  // Search effect
  useEffect(() => {
    if (mapBounds) {
      const debounce = setTimeout(() => {
        loadPropertiesInView(mapBounds);
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [searchQuery, mapBounds, loadPropertiesInView]);

  // Map markers
  const markers = useMemo(
    () =>
      properties.map((p) => ({
        id: p.id,
        lat: p.latitude,
        lng: p.longitude,
        title: p.title,
        price: p.price,
      })),
    [properties]
  );

  // Format price
  const formatPrice = (price: number) => {
    const lakhs = price / 100000;
    const crores = price / 10000000;
    if (crores >= 1) {
      return `₹${crores.toFixed(2)}Cr`;
    }
    return `₹${lakhs.toFixed(2)}L`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-spectron-gold via-spectron-teal to-spectron-crimson bg-clip-text text-transparent">
          Map Explorer
        </h1>
        <p className="text-muted-foreground mt-1">
          Discover properties across Kolkata with our interactive map
        </p>
      </div>

      <div className="flex h-[calc(100vh-12rem)] w-full overflow-hidden rounded-lg border shadow-lg">
        {/* Sidebar */}
        <div
          className={cn(
            'flex flex-col border-r bg-background transition-all duration-300',
            sidebarOpen ? 'w-96' : 'w-0'
          )}
        >
          {sidebarOpen && (
            <>
              {/* Sidebar Header */}
              <div className="border-b p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-spectron-teal" />
                    <h2 className="font-semibold text-lg">Properties</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-9 border-spectron-teal/20 focus:border-spectron-teal"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery('')}
                      className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {loading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      `${properties.length} properties in view`
                    )}
                  </span>
                  {mapBounds && (
                    <Badge variant="secondary" className="gap-1 bg-spectron-teal/10 text-spectron-teal">
                      <MapIcon className="h-3 w-3" />
                      Active
                    </Badge>
                  )}
                </div>
              </div>

              {/* Properties List */}
              <ScrollArea className="flex-1">
                {error && (
                  <div className="p-4">
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </div>
                )}

                {loading && !properties.length ? (
                  <div className="space-y-4 p-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Card key={i} className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <Skeleton className="mb-2 h-32 w-full" />
                          <Skeleton className="mb-2 h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : properties.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <MapIcon className="mb-4 h-16 w-16 text-muted-foreground" />
                    <h3 className="mb-2 font-semibold text-lg">No properties in view</h3>
                    <p className="text-sm text-muted-foreground">
                      Pan or zoom the map to explore properties in different areas
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 p-4">
                    {properties.map((property) => (
                      <Card
                        key={property.id}
                        className={cn(
                          'cursor-pointer transition-all hover:shadow-md border-0 shadow-sm',
                          selectedProperty === property.id && 'ring-2 ring-spectron-teal'
                        )}
                        onClick={() => setSelectedProperty(property.id)}
                      >
                        <CardContent className="p-3">
                          <Link href={`/properties/${property.id}`} className="block">
                            {/* Image */}
                            {property.images?.[0] && (
                              <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg">
                                <Image
                                  src={property.images[0].url}
                                  alt={property.title}
                                  fill
                                  className="object-cover"
                                />
                                <Badge className="absolute top-2 right-2 bg-spectron-teal text-white">
                                  {property.status}
                                </Badge>
                              </div>
                            )}

                            {/* Title */}
                            <h3 className="mb-1 font-semibold text-sm leading-tight line-clamp-2">
                              {property.title}
                            </h3>

                            {/* Price */}
                            <p className="mb-2 font-bold text-spectron-teal text-xl">
                              {formatPrice(property.price)}
                            </p>

                            {/* Details */}
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Bed className="h-3 w-3" />
                                {property.bhk} BHK
                              </span>
                              <span className="flex items-center gap-1">
                                <Maximize className="h-3 w-3" />
                                {property.area} sq.ft
                              </span>
                              <span className="flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                {property.propertyType}
                              </span>
                            </div>

                            {/* Address */}
                            <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
                              {property.address}
                            </p>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </div>

        {/* Map Container */}
        <div className="relative flex-1">
          {/* Toggle Sidebar Button */}
          {!sidebarOpen && (
            <Button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-4 left-4 z-[1000] gap-2 shadow-lg bg-gradient-to-r from-spectron-gold to-spectron-teal text-white"
            >
              <Layers className="h-4 w-4" />
              Show Properties ({properties.length})
            </Button>
          )}

          {/* Map Controls Info */}
          <Card className="absolute top-4 right-4 z-[1000] shadow-lg border-0">
            <CardContent className="p-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 font-semibold">
                  <Navigation className="h-4 w-4 text-spectron-teal" />
                  Map Controls
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Pan: Click & drag the map</p>
                  <p>• Zoom: Scroll or use +/- buttons</p>
                  <p>• Select: Click property markers</p>
                  <p>• Properties auto-update on move</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute top-20 left-1/2 z-[1000] -translate-x-1/2">
              <Card className="border-0 shadow-lg">
                <CardContent className="flex items-center gap-2 p-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-spectron-teal border-t-transparent" />
                  <span className="text-sm">Loading properties...</span>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Map Component */}
          <MapInterface properties={properties} />
        </div>
      </div>
    </div>
  );
}