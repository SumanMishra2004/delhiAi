'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  IndianRupee,
  Ruler,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { submitPriceOpinion, submitValidationComment } from '@/actions/opinions';
import Image from 'next/image';

interface PropertyValidationModalProps {
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
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyValidationModal({
  property,
  isOpen,
  onClose,
}: PropertyValidationModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<'opinion' | 'validation'>('opinion');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opinion form state
  const [priceOpinion, setPriceOpinion] = useState<'OVER_PRICED' | 'FAIR_PRICE' | 'UNDER_PRICED' | null>(null);

  // Validation form state
  const [validationType, setValidationType] = useState<'LOCATION_ACCURACY' | 'PRICE_ACCURACY' | 'PROPERTY_EXISTS' | 'GENERAL_FEEDBACK'>('GENERAL_FEEDBACK');
  const [comment, setComment] = useState('');
  const [isLocationCorrect, setIsLocationCorrect] = useState<boolean | undefined>(undefined);
  const [isPriceCorrect, setIsPriceCorrect] = useState<boolean | undefined>(undefined);
  const [suggestedPrice, setSuggestedPrice] = useState('');

  // Generate user identifier for anonymous hash
  const getUserIdentifier = () => {
    if (typeof window === 'undefined') return 'server';
    const userAgent = window.navigator.userAgent;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    return `${userAgent}-${screenRes}`;
  };

  const handleSubmitOpinion = async () => {
    if (!priceOpinion) {
      toast.error('Please select a price opinion');
      return;
    }

    setIsSubmitting(true);

    try {
      const userIdentifier = getUserIdentifier();
      const result = await submitPriceOpinion(property.id, priceOpinion, userIdentifier);

      if (result.success) {
        toast.success('Opinion submitted successfully!');
        setStep('validation');
      } else {
        toast.error(result.error || 'Failed to submit opinion');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitValidation = async () => {
    if (!comment.trim() && validationType === 'GENERAL_FEEDBACK') {
      toast.error('Please provide feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      const userIdentifier = getUserIdentifier();
      const result = await submitValidationComment(
        property.id,
        {
          validationType,
          comment: comment.trim() || undefined,
          isLocationCorrect,
          isPriceCorrect,
          suggestedPrice: suggestedPrice ? parseInt(suggestedPrice) : undefined,
        },
        userIdentifier
      );

      if (result.success) {
        toast.success('Validation submitted successfully!');
        router.refresh();
        onClose();
      } else {
        toast.error(result.error || 'Failed to submit validation');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipValidation = () => {
    toast.success('Thank you for your opinion!');
    router.refresh();
    onClose();
  };

  const sortedImages = [...property.images].sort((a, b) => a.order - b.order);
  const mainImage = sortedImages[0]?.url || '/placeholder-property.jpg';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-spectron-teal" />
            {step === 'opinion' ? 'Community Price Validation' : 'Additional Feedback (Optional)'}
          </DialogTitle>
          <DialogDescription>
            {step === 'opinion' 
              ? 'Help the community by sharing your opinion on this property pricing'
              : 'Provide additional validation to help verify property details'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={mainImage}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-spectron-teal" />
                    <span className="font-semibold text-lg">
                      ₹{(property.price / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{property.bhk} BHK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{property.area} sq ft</span>
                  </div>
                  <div>
                    <Badge variant="outline">{property.propertyType}</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    {property.address.split(',').slice(0, 2).join(', ')} (Nearby)
                  </span>
                </div>
              </div>
            </div>

            {property.description && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Your Privacy is Protected</p>
              <p>
                Your validation is completely anonymous. No personal information is stored or shared.
                Only aggregated community feedback is visible to others.
              </p>
            </div>
          </div>

          {/* Step 1: Price Opinion */}
          {step === 'opinion' && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  What's your opinion on this property's price?
                </Label>
                <RadioGroup
                  value={priceOpinion || ''}
                  onValueChange={(value: string) => setPriceOpinion(value as 'OVER_PRICED' | 'FAIR_PRICE' | 'UNDER_PRICED')}
                >
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        priceOpinion === 'OVER_PRICED'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <RadioGroupItem value="OVER_PRICED" id="over" />
                      <div className="flex items-center gap-2 flex-1">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium">Over Priced</p>
                          <p className="text-xs text-muted-foreground">
                            Price is higher than market value
                          </p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        priceOpinion === 'FAIR_PRICE'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <RadioGroupItem value="FAIR_PRICE" id="fair" />
                      <div className="flex items-center gap-2 flex-1">
                        <Minus className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Fair Price</p>
                          <p className="text-xs text-muted-foreground">
                            Price matches market value
                          </p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        priceOpinion === 'UNDER_PRICED'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <RadioGroupItem value="UNDER_PRICED" id="under" />
                      <div className="flex items-center gap-2 flex-1">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Under Priced</p>
                          <p className="text-xs text-muted-foreground">
                            Price is lower than market value
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitOpinion}
                  disabled={!priceOpinion || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Opinion
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Additional Validation */}
          {step === 'validation' && (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Opinion submitted! You can optionally provide additional feedback below.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Validation Type
                  </Label>
                  <RadioGroup
                    value={validationType}
                    onValueChange={(value: string) => setValidationType(value as 'LOCATION_ACCURACY' | 'PRICE_ACCURACY' | 'PROPERTY_EXISTS' | 'GENERAL_FEEDBACK')}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="LOCATION_ACCURACY" />
                        <span className="text-sm">Location Accuracy</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="PRICE_ACCURACY" />
                        <span className="text-sm">Price Accuracy</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="PROPERTY_EXISTS" />
                        <span className="text-sm">Property Exists</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="GENERAL_FEEDBACK" />
                        <span className="text-sm">General Feedback</span>
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                {validationType === 'LOCATION_ACCURACY' && (
                  <div>
                    <Label className="mb-2 block">Is the location accurate?</Label>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={isLocationCorrect === true ? 'default' : 'outline'}
                        onClick={() => setIsLocationCorrect(true)}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Yes, Correct
                      </Button>
                      <Button
                        type="button"
                        variant={isLocationCorrect === false ? 'destructive' : 'outline'}
                        onClick={() => setIsLocationCorrect(false)}
                        className="flex-1"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        No, Incorrect
                      </Button>
                    </div>
                  </div>
                )}

                {validationType === 'PRICE_ACCURACY' && (
                  <>
                    <div>
                      <Label className="mb-2 block">Is the price reasonable?</Label>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant={isPriceCorrect === true ? 'default' : 'outline'}
                          onClick={() => setIsPriceCorrect(true)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Yes, Reasonable
                        </Button>
                        <Button
                          type="button"
                          variant={isPriceCorrect === false ? 'destructive' : 'outline'}
                          onClick={() => setIsPriceCorrect(false)}
                          className="flex-1"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          No, Unreasonable
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="suggestedPrice">Suggested Price (Optional)</Label>
                      <div className="relative mt-2">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="suggestedPrice"
                          type="number"
                          value={suggestedPrice}
                          onChange={(e) => setSuggestedPrice(e.target.value)}
                          placeholder="e.g., 8000000"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="comment">Additional Comments</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share any additional feedback about this property..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSkipValidation}
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Skip
                </Button>
                <Button
                  onClick={handleSubmitValidation}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Validation
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
