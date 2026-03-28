import { Suspense } from 'react';
import { getProperties } from '@/actions/properties';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Sparkles,
  Grid3X3
} from 'lucide-react';
import Link from 'next/link';
import { MapInterface } from '@/components/map-interface';



export const dynamic = 'force-dynamic';

export default async function MapPage() {
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
        <section className="border-b border-border/50 bg-gradient-to-r from-heritage-cream to-background py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <Badge className="mb-3 border-spectron-teal/30 bg-spectron-teal/10 text-spectron-teal">
                  <MapPin className="mr-2 h-4 w-4" />
                  Interactive Map
                </Badge>
                <h1 className="mb-2 text-3xl font-bold">
                  Explore Kolkata Properties on Map
                </h1>
                <p className="text-muted-foreground">
                  Discover properties by location with our interactive map view
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link href="/properties">
                  <Button variant="outline" className="gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    Grid View
                  </Button>
                </Link>
                <Link href="/dashboard/properties/new">
                  <Button className="gap-2 bg-gradient-to-r from-spectron-gold to-spectron-teal">
                    <Sparkles className="h-4 w-4" />
                    List Property
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Map Interface */}
        <section className="relative">
          <Suspense 
            fallback={
              <div className="flex h-[calc(100vh-200px)] items-center justify-center bg-muted/30">
                <div className="text-center">
                  <MapPin className="mx-auto mb-4 h-12 w-12 text-spectron-teal animate-pulse" />
                  <p className="text-muted-foreground">Loading map interface...</p>
                </div>
              </div>
            }
          >
            <MapInterface properties={properties} />
          </Suspense>
        </section>
      </div>
    </>
  );
}