import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getProperties } from '@/actions/properties';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  Building2,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Home,
  Users,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';

export const dynamic = 'force-dynamic';

// Mock market data - replace with real data from backend
const marketData = {
  avgPrice: 6850,
  priceChange: 5.2,
  totalListings: 1247,
  listingsChange: 12.3,
  avgDaysOnMarket: 45,
  daysChange: -8.5,
  soldThisMonth: 89,
  soldChange: 15.7,
  hotAreas: [
    { name: 'Salt Lake City', avgPrice: 7200, change: 8.5, listings: 156 },
    { name: 'Park Street', avgPrice: 9500, change: 3.2, listings: 89 },
    { name: 'Ballygunge', avgPrice: 8900, change: 6.1, listings: 124 },
    { name: 'New Town', avgPrice: 6200, change: 12.4, listings: 203 },
    { name: 'Sector V', avgPrice: 7800, change: 4.8, listings: 167 }
  ],
  propertyTypes: [
    { type: 'Apartment', count: 756, percentage: 60.6, avgPrice: 6500 },
    { type: 'House', count: 312, percentage: 25.0, avgPrice: 8200 },
    { type: 'Plot', count: 179, percentage: 14.4, avgPrice: 4800 }
  ],
  priceRanges: [
    { range: '₹30L - ₹50L', count: 298, percentage: 23.9 },
    { range: '₹50L - ₹75L', count: 374, percentage: 30.0 },
    { range: '₹75L - ₹1Cr', count: 312, percentage: 25.0 },
    { range: '₹1Cr - ₹1.5Cr', count: 187, percentage: 15.0 },
    { range: '₹1.5Cr+', count: 76, percentage: 6.1 }
  ]
};

async function MarketOverview() {
  const stats = [
    {
      title: "Avg Price/Sq Ft",
      value: `₹${marketData.avgPrice.toLocaleString()}`,
      change: marketData.priceChange,
      changeText: `+${marketData.priceChange}% from last month`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Listings",
      value: marketData.totalListings.toLocaleString(),
      change: marketData.listingsChange,
      changeText: `+${marketData.listingsChange}% from last month`,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Avg Days on Market",
      value: `${marketData.avgDaysOnMarket} days`,
      change: marketData.daysChange,
      changeText: `${marketData.daysChange}% from last month`,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Properties Sold",
      value: marketData.soldThisMonth.toString(),
      change: marketData.soldChange,
      changeText: `+${marketData.soldChange}% from last month`,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <Badge 
                variant={stat.change > 0 ? "default" : "secondary"}
                className={`${stat.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {stat.change > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(stat.change)}%
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.changeText}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function HotAreas() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-spectron-teal" />
          Hot Areas in Kolkata
        </CardTitle>
        <CardDescription>Top performing areas by price growth and activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.hotAreas.map((area, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-heritage-cream/30 hover:bg-heritage-cream/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-spectron-teal/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-spectron-teal">#{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium">{area.name}</h4>
                  <p className="text-sm text-muted-foreground">{area.listings} active listings</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold">₹{area.avgPrice.toLocaleString()}/sq ft</p>
                <div className="flex items-center gap-1">
                  {area.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${area.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {area.change > 0 ? '+' : ''}{area.change}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function PropertyTypeDistribution() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-spectron-teal" />
          Property Type Distribution
        </CardTitle>
        <CardDescription>Market share by property type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.propertyTypes.map((type, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-spectron-teal" />
                  <span className="font-medium">{type.type}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{type.count}</span>
                  <span className="text-sm text-muted-foreground ml-2">({type.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-spectron-teal to-spectron-gold h-2 rounded-full transition-all duration-500"
                  style={{ width: `${type.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Avg Price: ₹{type.avgPrice.toLocaleString()}/sq ft
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function PriceRangeAnalysis() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-spectron-teal" />
          Price Range Analysis
        </CardTitle>
        <CardDescription>Distribution of properties by price range</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.priceRanges.map((range, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{range.range}</span>
                <div className="text-right">
                  <span className="font-semibold">{range.count}</span>
                  <span className="text-sm text-muted-foreground ml-2">({range.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-spectron-gold to-spectron-teal h-2 rounded-full transition-all duration-500"
                  style={{ width: `${range.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function MarketSnapshotPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-spectron-teal/10 p-2">
              <TrendingUp className="h-6 w-6 text-spectron-teal" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Market Snapshot</h1>
              <Badge className="mt-1 border-spectron-teal/30 bg-spectron-teal/10 text-spectron-teal">
                <Activity className="mr-1 h-3 w-3" />
                Kolkata Real Estate
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Real-time insights into Kolkata's property market trends and analytics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/properties">
            <Button variant="outline" className="gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
              <Building2 className="h-4 w-4" />
              Browse Properties
            </Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button className="gap-2 bg-gradient-to-r from-spectron-gold to-spectron-teal">
              <BarChart3 className="h-4 w-4" />
              Detailed Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Market Overview Stats */}
      <Suspense fallback={
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <MarketOverview />
      </Suspense>

      {/* Price Trends Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-spectron-teal" />
            Price Trends Over Time
          </CardTitle>
          <CardDescription>Average price per square foot trends in Kolkata</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartAreaInteractive />
        </CardContent>
      </Card>

      {/* Market Analysis Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        }>
          <HotAreas />
        </Suspense>

        <Suspense fallback={
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        }>
          <PropertyTypeDistribution />
        </Suspense>
      </div>

      {/* Price Range Analysis */}
      <Suspense fallback={
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      }>
        <PriceRangeAnalysis />
      </Suspense>

      {/* Market Insights */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-spectron-teal" />
            Market Insights
          </CardTitle>
          <CardDescription>Key trends and observations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800">Growing Demand</h4>
              </div>
              <p className="text-sm text-green-700">
                New Town and Sector V showing strong growth with 12%+ price increases
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">High Activity</h4>
              </div>
              <p className="text-sm text-blue-700">
                2-3 BHK apartments remain the most popular choice among buyers
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <h4 className="font-medium text-orange-800">Quick Sales</h4>
              </div>
              <p className="text-sm text-orange-700">
                Properties are selling 8.5% faster than last month on average
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}