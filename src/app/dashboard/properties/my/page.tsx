import { Suspense } from 'react';
import { getUserProperties } from '@/actions/dashboard';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Eye, 
  Edit, 
  Trash2, 
  PlusCircle,
  MapPin,
  Calendar,
  TrendingUp,
  MessageSquare,
  Star,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function MyPropertiesContent() {
  const user = await getCurrentUser();
  
  if (!user || (user.role !== 'OWNER' && user.role !== 'BROKER')) {
    redirect('/dashboard');
  }

  const propertiesResponse = await getUserProperties();
  
  if (!propertiesResponse.success || !propertiesResponse.data) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="rounded-full bg-red-100 p-6 w-24 h-24 mx-auto mb-6">
            <Building2 className="h-12 w-12 text-red-600 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Error Loading Properties</h3>
          <p className="text-muted-foreground mb-6">
            {propertiesResponse.error || 'Failed to load your properties'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const properties = propertiesResponse.data;
  
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-700 border-green-200',
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    SOLD: 'bg-blue-100 text-blue-700 border-blue-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200'
  };

  const verificationColors = {
    VERIFIED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    REJECTED: 'bg-red-100 text-red-700'
  };

  return (
    <div className="space-y-6">
      {properties.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="rounded-full bg-spectron-teal/10 p-6 w-24 h-24 mx-auto mb-6">
              <Building2 className="h-12 w-12 text-spectron-teal mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Properties Listed</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your property portfolio by adding your first listing. 
              Reach thousands of potential buyers and tenants.
            </p>
            <Link href="/dashboard/properties/new">
              <Button className="bg-gradient-to-r from-spectron-gold to-spectron-teal">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property Image */}
                  <div className="lg:w-64 h-48 lg:h-40 rounded-lg bg-gradient-to-br from-spectron-teal/20 to-spectron-gold/20 flex items-center justify-center overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={property.images[0].url} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-16 w-16 text-spectron-teal/50" />
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{property.address}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{property.bhk} BHK</span>
                          <span>•</span>
                          <span>{property.area} sq ft</span>
                          <span>•</span>
                          <span className="capitalize">{property.propertyType.toLowerCase()}</span>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Property
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Public Page
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Property
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={statusColors[property.status as keyof typeof statusColors]}>
                        {property.status}
                      </Badge>
                      {/* <Badge 
                        variant="outline" 
                        className={verificationColors[property.verificationStatus as keyof typeof verificationColors]}
                      >
                        {property.isVerified ? 'Verified' : property.verificationStatus}
                      </Badge> */}
                     
                    </div>

                    {/* Price and Stats */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-spectron-teal">
                          ₹{property.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{Math.round(property.price / property.area).toLocaleString()}/sq ft
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        {/* <div className="text-center">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            <span>Views</span>
                          </div>
                          <p className="font-semibold">1,234</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            <span>Inquiries</span>
                          </div>
                          <p className="font-semibold">{property._count?.notifications || 0}</p>
                        </div> */}
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Listed</span>
                          </div>
                          <p className="font-semibold">
                            {new Date(property.createdAt).toLocaleDateString('en-IN', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function MyListingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-spectron-teal/10 p-2">
              <Building2 className="h-6 w-6 text-spectron-teal" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Listings</h1>
              <Badge className="mt-1 border-spectron-teal/30 bg-spectron-teal/10 text-spectron-teal">
                <TrendingUp className="mr-1 h-3 w-3" />
                Property Portfolio
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Manage your property listings and track their performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/analytics">
            <Button variant="outline" className="gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Link href="/dashboard/properties/new">
            <Button className="gap-2 bg-gradient-to-r from-spectron-gold to-spectron-teal">
              <PlusCircle className="h-4 w-4" />
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Properties List */}
      <Suspense fallback={
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-64 h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <MyPropertiesContent />
      </Suspense>
    </div>
  );
}