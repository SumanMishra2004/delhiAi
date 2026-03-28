'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  IndianRupee, 
  Users, 
  MessageSquare,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AdminPropertyCardProps {
  property: any;
}

export function AdminPropertyCard({ property }: AdminPropertyCardProps) {
  const opinionData = property.opinionGroup?.aggregation;
  const totalVotes = opinionData?.totalVotes || 0;
  const commentsCount = property.validationComments?.length || 0;
  
  // Calculate consensus
  let consensus: 'OVER_PRICED' | 'FAIR_PRICE' | 'UNDER_PRICED' | null = null;
  if (opinionData && totalVotes >= 5) {
    const max = Math.max(
      opinionData.overPricedCount,
      opinionData.fairPriceCount,
      opinionData.underPricedCount
    );
    if (opinionData.overPricedCount === max) consensus = 'OVER_PRICED';
    else if (opinionData.fairPriceCount === max) consensus = 'FAIR_PRICE';
    else consensus = 'UNDER_PRICED';
  }

  const imageUrl = property.images?.[0]?.url || '/placeholder-property.jpg';

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate mb-1">
                  {property.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{property.address}</span>
                </div>
              </div>
              <Badge variant={property.verificationStatus === 'PENDING' ? 'secondary' : 'default'}>
                {property.verificationStatus}
              </Badge>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-4 mb-3 text-sm">
              <div className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4 text-spectron-teal" />
                <span className="font-semibold">
                  ₹{(property.price / 100000).toFixed(1)}L
                </span>
              </div>
              <div className="text-muted-foreground">
                {property.bhk} BHK • {property.area} sq ft
              </div>
            </div>

            {/* Community Signals */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{totalVotes}</span>
                <span className="text-muted-foreground">opinions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <span className="font-medium">{commentsCount}</span>
                <span className="text-muted-foreground">comments</span>
              </div>
              {property.urbanSprawlData?.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">Growth data available</span>
                </div>
              )}
            </div>

            {/* Price Consensus */}
            {consensus && (
              <div className="mb-3">
                <Badge 
                  variant="outline"
                  className={
                    consensus === 'OVER_PRICED' 
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : consensus === 'FAIR_PRICE'
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-blue-300 bg-blue-50 text-blue-700'
                  }
                >
                  {consensus === 'OVER_PRICED' && <AlertCircle className="h-3 w-3 mr-1" />}
                  {consensus === 'FAIR_PRICE' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {consensus === 'UNDER_PRICED' && <TrendingUp className="h-3 w-3 mr-1" />}
                  Community: {consensus.replace('_', ' ')}
                </Badge>
              </div>
            )}

            {/* Owner Info */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Listed by: <span className="font-medium">{property.user?.name}</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {property.user?.role}
                </Badge>
              </div>
              <Link href={`/dashboard/admin/verify/${property.id}`}>
                <Button size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Review
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
