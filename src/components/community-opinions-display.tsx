'use client';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Users, AlertCircle } from 'lucide-react';

interface OpinionsData {
  totalVotes: number;
  overPricedCount: number;
  fairPriceCount: number;
  underPricedCount: number;
  consensus: 'OVER_PRICED' | 'FAIR_PRICE' | 'UNDER_PRICED' | null;
}

interface CommunityOpinionsDisplayProps {
  opinions: OpinionsData;
}

export function CommunityOpinionsDisplay({ opinions }: CommunityOpinionsDisplayProps) {
  const { totalVotes, overPricedCount, fairPriceCount, underPricedCount, consensus } = opinions;

  if (totalVotes === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No community opinions yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Waiting for nearby residents to share their price feedback
        </p>
      </div>
    );
  }

  const overPricedPercent = (overPricedCount / totalVotes) * 100;
  const fairPricePercent = (fairPriceCount / totalVotes) * 100;
  const underPricedPercent = (underPricedCount / totalVotes) * 100;

  return (
    <div className="space-y-6">
      {/* Total Votes */}
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="text-3xl font-bold text-blue-900">{totalVotes}</span>
        </div>
        <p className="text-sm text-blue-700">Community Members Participated</p>
      </div>

      {/* Consensus Badge */}
      {consensus && (
        <div className="text-center">
          <Badge 
            variant="outline"
            className={`text-lg py-2 px-4 ${
              consensus === 'OVER_PRICED' 
                ? 'border-red-300 bg-red-50 text-red-700'
                : consensus === 'FAIR_PRICE'
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-blue-300 bg-blue-50 text-blue-700'
            }`}
          >
            {consensus === 'OVER_PRICED' && <TrendingDown className="h-5 w-5 mr-2" />}
            {consensus === 'FAIR_PRICE' && <Minus className="h-5 w-5 mr-2" />}
            {consensus === 'UNDER_PRICED' && <TrendingUp className="h-5 w-5 mr-2" />}
            Community Consensus: {consensus.replace('_', ' ')}
          </Badge>
        </div>
      )}

      {/* Opinion Breakdown */}
      <div className="space-y-4">
        {/* Over Priced */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="font-medium">Over Priced</span>
            </div>
            <span className="text-muted-foreground">
              {overPricedCount} ({overPricedPercent.toFixed(0)}%)
            </span>
          </div>
          <Progress value={overPricedPercent} className="h-2 bg-red-100" />
        </div>

        {/* Fair Price */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-green-600" />
              <span className="font-medium">Fair Price</span>
            </div>
            <span className="text-muted-foreground">
              {fairPriceCount} ({fairPricePercent.toFixed(0)}%)
            </span>
          </div>
          <Progress value={fairPricePercent} className="h-2 bg-green-100" />
        </div>

        {/* Under Priced */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Under Priced</span>
            </div>
            <span className="text-muted-foreground">
              {underPricedCount} ({underPricedPercent.toFixed(0)}%)
            </span>
          </div>
          <Progress value={underPricedPercent} className="h-2 bg-blue-100" />
        </div>
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          All opinions are anonymous and collected from verified users within 5km radius. 
          This data helps ensure transparent, community-validated pricing.
        </p>
      </div>
    </div>
  );
}
