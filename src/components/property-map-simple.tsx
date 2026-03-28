'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (price: number, isSelected: boolean) => {
  const priceText = price >= 10000000 
    ? `₹${(price / 10000000).toFixed(1)}Cr` 
    : `₹${(price / 100000).toFixed(1)}L`;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative">
        <div class="${isSelected 
          ? 'bg-spectron-teal text-white border-2 border-white shadow-xl scale-110' 
          : 'bg-white text-spectron-teal border-2 border-spectron-teal shadow-lg hover:scale-105'
        } px-3 py-1.5 rounded-full font-semibold text-xs whitespace-nowrap transition-all duration-200 cursor-pointer">
          ${priceText}
        </div>
        <div class="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 ${
          isSelected ? 'border-t-spectron-teal' : 'border-t-white'
        } border-l-transparent border-r-transparent"></div>
      </div>
    `,
    iconSize: [80, 40],
    iconAnchor: [40, 40],
  });
};

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

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property | null) => void;
  onBoundsChange: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
  center: [number, number];
}

function MapEventHandler({ onBoundsChange }: { onBoundsChange: (bounds: any) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
  });

  return null;
}

function MapUpdater({ selectedProperty }: { selectedProperty: Property | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty) {
      map.setView([selectedProperty.latitude, selectedProperty.longitude], 15, {
        animate: true,
      });
    }
  }, [selectedProperty, map]);

  return null;
}

export default function PropertyMap({
  properties,
  selectedProperty,
  onPropertySelect,
  onBoundsChange,
  center,
}: PropertyMapProps) {
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (!map || properties.length === 0) return;

    // Fit bounds to show all properties
    const bounds = L.latLngBounds(
      properties.map((p) => [p.latitude, p.longitude] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [map, properties]);

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      ref={setMap}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventHandler onBoundsChange={onBoundsChange} />
      <MapUpdater selectedProperty={selectedProperty} />
      
      {properties.map((property) => {
        const isSelected = selectedProperty?.id === property.id;
        const icon = createCustomIcon(property.price, isSelected);

        return (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => onPropertySelect(property),
            }}
          >
            <Popup>
              <div className="p-2 min-w-50">
                <h3 className="font-bold text-sm mb-1">{property.title}</h3>
                <p className="text-xs text-gray-600 mb-2">
                  {property.bhk} BHK • {property.area} sq ft
                </p>
                <p className="text-sm font-semibold text-spectron-teal">
                  {property.price >= 10000000 
                    ? `₹${(property.price / 10000000).toFixed(2)} Cr` 
                    : `₹${(property.price / 100000).toFixed(2)} L`
                  }
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
