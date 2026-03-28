/**
 * Anonymous Opinion System Types (Admin-Controlled Trust)
 * 
 * PRIVACY PRINCIPLE: These types never expose user identities or any 
 * linkable information between voters and their opinions.
 * Anonymity handled through server-side hashing and session management.
 */

export enum OpinionTag {
  OVER_PRICED = 'OVER_PRICED',
  FAIR_PRICE = 'FAIR_PRICE',
  UNDER_PRICED = 'UNDER_PRICED',
}

export enum ValidationType {
  LOCATION_ACCURACY = 'LOCATION_ACCURACY',
  PRICE_ACCURACY = 'PRICE_ACCURACY',
  PROPERTY_EXISTS = 'PROPERTY_EXISTS',
  GENERAL_FEEDBACK = 'GENERAL_FEEDBACK',
}

export enum PropertyVerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
}

export interface OpinionStats {
  totalVotes: number;
  overPricedCount: number;
  fairPriceCount: number;
  underPricedCount: number;
  overPricedPercentage: number;
  fairPricePercentage: number;
  underPricedPercentage: number;
}

export interface PropertyOpinionGroup {
  id: string;
  propertyId: string;
  radiusKm: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EligibilityCheck {
  isEligible: boolean;
  distanceKm?: number;
  reason?: string;
  anonymousToken?: string; // Anonymous token for voting
  expiresIn?: number;
}

export interface ValidationComment {
  id: string;
  validationType: ValidationType;
  comment?: string;
  isLocationCorrect?: boolean;
  isPriceCorrect?: boolean;
  suggestedPrice?: number;
  createdAt: Date;
}

export interface ValidationSummary {
  totalComments: number;
  locationAccurate: number;
  locationInaccurate: number;
  priceAccurate: number;
  priceInaccurate: number;
  averageSuggestedPrice?: number;
}

export interface PropertyNotification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  property: {
    id: string;
    title: string;
    address: string;
    price: number;
    propertyType: string;
    verificationStatus: PropertyVerificationStatus;
    images: Array<{ url: string }>;
  };
}

// API Response types
export interface OpinionSubmissionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface OpinionStatsResponse {
  stats: OpinionStats;
  lastUpdated: string;
}

export interface ValidationSubmissionResponse {
  success: boolean;
  message?: string;
  error?: string;
}
