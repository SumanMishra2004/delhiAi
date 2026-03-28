import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

import { Navbar } from '@/components/navbar';
import { PropertyDetailsView } from '@/components/property-details-view';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { id } = await params;
  
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' }
      },
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    }
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <PropertyDetailsView property={property} />
        </div>
      </main>
    </div>
  );
}
