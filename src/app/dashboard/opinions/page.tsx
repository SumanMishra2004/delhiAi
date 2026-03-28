import { Suspense } from 'react';
import { getProperties } from '@/actions/properties';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  TrendingUp,
  TrendingDown,
  Building2,
  Shield,
  Users,
  BarChart3,
  Eye,
  AlertCircle,
  CheckCircle2,
  Minus
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OpinionsPage() {
  let userProperties: any[] = [];
  let user = null;

  try {
    const response = await getProperties();
    // Mock: Filter properties that belong to the user (in real app, filter by userId)
    userProperties = response.data?.slice(0, 4) || [];
    user = await getCurrentUser();
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  // Mock opinion stats
  const opinionStats = {
    totalOpinions: 89,
    thisWeek: 12,
    avgRating: 4.2,
    responseRate: 78
  };

  // Mock aggregated opinions for properties
  const mockOpinions = userProperties.map((property, index) => ({
    propertyId: property.id,
    propertyTitle: property.title,
    totalVotes: Math.floor(Math.random() * 50) + 10,
    overPricedCount: Math.floor(Math.random() * 15) + 2,
    fairPriceCount: Math.floor(Math.random() * 25) + 15,
    underPricedCount: Math.floor(Math.random() * 10) + 1,
    lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Anonymous Opinions</h1>
          <p className="text-muted-foreground">
            Community feedback on your property listings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="gap-1 bg-spectron-crimson/10 text-spectron-crimson">
            <Shield className="h-3 w-3" />
            Anonymous Feedback
          </Badge>
          <Link href="/dashboard/validation">
            <Button className="gap-2 bg-gradient-to-r from-spectron-gold to-spectron-teal">
              <MessageSquare className="h-4 w-4" />
              Validate Properties
            </Button>
          </Link>
        </div>
      </div>

      {/* Opinion Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="spectron-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Opinions</p>
                <p className="text-3xl font-bold text-spectron-teal">
                  {opinionStats.totalOpinions}
                </p>
              </div>
              <div className="rounded-full bg-spectron-teal/10 p-3">
                <MessageSquare className="h-6 w-6 text-spectron-teal" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="spectron-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold text-spectron-gold">
                  +{opinionStats.thisWeek}
                </p>
              </div>
              <div className="rounded-full bg-spectron-gold/10 p-3">
                <TrendingUp className="h-6 w-6 text-spectron-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="spectron-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-3xl font-bold text-spectron-crimson">
                  {opinionStats.avgRating}/5
                </p>
              </div>
              <div className="rounded-full bg-spectron-crimson/10 p-3">
                <BarChart3 className="h-6 w-6 text-spectron-crimson" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="spectron-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-3xl font-bold text-primary">
                  {opinionStats.responseRate}%
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How Opinions Work */}
      <Card className="spectron-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-spectron-teal" />
            How Anonymous Opinions Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-spectron-teal/10">
                <Users className="h-6 w-6 text-spectron-teal" />
              </div>
              <h3 className="mb-2 font-semibold">Community Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Neighbors within 5km radius can provide anonymous feedback on your property pricing
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-spectron-gold/10">
                <Eye className="h-6 w-6 text-spectron-gold" />
              </div>
              <h3 className="mb-2 font-semibold">Aggregated Data</h3>
              <p className="text-sm text-muted-foreground">
                Individual opinions are combined into anonymous statistics to protect privacy
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-spectron-crimson/10">
                <BarChart3 className="h-6 w-6 text-spectron-crimson" />
              </div>
              <h3 className="mb-2 font-semibold">Market Insights</h3>
              <p className="text-sm text-muted-foreground">
                Use feedback to adjust pricing and improve your property's market appeal
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Opinions */}
      <Card className="spectron-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-spectron-gold" />
            Your Property Opinions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockOpinions.length > 0 ? (
            <div className="space-y-6">
              {mockOpinions.map((opinion) => {
                const totalVotes = opinion.totalVotes;
                const overPricedPercent = Math.round((opinion.overPricedCount / totalVotes) * 100);
                const fairPricePercent = Math.round((opinion.fairPriceCount / totalVotes) * 100);
                const underPricedPercent = Math.round((opinion.underPricedCount / totalVotes) * 100);
                
                const majorityOpinion = 
                  opinion.fairPriceCount > opinion.overPricedCount && opinion.fairPriceCount > opinion.underPricedCount ? 'fair' :
                  opinion.overPricedCount > opinion.underPricedCount ? 'overpriced' : 'underpriced';

                return (
                  <div key={opinion.propertyId} className="p-6 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{opinion.propertyTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {opinion.lastUpdated.toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`gap-1 ${
                            majorityOpinion === 'fair' ? 'border-green-200 bg-green-50 text-green-700' :
                            majorityOpinion === 'overpriced' ? 'border-red-200 bg-red-50 text-red-700' :
                            'border-blue-200 bg-blue-50 text-blue-700'
                          }`}
                        >
                          {majorityOpinion === 'fair' && <CheckCircle2 className="h-3 w-3" />}
                          {majorityOpinion === 'overpriced' && <TrendingDown className="h-3 w-3" />}
                          {majorityOpinion === 'underpriced' && <TrendingUp className="h-3 w-3" />}
                          {majorityOpinion === 'fair' ? 'Fair Price' : 
                           majorityOpinion === 'overpriced' ? 'Over-priced' : 'Under-priced'}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <Users className="h-3 w-3" />
                          {totalVotes} opinions
                        </Badge>
                      </div>
                    </div>

                    {/* Opinion Breakdown */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium">Over-priced</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500 transition-all duration-300"
                              style={{ width: `${overPricedPercent}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {overPricedPercent}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Fair price</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 transition-all duration-300"
                              style={{ width: `${fairPricePercent}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {fairPricePercent}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Under-priced</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${underPricedPercent}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {underPricedPercent}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Price Analysis
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">No Opinions Yet</h3>
              <p className="text-muted-foreground mb-4">
                Your properties haven't received community feedback yet. Share your listings to get opinions.
              </p>
              <Link href="/dashboard/properties/new">
                <Button className="gap-2 bg-gradient-to-r from-spectron-gold to-spectron-teal">
                  <Building2 className="h-4 w-4" />
                  List a Property
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="spectron-card border-spectron-crimson/30 bg-spectron-crimson/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-spectron-crimson mt-0.5" />
            <div>
              <h3 className="font-semibold text-spectron-crimson mb-2">Privacy & Anonymity</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Individual opinions are never shown - only aggregated statistics</li>
                <li>• Community members remain completely anonymous</li>
                <li>• Only neighbors within 5km radius can provide opinions</li>
                <li>• Opinions help improve market transparency and fair pricing</li>
                <li>• All data is moderated by admins to prevent abuse</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}