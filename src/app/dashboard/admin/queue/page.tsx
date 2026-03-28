import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getPendingProperties } from '@/actions/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Filter } from 'lucide-react';
import { AdminPropertyCard } from '@/components/admin-property-card';

export const dynamic = 'force-dynamic';

async function VerificationQueue() {
  const response = await getPendingProperties(1, 50);
  
  if (!response.success || !response.data) {
    return <div>Error loading properties</div>;
  }
  
  const properties = response.data;
  
  return (
    <div className="space-y-4">
      {properties.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12 text-center">
            <Clock className="h-16 w-16 mx-auto mb-4 text-green-600 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">
              No properties pending verification at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        properties.map((property) => (
          <AdminPropertyCard key={property.id} property={property} />
        ))
      )}
    </div>
  );
}

export default async function AdminQueuePage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-full bg-orange-100 p-2">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Verification Queue</h1>
          </div>
        </div>
        <p className="text-muted-foreground">
          Review and verify properties awaiting approval
        </p>
      </div>

      {/* Filters (Placeholder for future enhancement) */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter properties by criteria (coming soon)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Queue List */}
      <Suspense fallback={
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <VerificationQueue />
      </Suspense>
    </div>
  );
}
