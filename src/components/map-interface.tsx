'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  X,
  MapPin,
  Home,
  Maximize,
  Loader2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const PropertyMap = dynamic(() => import('@/components/property-map-simple'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-muted flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-spectron-teal" />
    </div>
  ),
});

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
  images?: Array<{ id: string; url: string; order: number }>;
}

interface MapInterfaceProps {
  properties: Property[];
}

export function MapInterface({ properties }: MapInterfaceProps) {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [selectedBHK, setSelectedBHK] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [mapBounds, setMapBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);
  
  // Default center (Kolkata)
  const mapCenter: [number, number] = [22.5726, 88.3639];

  const applyFilters = useCallback(() => {
    let filtered = [...properties];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.propertyType.toLowerCase().includes(query)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // BHK filter
    if (selectedBHK.length > 0) {
      filtered = filtered.filter((p) => selectedBHK.includes(p.bhk));
    }

    // Property type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((p) => selectedTypes.includes(p.propertyType));
    }

    return filtered;
  }, [properties, searchQuery, priceRange, selectedBHK, selectedTypes]);

  useEffect(() => {
    setFilteredProperties(applyFilters());
  }, [applyFilters]);

  const handleBHKToggle = (bhk: number) => {
    setSelectedBHK((prev) =>
      prev.includes(bhk) ? prev.filter((b) => b !== bhk) : [...prev, bhk]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 50000000]);
    setSelectedBHK([]);
    setSelectedTypes([]);
    setMapBounds(null);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const propertyTypes = ['APARTMENT', 'VILLA', 'PLOT', 'COMMERCIAL', 'PENTHOUSE'];
  const bhkOptions = [1, 2, 3, 4, 5];

  return (
    <div className="relative h-[calc(100vh-200px)]">
      {/* Filters Sidebar */}
      <div
        className={cn(
          'absolute left-0 top-0 z-10 h-full w-80 bg-background shadow-xl transition-transform duration-300',
          showFilters ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-spectron-teal" />
                Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)] overflow-y-auto p-4 space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search Location</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by area, locality..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label>Price Range</Label>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                min={0}
                max={50000000}
                step={100000}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>

            {/* BHK Filter */}
            <div className="space-y-3">
              <Label>BHK Configuration</Label>
              <div className="flex flex-wrap gap-2">
                {bhkOptions.map((bhk) => (
                  <Badge
                    key={bhk}
                    variant={selectedBHK.includes(bhk) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleBHKToggle(bhk)}
                  >
                    {bhk} BHK
                  </Badge>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-3">
              <Label>Property Type</Label>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleTypeToggle(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="p-3 bg-heritage-cream/30 rounded-lg">
              <p className="text-sm font-medium">
                {mapBounds 
                  ? filteredProperties.filter(p => 
                      p.latitude >= mapBounds.south && 
                      p.latitude <= mapBounds.north && 
                      p.longitude >= mapBounds.west && 
                      p.longitude <= mapBounds.east
                    ).length 
                  : filteredProperties.length} properties found in area
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Move the map to search in different areas
              </p>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={resetFilters}
            >
              Reset All Filters
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Toggle Filters Button */}
      {!showFilters && (
        <Button
          className="absolute left-4 top-4 z-10 shadow-lg"
          onClick={() => setShowFilters(true)}
        >
          <ChevronRight className="h-4 w-4 mr-2" />
          Show Filters
        </Button>
      )}

      {/* Map Container */}
      <div className={cn('h-full transition-all duration-300', showFilters ? 'pl-80' : 'pl-0')}>
        <PropertyMap
          properties={filteredProperties}
          selectedProperty={selectedProperty}
          onPropertySelect={setSelectedProperty}
          onBoundsChange={setMapBounds}
          center={mapCenter}
        />
      </div>

      {/* Property Details Card */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md px-4">
          <Card className="shadow-2xl border-2 border-spectron-teal/50">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 z-10 bg-white/90 hover:bg-white"
                onClick={() => setSelectedProperty(null)}
              >
                <X className="h-4 w-4" />
              </Button>

              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div className="relative h-48 w-full">
                  <img
                    src={selectedProperty.images[0].url}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <Badge className="absolute bottom-2 left-2 bg-spectron-teal">
                    {selectedProperty.status}
                  </Badge>
                </div>
              )}

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-spectron-teal">
                    {formatPrice(selectedProperty.price)}
                  </h3>
                  <h4 className="font-semibold mt-1">{selectedProperty.title}</h4>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedProperty.bhk} BHK</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedProperty.area} sq ft</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-muted-foreground line-clamp-2">
                    {selectedProperty.address}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/properties/${selectedProperty.id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-spectron-gold to-spectron-teal">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
