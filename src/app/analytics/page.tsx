import { Suspense } from 'react';
import { UrbanSprawlChart } from '@/components/urban-sprawl-chart';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';import { PricePredictionChart } from '@/components/price-prediction-chart';import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  MapPin,
  Building2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  let user = null;

  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error('Error fetching user:', error);
  }

  // Mock data for urban growth (1975-2030)
  const urbanGrowthStats = {
    totalGrowth: 285,
    yearlyAverage: 5.2,
    peakYear: 2010,
    projectedGrowth: 45
  };

  // Mock urban sprawl data
  const urbanSprawlData = [
    { year: 1975, urbanSqKm: 185.2, percentage: 12.5 },
    { year: 1980, urbanSqKm: 210.8, percentage: 14.2 },
    { year: 1985, urbanSqKm: 245.6, percentage: 16.6 },
    { year: 1990, urbanSqKm: 289.4, percentage: 19.5 },
    { year: 1995, urbanSqKm: 342.1, percentage: 23.1 },
    { year: 2000, urbanSqKm: 398.7, percentage: 26.9 },
    { year: 2005, urbanSqKm: 465.3, percentage: 31.4 },
    { year: 2010, urbanSqKm: 542.8, percentage: 36.6 },
    { year: 2015, urbanSqKm: 618.5, percentage: 41.7 },
    { year: 2020, urbanSqKm: 695.2, percentage: 46.9 },
    { year: 2025, urbanSqKm: 758.4, percentage: 51.2 },
    { year: 2030, urbanSqKm: 812.6, percentage: 54.8 }
  ];

  const marketTrends = [
    { area: 'Salt Lake', growth: 12.5, trend: 'up' },
    { area: 'New Town', growth: 18.3, trend: 'up' },
    { area: 'Park Street', growth: -2.1, trend: 'down' },
    { area: 'Ballygunge', growth: 8.7, trend: 'up' },
    { area: 'Howrah', growth: 0.2, trend: 'stable' }
  ];

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="border-b border-border/50 bg-gradient-to-r from-heritage-cream to-background py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <Badge className="mb-3 border-spectron-gold/30 bg-spectron-gold/10 text-spectron-gold">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Urban Analytics
                </Badge>
                <h1 className="mb-2 text-4xl font-bold">
                  Kolkata Urban Growth Analytics
                </h1>
                <p className="text-lg text-muted-foreground">
                  Comprehensive analysis of Kolkata&apos;s urban development from 1975 to 2030
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link href="/properties">
                  <Button variant="outline" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    View Properties
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="gap-2 bg-gradient-to-r from-spectron-gold to-spectron-teal">
                    <Sparkles className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Key Metrics */}
            <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="spectron-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Growth</p>
                      <p className="text-3xl font-bold text-spectron-teal">
                        {urbanGrowthStats.totalGrowth}%
                      </p>
                    </div>
                    <div className="rounded-full bg-spectron-teal/10 p-3">
                      <TrendingUp className="h-6 w-6 text-spectron-teal" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Since 1975</p>
                </CardContent>
              </Card>

              <Card className="spectron-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Yearly Average</p>
                      <p className="text-3xl font-bold text-spectron-gold">
                        {urbanGrowthStats.yearlyAverage}%
                      </p>
                    </div>
                    <div className="rounded-full bg-spectron-gold/10 p-3">
                      <Calendar className="h-6 w-6 text-spectron-gold" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Growth rate</p>
                </CardContent>
              </Card>

              <Card className="spectron-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Peak Year</p>
                      <p className="text-3xl font-bold text-spectron-crimson">
                        {urbanGrowthStats.peakYear}
                      </p>
                    </div>
                    <div className="rounded-full bg-spectron-crimson/10 p-3">
                      <BarChart3 className="h-6 w-6 text-spectron-crimson" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Highest growth</p>
                </CardContent>
              </Card>

              <Card className="spectron-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Projected 2030</p>
                      <p className="text-3xl font-bold text-primary">
                        +{urbanGrowthStats.projectedGrowth}%
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Expected growth</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Urban Sprawl Chart */}
              <Card className="spectron-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-spectron-teal" />
                    Urban Sprawl Timeline (1975-2030)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={
                    <div className="flex h-64 items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="mx-auto mb-2 h-8 w-8 text-spectron-teal animate-pulse" />
                        <p className="text-sm text-muted-foreground">Loading chart...</p>
                      </div>
                    </div>
                  }>
                    <UrbanSprawlChart data={urbanSprawlData} />
                  </Suspense>
                </CardContent>
              </Card>

              {/* Interactive Area Chart */}
              <Card className="spectron-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-spectron-gold" />
                    Property Price Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={
                    <div className="flex h-64 items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="mx-auto mb-2 h-8 w-8 text-spectron-gold animate-pulse" />
                        <p className="text-sm text-muted-foreground">Loading chart...</p>
                      </div>
                    </div>
                  }>
                    <ChartAreaInteractive />
                  </Suspense>
                </CardContent>
              </Card>

              {/* Price Prediction to 2040 */}
              <div className="mt-8">
                <PricePredictionChart />
              </div>
            </div>

            {/* Market Trends by Area */}
            <Card className="mt-8 spectron-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-spectron-crimson" />
                  Market Trends by Area
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketTrends.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-spectron-teal/10 p-2">
                          <Building2 className="h-4 w-4 text-spectron-teal" />
                        </div>
                        <div>
                          <p className="font-medium">{area.area}</p>
                          <p className="text-sm text-muted-foreground">Kolkata</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${
                          area.trend === 'up' ? 'text-green-600' : 
                          area.trend === 'down' ? 'text-red-600' : 
                          'text-muted-foreground'
                        }`}>
                          {area.growth > 0 ? '+' : ''}{area.growth}%
                        </span>
                        {area.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-600" />}
                        {area.trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-600" />}
                        {area.trend === 'stable' && <Minus className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights Section */}
            <Card className="mt-8 spectron-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-spectron-gold" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-spectron-teal">Growth Patterns</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Rapid expansion in IT corridors (Salt Lake, New Town)</li>
                      <li>• Steady growth in traditional areas (Ballygunge, Park Street)</li>
                      <li>• Infrastructure development driving eastern expansion</li>
                      <li>• Metro connectivity boosting property values</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-spectron-crimson">Future Projections</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• New Town expected to see 25% growth by 2030</li>
                      <li>• Smart city initiatives driving development</li>
                      <li>• Sustainable housing projects gaining momentum</li>
                      <li>• Transportation hubs creating new hotspots</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}