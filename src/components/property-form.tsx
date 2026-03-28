'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Home,
  Ruler,
  IndianRupee,
  MapPin,
  Camera,
  Upload,
  Info,
  PlusCircle,
  Loader2,
  X,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { createProperty, uploadPropertyImages } from '@/actions/properties';
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/location-picker'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-spectron-teal" />
    </div>
  ),
});

interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  area: number;
  bhk: number;
  propertyType: string;
  furnishing: string;
  address: string;
  latitude: number;
  longitude: number;
}

export function PropertyForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; order: number }>>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    area: 0,
    bhk: 1,
    propertyType: '',
    furnishing: '',
    address: '',
    latitude: 22.5726,
    longitude: 88.3639,
  });

  const handleInputChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: address || prev.address,
    }));
    setShowMap(false);
    toast.success('Location selected successfully');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    if (files.length + imageFiles.length < 2 && files.length > 0) {
      toast.warning('Please upload at least 2 images');
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    setImageFiles(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.propertyType || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.price <= 0 || formData.area <= 0) {
      toast.error('Price and area must be greater than 0');
      return;
    }

    if (imageFiles.length < 2) {
      toast.error('Please upload at least 2 images');
      return;
    }

    if (imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images first
      setIsUploadingImages(true);
      const formDataImages = new FormData();
      imageFiles.forEach(file => {
        formDataImages.append('images', file);
      });

      const uploadResult = await uploadPropertyImages(formDataImages);
      setIsUploadingImages(false);

      if (!uploadResult.success || !uploadResult.urls) {
        toast.error(uploadResult.error || 'Failed to upload images');
        setIsSubmitting(false);
        return;
      }

      // Create property with uploaded image URLs
      const result = await createProperty({
        ...formData,
        images: uploadResult.urls,
      });

      if (result.success) {
        toast.success('Property listed successfully!');
        router.push('/dashboard/properties/my');
      } else {
        toast.error(result.error || 'Failed to create property');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('An error occurred while creating the property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-spectron-teal" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Provide essential details about your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input 
                  id="title" 
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Spacious 3BHK Apartment in Salt Lake"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your property, its features, amenities, and neighborhood..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleInputChange('propertyType', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APARTMENT">Apartment</SelectItem>
                      <SelectItem value="VILLA">Villa</SelectItem>
                      <SelectItem value="PLOT">Plot</SelectItem>
                      <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                      <SelectItem value="PENTHOUSE">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="furnishing">Furnishing Status *</Label>
                  <Select
                    value={formData.furnishing}
                    onValueChange={(value) => handleInputChange('furnishing', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select furnishing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FURNISHED">Fully Furnished</SelectItem>
                      <SelectItem value="SEMI_FURNISHED">Semi Furnished</SelectItem>
                      <SelectItem value="UNFURNISHED">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Specifications */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-spectron-teal" />
                Property Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="bhk">BHK *</Label>
                  <Select
                    value={formData.bhk.toString()}
                    onValueChange={(value) => handleInputChange('bhk', parseInt(value))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 BHK</SelectItem>
                      <SelectItem value="2">2 BHK</SelectItem>
                      <SelectItem value="3">3 BHK</SelectItem>
                      <SelectItem value="4">4 BHK</SelectItem>
                      <SelectItem value="5">5+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq ft) *</Label>
                  <Input 
                    id="area" 
                    type="number"
                    value={formData.area || ''}
                    onChange={(e) => handleInputChange('area', parseFloat(e.target.value))}
                    placeholder="e.g., 1200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="price" 
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      placeholder="e.g., 8500000"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-spectron-teal" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Complete Address *</Label>
                <Textarea 
                  id="address" 
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter the complete address"
                  rows={3}
                  required
                />
              </div>

              {!showMap ? (
                <div className="p-4 border-2 border-dashed border-spectron-teal/30 rounded-lg text-center">
                  <MapPin className="h-8 w-8 text-spectron-teal mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Pin Location on Map</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {formData.latitude && formData.longitude 
                      ? `Selected: ${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`
                      : 'Click to select location on map'}
                  </p>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowMap(true)}
                    className="border-spectron-teal text-spectron-teal hover:bg-spectron-teal hover:text-white"
                  >
                    {formData.latitude && formData.longitude ? 'Change Location' : 'Open Map Picker'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <LocationPicker
                    initialLat={formData.latitude}
                    initialLng={formData.longitude}
                    onLocationSelect={handleLocationSelect}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMap(false)}
                    className="w-full"
                  >
                    Close Map
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-spectron-teal" />
                Property Images *
              </CardTitle>
              <CardDescription>
                Add 2-5 high-quality images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-spectron-teal/30 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 text-spectron-teal mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Upload Images</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {imageFiles.length}/5 images selected
                  </p>
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => document.getElementById('images')?.click()}
                    disabled={imageFiles.length >= 5}
                    className="border-spectron-teal text-spectron-teal hover:bg-spectron-teal hover:text-white"
                  >
                    Choose Files
                  </Button>
                </div>

                {imageFiles.length > 0 && (
                  <div className="space-y-2">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-heritage-cream/30 rounded">
                        <span className="text-sm truncate flex-1">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Upload 2-5 images (required)</p>
                  <p>• Maximum 10MB per image</p>
                  <p>• Supported: JPG, PNG, WebP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6 space-y-3">
              <Button 
                type="submit"
                disabled={isSubmitting || imageFiles.length < 2}
                className="w-full bg-gradient-to-r from-spectron-gold to-spectron-teal"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isUploadingImages ? 'Uploading Images...' : 'Creating Listing...'}
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Property Listing
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-spectron-teal" />
                Listing Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <p>Use high-quality, well-lit photos</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <p>Write detailed descriptions</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <p>Price competitively</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
