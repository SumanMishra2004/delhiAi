import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { LocationUpdater } from '@/components/location-updater';

export const dynamic = 'force-dynamic';

async function LocationStatus() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/signin');
  }

  const hasLocation = user.latitude && user.longitude;

  return (
    <div className="space-y-6">
      {/* Current Location Status */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-spectron-teal" />
            Current Location
          </CardTitle>
          <CardDescription>
            Your location is used to find nearby properties and send validation notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasLocation ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 mb-1">Location Set</p>
                  <p className="text-sm text-green-700">
                    Coordinates: {user.latitude?.toFixed(4)}, {user.longitude?.toFixed(4)}
                  </p>
                  {user.address && (
                    <p className="text-sm text-green-700 mt-1">
                      Address: {user.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <LocationUpdater 
                  variant="default"
                  className="flex-1"
                />
              </div>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Troubleshooting:</strong> If automatic location doesn't work:
                </p>
                <ul className="text-xs text-amber-700 mt-2 space-y-1 ml-4">
                  <li>• Check browser console (F12) for error details</li>
                  <li>• Ensure location services are enabled on your device</li>
                  <li>• Click the location icon in browser address bar to allow access</li>
                  <li>• Try using HTTPS or localhost</li>
                  <li>• Check if you're using a modern browser (Chrome, Firefox, Edge)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-900 mb-1">Location Not Set</p>
                  <p className="text-sm text-orange-700">
                    Please set your location to receive notifications about nearby properties
                  </p>
                </div>
              </div>

              <LocationUpdater 
                variant="default"
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Why Location Matters */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Why Location Matters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                <Navigation className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Nearby Property Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified when properties are listed within 5km of your location, 
                  allowing you to validate and provide community feedback.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 p-2 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Community Validation</h4>
                <p className="text-sm text-muted-foreground">
                  Only users within the property's radius can submit validation opinions, 
                  ensuring feedback comes from actual neighbors.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-purple-100 p-2 flex-shrink-0">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Personalized Search</h4>
                <p className="text-sm text-muted-foreground">
                  See properties sorted by distance from your location, 
                  making it easier to find homes in your preferred area.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-0 shadow-lg bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Privacy & Security</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Your exact location is never shared with property owners or other users</li>
                <li>• Location is only used to calculate distance for notifications</li>
                <li>• You can update or remove your location at any time</li>
                <li>• All location data is encrypted and stored securely</li>
                <li>• Your location is not visible on your public profile</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Update */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-spectron-teal" />
            How to Update Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <p>Click the "Update Location" button above</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <p>Allow browser to access your location when prompted</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <p>Wait for location to be fetched (usually takes 2-5 seconds)</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <p>Your location will be automatically saved and updated</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function LocationPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-full bg-spectron-teal/10 p-2">
            <MapPin className="h-6 w-6 text-spectron-teal" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Location Settings</h1>
            <Badge className="mt-1 bg-spectron-teal/10 text-spectron-teal border-spectron-teal/30">
              <Navigation className="mr-1 h-3 w-3" />
              GPS Enabled
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground">
          Manage your location to receive nearby property notifications
        </p>
      </div>

      {/* Content */}
      <Suspense fallback={
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      }>
        <LocationStatus />
      </Suspense>
    </div>
  );
}
