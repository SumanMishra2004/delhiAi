'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyImage {
  id: string;
  url: string;
  order: number;
}

interface PropertyGalleryProps {
  images: PropertyImage[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={sortedImages[currentIndex].url}
          alt={`Property image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
        
        {/* Navigation Arrows */}
        {sortedImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-spectron-teal scale-105'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
