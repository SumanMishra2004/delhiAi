import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getPropertyById } from '@/actions/properties';
import { getPropertyOpinions, getPropertyValidationComments } from '@/actions/opinions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  MapPin, 
  IndianRupee, 
  Users, 
  MessageSquare,
  TrendingUp,
  Home,
  Calendar,
  User
} from 'lucide-react';
import { AdminVerificationActions } from '@/components/admin-verification-actions';
import { PropertyGallery } from '@/components/property-gallery';
import { UrbanSprawlChart } from '@/components/urban-sprawl-chart';
import { CommunityOpinionsDisplay } from '@/components/community-opinions-display';
import { ValidationCommentsDisplay } from '@/components/validation-comments-display';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminVerifyPropertyPage({ params }: PageProps) {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const property = await getPropertyById(id);

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
        <p className="text-muted-foreground">The property you're looking for doesn't exist.</p>
      </div>
    );
  }

  const [opinionsResponse, commentsResponse] = await Promise.all([
    getPropertyOpinions(id),
    getPropertyValidationComments(id)
  ]);

  const opinions = opinionsResponse.success ? opinionsResponse.data : null;
  const comments = commentsResponse.success ? commentsResponse.data : [];

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
              <h1 className="text-3xl font-bold">Property Verification</h1>
              <Badge className="mt-1" variant={
                property.verificationStatus === 'PENDING' ? 'secondary' :
                property.verificationStatus === 'APPROVED' ? 'default' : 'destructive'
              }>
                {property.verificationStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Images */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyGallery images={property.images} />
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-spectron-teal" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
                <p className="text-muted-foreground">{property.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-semibold flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    {(property.price / 100000).toFixed(1)}L
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="text-lg font-semibold">{property.area} sq ft</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">BHK</p>
                  <p className="text-lg font-semibold">{property.bhk} BHK</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-lg font-semibold">{property.propertyType}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-spectron-teal mt-1" />
                  <p className="text-sm">{property.address}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Coordinates: {property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Urban Sprawl Analysis */}
          {property.urbanSprawlData && property.urbanSprawlData.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Urban Growth Intelligence
                </CardTitle>
                <CardDescription>
                  Satellite-backed market analysis from Google Earth Engine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UrbanSprawlChart data={property.urbanSprawlData} />
              </CardContent>
            </Card>
          )}

          {/* Community Opinions */}
          {opinions && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Community Price Discovery
                </CardTitle>
                <CardDescription>
                  Anonymous opinions from nearby residents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommunityOpinionsDisplay opinions={opinions} />
              </CardContent>
            </Card>
          )}

          {/* Validation Comments */}
          {comments && comments.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Community Feedback
                </CardTitle>
                <CardDescription>
                  Anonymous validation comments from local users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ValidationCommentsDisplay comments={comments} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-spectron-teal" />
                Owner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{property.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-sm">{property.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="outline">{property.user?.role}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Listed On</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Actions */}
          <AdminVerificationActions 
            propertyId={property.id}
            currentStatus={property.verificationStatus}
            verificationNotes={property.verificationNotes}
          />

          {/* Verification History */}
          {property.verifiedAt && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm">Verification History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Verified At</p>
                  <p className="font-medium">
                    {new Date(property.verifiedAt).toLocaleString()}
                  </p>
                </div>
                {property.verificationNotes && (
                  <div>
                    <p className="text-muted-foreground">Notes</p>
                    <p className="text-sm">{property.verificationNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
