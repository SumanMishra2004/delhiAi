'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { PropertyValidationModal } from './property-validation-modal';

interface PropertyValidationButtonProps {
  property: {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    area: number;
    bhk: number;
    propertyType: string;
    furnishing: string;
    address: string;
    images: Array<{ url: string; order: number }>;
  };
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function PropertyValidationButton({
  property,
  variant = 'default',
  size = 'default',
  className = '',
}: PropertyValidationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`gap-2 ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        <CheckCircle className="h-4 w-4" />
        Validate Property
      </Button>

      <PropertyValidationModal
        property={property}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
