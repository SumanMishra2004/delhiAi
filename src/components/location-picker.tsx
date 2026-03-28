'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

function LocationMarker({ position, setPosition }: { 
  position: [number, number]; 
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return <Marker position={position} />;
}

export default function LocationPicker({ 
  initialLat = 22.5726, 
  initialLng = 88.3639,
  onLocationSelect 
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Reverse geocoding to get address from coordinates
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Search location by query
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Kolkata')}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPosition);
        setAddress(data[0].display_name);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    getAddressFromCoords(position[0], position[1]);
  }, [position]);

  const handleConfirm = () => {
    onLocationSelect(position[0], position[1], address);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search location in Kolkata..."
            className="pl-10"
          />
        </div>
        <Button 
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          variant="outline"
        >
          Search
        </Button>
      </div>

      {/* Map */}
      <div className="h-96 rounded-lg overflow-hidden border-2 border-spectron-teal/30">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          key={`${position[0]}-${position[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {/* Selected Location Info */}
      <div className="p-4 bg-heritage-cream/30 rounded-lg space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-spectron-teal mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Selected Location</p>
            <p className="text-xs text-muted-foreground">
              Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
            </p>
            {address && (
              <p className="text-xs text-muted-foreground mt-1 break-words">
                {address}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <Button
        type="button"
        onClick={handleConfirm}
        className="w-full bg-gradient-to-r from-spectron-gold to-spectron-teal"
      >
        Confirm Location
      </Button>
    </div>
  );
}
