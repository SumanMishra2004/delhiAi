export const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'PLOT', label: 'Plot' },
] as const;

export const FURNISHING_STATUS = [
  { value: 'UNFURNISHED', label: 'Unfurnished' },
  { value: 'SEMI_FURNISHED', label: 'Semi Furnished' },
  { value: 'FULLY_FURNISHED', label: 'Fully Furnished' },
] as const;

export const BHK_OPTIONS = [1, 2, 3, 4, 5] as const;

export const PRICE_RANGES = [
  { label: 'Under ₹50L', min: 0, max: 5000000 },
  { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
  { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
  { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000 },
  { label: 'Above ₹5Cr', min: 50000000, max: 999999999 },
] as const;
