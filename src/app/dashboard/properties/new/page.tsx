import { getCurrentUser } from '@/lib/auth';
import { PropertyForm } from '@/components/property-form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AddPropertyPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'OWNER' && user.role !== 'BROKER')) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-spectron-teal/10 p-2">
              <PlusCircle className="h-6 w-6 text-spectron-teal" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Add New Property</h1>
              <Badge className="mt-1 border-spectron-teal/30 bg-spectron-teal/10 text-spectron-teal">
                <Building2 className="mr-1 h-3 w-3" />
                Property Listing
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Create a new property listing to reach potential buyers and tenants
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/properties/my">
            <Button variant="outline" className="gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
              <Building2 className="h-4 w-4" />
              My Listings
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-spectron-teal text-white p-2 text-sm font-medium">1</div>
              <span className="font-medium text-spectron-teal">Property Details</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-spectron-teal text-white p-2 text-sm font-medium">2</div>
              <span className="font-medium text-spectron-teal">Images & Location</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-gray-200 text-gray-600 p-2 text-sm font-medium">3</div>
              <span className="text-muted-foreground">Review & Publish</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Form */}
      <PropertyForm />
    </div>
  );
}