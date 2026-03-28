import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bookmark, 
  Heart, 
  MapPin, 
  Building2,
  Eye,
  Phone,
  MessageSquare,
  Share2,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Search,
  Calendar,
  TrendingUp,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const dynamic = 'force-dynamic';

// Mock saved properties data - replace with real data from backend
const savedProperties = [
  {
    id: '1',
    title: 'Luxury 3BHK Apartment in Salt Lake',
    price: 8500000,
    area: 1200,
    bhk: 3,
    propertyType: 'APARTMENT',
    address: 'Salt Lake City, Sector V, Kolkata',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
    savedAt: '2024-12-20',
    pricePerSqft: 7083,
    furnishing: 'SEMI_FURNISHED',
    owner: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      isVerified: true
    },
    features: ['Parking', 'Lift', 'Security', 'Garden'],
    views: 1234,
    isNew: false,
    isPriceReduced: true,
    originalPrice: 9000000
  },
  {
    id: '2',
    title: 'Modern 2BHK with City View',
    price: 6200000,
    area: 950,
    bhk: 2,
    propertyType: 'APARTMENT',
    address: 'Park Street, Central Kolkata',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'],
    savedAt: '2024-12-18',
    pricePerSqft: 6526,
    furnishing: 'FULLY_FURNISHED',
    owner: {
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      isVerified: true
    },
    features: ['AC', 'Modular Kitchen', 'Balcony', 'Gym'],
    views: 856,
    isNew: true,
    isPriceReduced: false
  },
  {
    id: '3',
    title: 'Spacious 4BHK Independent House',
    price: 12500000,
    area: 1800,
    bhk: 4,
    propertyType: 'HOUSE',
    address: 'Ballygunge, South Kolkata',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
    savedAt: '2024-12-15',
    pricePerSqft: 6944,
    furnishing: 'UNFURNISHED',
    owner: {
      name: 'Amit Banerjee',
      phone: '+91 76543 21098',
      isVerified: false
    },
    features: ['Garden', 'Parking', 'Terrace', 'Study Room'],
    views: 2341,
    isNew: false,
    isPriceReduced: false
  }
];

async function SavedPropertiesContent() {
  const user = await getCurrentUser();
  
  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search saved properties..." 
                  className="pl-10 focus:border-spectron-teal focus:ring-spectron-teal"
                />
              </div>
              
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Saved</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      {savedProperties.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="rounded-full bg-spectron-teal/10 p-6 w-24 h-24 mx-auto mb-6">
              <Bookmark className="h-12 w-12 text-spectron-teal mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Saved Properties</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start exploring properties and save your favorites to keep track of them easily.
            </p>
            <Link href="/dashboard/properties">
              <Button className="bg-gradient-to-r from-spectron-gold to-spectron-teal">
                <Building2 className="h-4 w-4 mr-2" />
                Browse Properties
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedProperties.map((property) => (
            <Card key={property.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                {/* Property Image */}
                <div className="h-48 rounded-t-lg bg-gradient-to-br from-spectron-teal/20 to-spectron-gold/20 overflow-hidden">
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {property.isNew && (
                    <Badge className="bg-green-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  )}
                  {property.isPriceReduced && (
                    <Badge className="bg-red-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Price Reduced
                    </Badge>
                  )}
                </div>
                
                {/* Saved Heart */}
                <div className="absolute top-3 right-3">
                  <Button size="sm" className="bg-white/90 text-red-500 hover:bg-white hover:text-red-600 shadow-lg">
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                {/* Property Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{property.address}</span>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-spectron-teal">
                        ₹{property.price.toLocaleString()}
                      </p>
                      {property.isPriceReduced && (
                        <p className="text-sm text-muted-foreground line-through">
                          ₹{property.originalPrice?.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ₹{property.pricePerSqft.toLocaleString()}/sq ft
                    </p>
                  </div>
                  
                  {/* Property Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{property.bhk} BHK</span>
                    <span>•</span>
                    <span>{property.area} sq ft</span>
                    <span>•</span>
                    <span className="capitalize">{property.propertyType.toLowerCase()}</span>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {property.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {property.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{property.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  {/* Owner Info */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-spectron-teal/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-spectron-teal">
                          {property.owner.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{property.owner.name}</p>
                        <div className="flex items-center gap-1">
                          {property.owner.isVerified && (
                            <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>{property.views}</span>
                    </div>
                  </div>
                  
                  {/* Saved Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Saved on {new Date(property.savedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-spectron-gold to-spectron-teal">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
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

export default async function SavedPropertiesPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-spectron-teal/10 p-2">
              <Bookmark className="h-6 w-6 text-spectron-teal" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Saved Properties</h1>
              <Badge className="mt-1 border-spectron-teal/30 bg-spectron-teal/10 text-spectron-teal">
                <Heart className="mr-1 h-3 w-3" />
                {savedProperties.length} properties saved
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Your favorite properties in one place
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/properties">
            <Button variant="outline" className="gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
              <Building2 className="h-4 w-4" />
              Browse More
            </Button>
          </Link>
          <Link href="/dashboard/map">
            <Button variant="outline" className="gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
              <MapPin className="h-4 w-4" />
              Map View
            </Button>
          </Link>
        </div>
      </div>

      {/* Properties Content */}
      <Suspense fallback={
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <div className="h-48 bg-gray-200 rounded-t-lg animate-pulse"></div>
              <CardContent className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <SavedPropertiesContent />
      </Suspense>
    </div>
  );
}