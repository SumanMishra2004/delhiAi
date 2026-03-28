
import { Suspense } from 'react';
import { getDashboardStats, getRecentActivity, getUserProperties } from '@/actions/dashboard';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard,
  Building2, 
  TrendingUp, 
  Users, 
  Bell,
  MapPin,
  PlusCircle,
  BarChart3,
  Wallet,
  Star,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';

export const dynamic = 'force-dynamic';

async function DashboardStats() {
  const statsResponse = await getDashboardStats();
  const user = await getCurrentUser();
  
  if (!statsResponse.success || !statsResponse.data) {
    return <div>Error loading stats</div>;
  }
  
  const stats = statsResponse.data;
  
  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties.toLocaleString(),
      description: "Active listings in the platform",
      icon: Building2,
      trend: "+12%",
      trendUp: true,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: user?.role === 'BROKER' ? "Commission Earned" : "My Properties",
      value: user?.role === 'BROKER' ? `₹${(stats.commissionEarned / 100000).toFixed(1)}L` : stats.userProperties.toString(),
      description: user?.role === 'BROKER' ? "Total commission this month" : "Your active listings",
      icon: user?.role === 'BROKER' ? Wallet : Building2,
      trend: user?.role === 'BROKER' ? "+8%" : "+3%",
      trendUp: true,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Avg Price/Sqft",
      value: `₹${stats.avgPricePerSqft.toLocaleString()}`,
      description: "Market average in Kolkata",
      icon: TrendingUp,
      trend: "+5%",
      trendUp: true,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Notifications",
      value: stats.notifications.toString(),
      description: "Unread notifications",
      icon: Bell,
      trend: stats.notifications > 0 ? "New" : "All read",
      trendUp: stats.notifications > 0,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  if (user?.role === 'BROKER') {
    statCards.push({
      title: "Active Leads",
      value: stats.leads.toString(),
      description: "Potential clients",
      icon: Users,
      trend: "+15%",
      trendUp: true,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <Badge 
                variant={stat.trendUp ? "default" : "secondary"}
                className={`${stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
              >
                {stat.trendUp && <ArrowUpRight className="h-3 w-3 mr-1" />}
                {!stat.trendUp && <ArrowDownRight className="h-3 w-3 mr-1" />}
                {stat.trend}
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function RecentActivity() {
  const activitiesResponse = await getRecentActivity(5);
  
  if (!activitiesResponse.success || !activitiesResponse.data) {
    return <div>Error loading activity</div>;
  }
  
  const activities = activitiesResponse.data;
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-spectron-teal" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-heritage-cream/30 hover:bg-heritage-cream/50 transition-colors">
                <div className="rounded-full bg-spectron-teal/10 p-2">
                  <Building2 className="h-4 w-4 text-spectron-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {activities.length > 0 && (
          <div className="mt-4 text-center">
            <Link href="/dashboard/notifications">
              <Button variant="outline" size="sm">
                View All Activity
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function UserProperties() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'OWNER' && user.role !== 'BROKER')) {
    return null;
  }

  const propertiesResponse = await getUserProperties();
  
  if (!propertiesResponse.success || !propertiesResponse.data) {
    return <div>Error loading properties</div>;
  }
  
  const properties = propertiesResponse.data;
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-spectron-teal" />
          My Properties
        </CardTitle>
        <CardDescription>Your property listings overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {properties.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">No properties listed yet</p>
              <Link href="/dashboard/properties/new">
                <Button className="bg-gradient-to-r from-spectron-gold to-spectron-teal">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {properties.slice(0, 3).map((property: any) => (
                <div key={property.id} className="flex items-center gap-3 p-3 rounded-lg bg-heritage-cream/30 hover:bg-heritage-cream/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-spectron-teal/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-spectron-teal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{property.title}</h4>
                    <p className="text-sm text-muted-foreground">₹{property.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={property.status === 'ACTIVE' ? 'default' : 'secondary'}
                      className={property.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : ''}
                    >
                      {property.status}
                    </Badge>
                    {property.notificationCount > 0 && (
                      <p className="text-xs text-spectron-teal mt-1">
                        {property.notificationCount} inquiries
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div className="text-center mt-4">
                <Link href="/dashboard/properties/my">
                  <Button variant="outline" size="sm">
                    View All Properties
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-spectron-teal/10 p-2">
              <LayoutDashboard className="h-6 w-6 text-spectron-teal" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <Badge className="mt-1 border-spectron-teal/30 bg-spectron-teal/10 text-spectron-teal">
                <Star className="mr-1 h-3 w-3" />
                {user?.role === 'PUBLIC' && 'Public User'}
                {user?.role === 'OWNER' && 'Property Owner'}
                {user?.role === 'BROKER' && 'Real Estate Broker'}
                {user?.role === 'ADMIN' && 'Administrator'}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Here's what's happening with your properties today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/analytics">
            <Button variant="outline" className="gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
          {(user?.role === 'OWNER' || user?.role === 'BROKER') && (
            <Link href="/dashboard/properties/new">
              <Button className="gap-2 bg-gradient-to-r from-spectron-gold to-spectron-teal">
                <PlusCircle className="h-4 w-4" />
                Add Property
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
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
        <DashboardStats />
      </Suspense>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-spectron-teal" />
                Market Trends
              </CardTitle>
              <CardDescription>Property price trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartAreaInteractive />
            </CardContent>
          </Card>
        </div>
        
        <Suspense fallback={
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        }>
          <RecentActivity />
        </Suspense>
      </div>

      {/* User Properties Section */}
      {(user?.role === 'OWNER' || user?.role === 'BROKER') && (
        <Suspense fallback={
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        }>
          <UserProperties />
        </Suspense>
      )}

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/properties">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
                <Building2 className="h-6 w-6" />
                Browse Properties
              </Button>
            </Link>
            <Link href="/dashboard/map">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
                <MapPin className="h-6 w-6" />
                Map Explorer
              </Button>
            </Link>
            {user?.role === 'BROKER' && (
              <Link href="/dashboard/leads">
                <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
                  <Users className="h-6 w-6" />
                  Manage Leads
                </Button>
              </Link>
            )}
            <Link href="/dashboard/notifications">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
                <Bell className="h-6 w-6" />
                Notifications
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

