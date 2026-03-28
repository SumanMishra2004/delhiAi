
import { getCurrentUser } from '@/lib/auth';
import { UrbanSprawlViewer } from '@/components/urban-sprawl-viewer';
import { Navbar } from '@/components/navbar';

export default async function UrbanSprawlPage() {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Urban Sprawl Analysis
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore the urban development of Kolkata from 1975 to 2030. 
              Compare different time periods and zoom in to see detailed changes.
            </p>
          </div>
          <UrbanSprawlViewer />
        </div>
      </div>
    </>
  );
}