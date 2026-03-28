import { getProperties } from '@/actions/properties';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  MapPin, 
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { PropertiesPageClient } from '@/components/properties-page-client';

export const dynamic = 'force-dynamic';

export default async function PropertiesPage() {
  let properties = [];
  let user = null;

  try {
    const response = await getProperties();
    properties = response.data || [];
    user = await getCurrentUser();
  } catch (error) {
    console.error('Error fetching properties:', error);
  }

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="border-b border-border/50 bg-gradient-to-r from-heritage-cream to-background py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <Badge className="mb-3 border-spectron-teal/30 bg-spectron-teal/10 text-spectron-teal">
                  <Building2 className="mr-2 h-4 w-4" />
                  Verified Properties
                </Badge>
                <h1 className="mb-2 text-4xl font-bold">
                  Discover Kolkata Properties
                </h1>
                <p className="text-lg text-muted-foreground">
                  Browse {properties.length} verified properties across the City of Joy
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link href="/dashboard/properties/new">
                  <Button className="gap-2 bg-gradient-to-r from-spectron-gold to-spectron-teal">
                    <Sparkles className="h-4 w-4" />
                    List Property
                  </Button>
                </Link>
                <Link href="/map">
                  <Button variant="outline" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Map View
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filters & Results - Client Component */}
        <PropertiesPageClient initialProperties={properties} />
      </div>
    </>
  );
}