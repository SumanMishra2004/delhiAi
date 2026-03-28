import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAdminStats, getPendingProperties } from '@/actions/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  Building2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminPropertyCard } from '@/components/admin-property-card';

export const dynamic = 'force-dynamic';

async function AdminStats() {
  const statsResponse = await getAdminStats();
  
  if (!statsResponse.success || !statsResponse.data) {
    return <div>Error loading stats</div>;
  }
  
  const stats = statsResponse.data;
  
  const statCards = [
    {
      title: "Pending Review",
      value: stats.pendingCount.toString(),
      description: "Properties awaiting verification",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      urgent: stats.pendingCount > 10
    },
    {
      title: "Approved",
      value: stats.approvedCount.toString(),
      description: "Verified properties",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Rejected",
      value: stats.rejectedCount.toString(),
      description: "Properties rejected",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      description: "Registered users",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Properties",
      value: stats.activeProperties.toString(),
      description: "Live on platform",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Community Opinions",
      value: stats.totalOpinions.toString(),
      description: "Total price validations",
      icon: TrendingUp,
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              {stat.urgent && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Urgent
                </Badge>
              )}
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function PendingPropertiesList() {
  const response = await getPendingProperties(1, 10);
  
  if (!response.success || !response.data) {
    return <div>Error loading properties</div>;
  }
  
  const properties = response.data;
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Verification Queue
            </CardTitle>
            <CardDescription>
              Properties awaiting admin approval
            </CardDescription>
          </div>
          <Link href="/dashboard/admin/queue">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600 opacity-50" />
            <p className="text-lg font-medium mb-2">All caught up!</p>
            <p className="text-sm text-muted-foreground">
              No properties pending verification
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.slice(0, 5).map((property) => (
              <AdminPropertyCard key={property.id} property={property} />
            ))}
            {properties.length > 5 && (
              <div className="text-center pt-4">
                <Link href="/dashboard/admin/queue">
                  <Button variant="outline">
                    View {properties.length - 5} More Properties
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-red-100 p-2">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <Badge className="mt-1 bg-red-100 text-red-700 border-red-200">
                <Shield className="mr-1 h-3 w-3" />
                Administrator
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Manage property verifications and platform oversight
          </p>
        </div>
      </div>

      {/* Stats */}
      <Suspense fallback={
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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
        <AdminStats />
      </Suspense>

      {/* Pending Properties */}
      <Suspense fallback={
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      }>
        <PendingPropertiesList />
      </Suspense>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/admin/queue">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-orange-600" />
              <h3 className="font-semibold mb-1">Verification Queue</h3>
              <p className="text-xs text-muted-foreground">Review pending properties</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/admin/analytics">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-1">Analytics</h3>
              <p className="text-xs text-muted-foreground">Platform insights</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/admin/users">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-1">User Management</h3>
              <p className="text-xs text-muted-foreground">Manage users</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/admin/abuse">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-red-600" />
              <h3 className="font-semibold mb-1">Abuse Detection</h3>
              <p className="text-xs text-muted-foreground">Flag suspicious activity</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
