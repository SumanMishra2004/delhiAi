'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RotateCcw } from 'lucide-react';
import type { SearchFilters } from '@/types';

interface PropertyFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

export function PropertyFilters({ onFiltersChange }: PropertyFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 5000]);
  const [selectedBHK, setSelectedBHK] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFurnishing, setSelectedFurnishing] = useState<string[]>([]);

  const propertyTypes = ['APARTMENT', 'VILLA', 'PLOT', 'COMMERCIAL', 'PENTHOUSE'];
  const furnishingOptions = ['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'];
  const bhkOptions = [1, 2, 3, 4, 5];

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleBHKToggle = (bhk: number) => {
    const updated = selectedBHK.includes(bhk)
      ? selectedBHK.filter(b => b !== bhk)
      : [...selectedBHK, bhk];
    setSelectedBHK(updated);
    applyFilters({ bhk: updated });
  };

  const handleTypeToggle = (type: string) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updated);
    applyFilters({ propertyType: updated });
  };

  const handleFurnishingToggle = (furnishing: string) => {
    const updated = selectedFurnishing.includes(furnishing)
      ? selectedFurnishing.filter(f => f !== furnishing)
      : [...selectedFurnishing, furnishing];
    setSelectedFurnishing(updated);
    applyFilters({ furnishing: updated });
  };

  const applyFilters = (partialFilters: Partial<SearchFilters> = {}) => {
    const filters: SearchFilters = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minArea: areaRange[0],
      maxArea: areaRange[1],
      bhk: selectedBHK,
      propertyType: selectedTypes,
      furnishing: selectedFurnishing,
      ...partialFilters,
    };
    onFiltersChange(filters);
  };

  const resetFilters = () => {
    setPriceRange([0, 50000000]);
    setAreaRange([0, 5000]);
    setSelectedBHK([]);
    setSelectedTypes([]);
    setSelectedFurnishing([]);
    onFiltersChange({});
  };

  return (
    <div className="space-y-6">
      {/* Reset Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full gap-2"
        onClick={resetFilters}
      >
        <RotateCcw className="h-4 w-4" />
        Reset Filters
      </Button>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Price Range</Label>
        <div className="space-y-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            onValueCommit={() => applyFilters()}
            min={0}
            max={50000000}
            step={100000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Area Range */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Area (sq ft)</Label>
        <div className="space-y-2">
          <Slider
            value={areaRange}
            onValueChange={(value) => setAreaRange(value as [number, number])}
            onValueCommit={() => applyFilters()}
            min={0}
            max={5000}
            step={100}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{areaRange[0]} sq ft</span>
            <span>{areaRange[1]} sq ft</span>
          </div>
        </div>
      </div>

      {/* BHK Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">BHK</Label>
        <div className="flex flex-wrap gap-2">
          {bhkOptions.map((bhk) => (
            <Badge
              key={bhk}
              variant={selectedBHK.includes(bhk) ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => handleBHKToggle(bhk)}
            >
              {bhk} BHK
            </Badge>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Property Type</Label>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
              />
              <label
                htmlFor={`type-${type}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {type.replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Furnishing Status */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Furnishing</Label>
        <div className="space-y-2">
          {furnishingOptions.map((furnishing) => (
            <div key={furnishing} className="flex items-center space-x-2">
              <Checkbox
                id={`furnishing-${furnishing}`}
                checked={selectedFurnishing.includes(furnishing)}
                onCheckedChange={() => handleFurnishingToggle(furnishing)}
              />
              <label
                htmlFor={`furnishing-${furnishing}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {furnishing.replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <Button 
        className="w-full bg-gradient-to-r from-spectron-gold to-spectron-teal"
        onClick={() => applyFilters()}
      >
        Apply Filters
      </Button>
    </div>
  );
}
