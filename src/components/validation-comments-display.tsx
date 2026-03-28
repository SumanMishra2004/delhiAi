'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  MapPin, 
  IndianRupee, 
  Home, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ValidationComment {
  id: string;
  validationType: string;
  comment?: string | null;
  isLocationCorrect?: boolean | null;
  isPriceCorrect?: boolean | null;
  suggestedPrice?: number | null;
  createdAt: Date | string;
}

interface ValidationCommentsDisplayProps {
  comments: ValidationComment[];
}

export function ValidationCommentsDisplay({ comments }: ValidationCommentsDisplayProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No validation comments yet</p>
      </div>
    );
  }

  const getValidationIcon = (type: string) => {
    switch (type) {
      case 'LOCATION_ACCURACY':
        return <MapPin className="h-4 w-4" />;
      case 'PRICE_ACCURACY':
        return <IndianRupee className="h-4 w-4" />;
      case 'PROPERTY_EXISTS':
        return <Home className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getValidationLabel = (type: string) => {
    switch (type) {
      case 'LOCATION_ACCURACY':
        return 'Location Accuracy';
      case 'PRICE_ACCURACY':
        return 'Price Accuracy';
      case 'PROPERTY_EXISTS':
        return 'Property Exists';
      default:
        return 'General Feedback';
    }
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} className="p-4 border-0 bg-gray-50">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="gap-1">
                {getValidationIcon(comment.validationType)}
                {getValidationLabel(comment.validationType)}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </div>
            </div>

            {/* Validation Flags */}
            <div className="flex gap-3">
              {comment.isLocationCorrect !== null && (
                <div className="flex items-center gap-1 text-sm">
                  {comment.isLocationCorrect ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-700">Location Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-700">Location Disputed</span>
                    </>
                  )}
                </div>
              )}
              
              {comment.isPriceCorrect !== null && (
                <div className="flex items-center gap-1 text-sm">
                  {comment.isPriceCorrect ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-700">Price Reasonable</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-700">Price Questioned</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Suggested Price */}
            {comment.suggestedPrice && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Suggested Price:</span> ₹
                  {(comment.suggestedPrice / 100000).toFixed(1)}L
                </p>
              </div>
            )}

            {/* Comment Text */}
            {comment.comment && (
              <p className="text-sm text-gray-700 italic">
                "{comment.comment}"
              </p>
            )}

            {/* Anonymous Badge */}
            <div className="pt-2 border-t">
              <Badge variant="secondary" className="text-xs">
                Anonymous Local Resident
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
