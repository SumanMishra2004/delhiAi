'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateUserLocation } from '@/actions/properties';
import { useRouter } from 'next/navigation';

interface LocationUpdaterProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

export function LocationUpdater({ 
  variant = 'ghost', 
  size = 'default',
  className = '',
  showText = true 
}: LocationUpdaterProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleUpdateLocation = async () => {
    console.log('🔍 Starting location update...');
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error('❌ Geolocation not supported');
      toast.error('Geolocation is not supported by your browser. Please use a modern browser like Chrome, Firefox, or Edge.');
      return;
    }

    // Check if we're on HTTPS or localhost
    const isSecure = window.location.protocol === 'https:' || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
    
    if (!isSecure) {
      console.error('❌ Not on HTTPS');
      toast.error('Location access requires HTTPS. Please use https:// or localhost.');
      return;
    }

    setIsUpdating(true);
    toast.info('Fetching your location...', {
      description: 'This may take a few seconds'
    });
    console.log('📍 Requesting geolocation...');

    // First, check if permissions are already granted
    if (navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        console.log('📋 Permission status:', permissionStatus.state);
        
        if (permissionStatus.state === 'denied') {
          setIsUpdating(false);
          toast.error('Location permission is blocked. Please click the location icon in your browser address bar and allow location access.', {
            duration: 7000
          });
          return;
        }
      } catch (e) {
        console.warn('⚠️ Could not check permission status:', e);
      }
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('✅ Location received:', { latitude, longitude });

        try {
          // Update user location in database (backend will handle reverse geocoding)
          console.log('💾 Updating database...');
          const result = await updateUserLocation(latitude, longitude);
          console.log('📊 Database update result:', result);

          if (result.success) {
            toast.success('Location updated successfully!', {
              description: result.address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            });
            console.log('✅ Location update complete!');
            router.refresh();
          } else {
            console.error('❌ Database update failed:', result.error);
            toast.error(result.error || 'Failed to update location');
          }
        } catch (error) {
          console.error('❌ Error updating location:', error);
          toast.error('Failed to update location');
        } finally {
          setIsUpdating(false);
        }
      },
      (error) => {
        console.error('❌ Geolocation error:', error);
        console.error('Error code:', error?.code);
        console.error('Error message:', error?.message);
        setIsUpdating(false);
        
        let errorMessage = 'Failed to get location';
        
        // Check if error has code property
        if (error && typeof error.code === 'number') {
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
              console.error('❌ Permission denied');
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage = 'Location information unavailable. Please check if location services are enabled on your device.';
              console.error('❌ Position unavailable');
              break;
            case 3: // TIMEOUT
              errorMessage = 'Location request timed out. This can happen on desktop computers. Try:\n• Moving near a window for better signal\n• Using a mobile device\n• Refreshing and trying again';
              console.error('❌ Timeout');
              break;
            default:
              errorMessage = 'Unable to retrieve location. Please check your browser and device settings.';
          }
        } else {
          // Generic error without code
          errorMessage = 'Unable to access location. Please ensure:\n• Location services are enabled on your device\n• Browser has permission to access location\n• You are using HTTPS or localhost';
          console.error('❌ Unknown geolocation error');
        }
        
        toast.error(errorMessage, {
          duration: 5000,
        });
      },
      {
        enableHighAccuracy: false, // Changed to false - uses WiFi/IP instead of GPS (faster on desktop)
        timeout: 30000, // Increased to 30 seconds
        maximumAge: 300000 // Allow cached location up to 5 minutes old
      }
    );
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
      onClick={handleUpdateLocation}
      disabled={isUpdating}
    >
      {isUpdating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {showText && <span>Updating...</span>}
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4" />
          {showText && <span>Update Location</span>}
        </>
      )}
    </Button>
  );
}
