import { Suspense } from 'react';

import { getProperties } from '@/actions/properties';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  MapPin,
  Building2,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Users,
  Eye,
  Sparkles,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { PropertyValidationButton } from '@/components/property-validation-button';

export const dynamic = 'force-dynamic';

export default async function PropertyValidationPage() {
  let nearbyProperties: any[] = [];
  let user = null;
  let errorMessage = null;

  try {
    user = await getCurrentUser();
    
    if (!user) {
      errorMessage = 'Please sign in to validate properties';
    } else if (!user.latitude || !user.longitude) {
      errorMessage = 'Please update your location to see nearby properties';
    } else {
      // Fetch properties within 5km radius of user's location
      const response = await getProperties({
        radius: { lat: user.latitude, lng: user.longitude, km: 5 },
        status: ['PENDING', 'ACTIVE'] // Show both pending and active properties
      });
      nearbyProperties = response.data || [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    errorMessage = 'Failed to load properties';
  }

  // Mock validation stats
  const validationStats = {
    totalValidations: 156,
    thisWeek: 23,
    accuracy: 94.5,
    communityPoints: 1250
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Property Validation</h1>
          <p className="text-muted-foreground">
            Help verify nearby properties and earn community trust points
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="gap-1 bg-spectron-teal/10 text-spectron-teal">
            <Shield className="h-3 w-3" />
            Anonymous System
          </Badge>
          <Link href="/dashboard/opinions">
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              View Opinions
            </Button>
          </Link>
        </div>
      </div>

      {/* Validation Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="spectron-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Validations</p>
                <p className="text-3xl font-bold text-spectron-teal">
                  {validationStats.totalValidations}
                </p>
              </div>
              <div className="rounded-full bg-spectron-teal/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-spectron-teal" />
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
                  {validationStats.thisWeek}
                </p>
              </div>
              <div className="rounded-full bg-spectron-gold/10 p-3">
                <Clock className="h-6 w-6 text-spectron-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="spectron-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                <p className="text-3xl font-bold text-spectron-crimson">
                  {validationStats.accuracy}%
                </p>
              </div>
              <div className="rounded-full bg-spectron-crimson/10 p-3">
                <Shield className="h-6 w-6 text-spectron-crimson" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="spectron-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Community Points</p>
                <p className="text-3xl font-bold text-primary">
                  {validationStats.communityPoints.toLocaleString()}
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="spectron-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-spectron-teal" />
            How Anonymous Validation Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-spectron-teal/10">
                <Eye className="h-6 w-6 text-spectron-teal" />
              </div>
              <h3 className="mb-2 font-semibold">1. Review Properties</h3>
              <p className="text-sm text-muted-foreground">
                Check nearby property listings for location accuracy, pricing, and existence
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-spectron-gold/10">
                <MessageSquare className="h-6 w-6 text-spectron-gold" />
              </div>
              <h3 className="mb-2 font-semibold">2. Provide Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Share anonymous opinions on pricing and property details without revealing identity
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-spectron-crimson/10">
                <Users className="h-6 w-6 text-spectron-crimson" />
              </div>
              <h3 className="mb-2 font-semibold">3. Build Trust</h3>
              <p className="text-sm text-muted-foreground">
                Help create a transparent marketplace while earning community trust points
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Properties to Validate */}
      <Card className="spectron-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-spectron-gold" />
            Properties Near You (5km radius)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
              <h3 className="mb-2 text-lg font-semibold">{errorMessage}</h3>
              <p className="text-muted-foreground mb-4">
                {errorMessage.includes('location') 
                  ? 'Update your location to discover properties nearby and start validating.'
                  : 'Please try again or contact support if the issue persists.'}
              </p>
              {errorMessage.includes('location') && (
                <Link href="/dashboard/location">
                  <Button variant="default" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Update Location
                  </Button>
                </Link>
              )}
            </div>
          ) : nearbyProperties.length > 0 ? (
            <div className="space-y-4">
              {nearbyProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-spectron-teal/10 p-2">
                      <Building2 className="h-5 w-5 text-spectron-teal" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{property.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {property.address} • ₹{(property.price / 100000).toFixed(1)}L
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {property.bhk} BHK
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {property.area} sq ft
                        </Badge>
                        <Badge 
                          variant={property.verificationStatus === 'APPROVED' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {property.verificationStatus === 'APPROVED' ? 'Verified' : 'Pending'}
                        </Badge>
                        {property.distance_km && (
                          <Badge variant="outline" className="text-xs text-spectron-teal">
                            {property.distance_km.toFixed(1)} km away
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <PropertyValidationButton
                      property={{
                        id: property.id,
                        title: property.title,
                        description: property.description,
                        price: property.price,
                        area: property.area,
                        bhk: property.bhk,
                        propertyType: property.propertyType,
                        furnishing: property.furnishing,
                        address: property.address,
                        images: property.images || []
                      }}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">No Properties Found</h3>
              <p className="text-muted-foreground mb-4">
                No properties found in your 5km radius. Check back later when new properties are listed nearby.
              </p>
              <Link href="/properties">
                <Button variant="outline" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Browse All Properties
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Form */}
      <Card className="spectron-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-spectron-crimson" />
            Submit Anonymous Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="flex h-32 items-center justify-center">
              <div className="text-center">
                <Shield className="mx-auto mb-2 h-8 w-8 text-spectron-teal animate-pulse" />
                <p className="text-sm text-muted-foreground">Loading validation form...</p>
              </div>
            </div>
          }>
            <div className="text-center py-8">
              <Shield className="mx-auto mb-4 h-12 w-12 text-spectron-teal/50" />
              <h3 className="mb-2 text-lg font-semibold">Select a Property to Validate</h3>
              <p className="text-muted-foreground">
                Choose a property from the list above to provide anonymous validation feedback.
              </p>
            </div>
          </Suspense>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="spectron-card border-spectron-teal/30 bg-spectron-teal/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-spectron-teal mt-0.5" />
            <div>
              <h3 className="font-semibold text-spectron-teal mb-2">Privacy & Anonymity Guaranteed</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Your identity is never revealed to property owners or brokers</li>
                <li>• All feedback is aggregated and anonymized before display</li>
                <li>• Only admins can see validation comments for moderation purposes</li>
                <li>• Your location is used only to find nearby properties (5km radius)</li>
                <li>• No personal information is stored with your validation data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}