import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Edit, 
  Save, 
  Shield,
  Star,
  Building2,
  Calendar,
  Award,
  Verified
} from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-spectron-gold via-spectron-teal to-spectron-crimson bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-24 w-24 border-4 border-spectron-gold/30">
                <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=User" />
                <AvatarFallback className="bg-gradient-to-br from-spectron-gold to-spectron-teal text-white text-xl">
                  U
                </AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-spectron-teal text-white">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <h3 className="text-xl font-semibold mb-1">John Doe</h3>
            <p className="text-muted-foreground mb-3">john.doe@email.com</p>
            
            <div className="flex justify-center gap-2 mb-4">
              <Badge className="bg-spectron-teal text-white">
                <User className="h-3 w-3 mr-1" />
                Public User
              </Badge>
              <Badge variant="outline" className="border-green-500 text-green-600">
                <Verified className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined December 2024</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Kolkata, West Bengal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-heritage-cream/50">
              <TabsTrigger value="personal" className="data-[state=active]:bg-spectron-teal data-[state=active]:text-white">Personal Info</TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-spectron-teal data-[state=active]:text-white">Preferences</TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-spectron-teal data-[state=active]:text-white">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-spectron-teal" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" className="border-spectron-teal/20 focus:border-spectron-teal" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" className="border-spectron-teal/20 focus:border-spectron-teal" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john.doe@email.com" className="border-spectron-teal/20 focus:border-spectron-teal" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+91 98765 43210" className="border-spectron-teal/20 focus:border-spectron-teal" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" defaultValue="Salt Lake City, Sector V, Kolkata, West Bengal" className="border-spectron-teal/20 focus:border-spectron-teal" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself..." className="border-spectron-teal/20 focus:border-spectron-teal" />
                  </div>
                  
                  <Button className="bg-gradient-to-r from-spectron-gold to-spectron-teal text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-spectron-gold" />
                    Property Preferences
                  </CardTitle>
                  <CardDescription>
                    Set your property search and notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minBudget">Minimum Budget (₹)</Label>
                      <Input id="minBudget" placeholder="50,00,000" className="border-spectron-teal/20 focus:border-spectron-teal" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxBudget">Maximum Budget (₹)</Label>
                      <Input id="maxBudget" placeholder="1,00,00,000" className="border-spectron-teal/20 focus:border-spectron-teal" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preferredAreas">Preferred Areas</Label>
                    <Input id="preferredAreas" placeholder="Salt Lake, Park Street, New Town" className="border-spectron-teal/20 focus:border-spectron-teal" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="propertyTypes">Property Types</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Apartment", "Villa", "Studio", "Penthouse"].map((type) => (
                        <Badge key={type} variant="outline" className="cursor-pointer hover:bg-spectron-teal/10 hover:border-spectron-teal">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="bg-gradient-to-r from-spectron-gold to-spectron-teal text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-spectron-crimson" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Change Password</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" className="border-spectron-teal/20 focus:border-spectron-teal" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" className="border-spectron-teal/20 focus:border-spectron-teal" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" className="border-spectron-teal/20 focus:border-spectron-teal" />
                      </div>
                    </div>
                    <Button variant="outline" className="border-spectron-crimson text-spectron-crimson hover:bg-spectron-crimson/10">
                      Update Password
                    </Button>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Account Verification</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-spectron-teal" />
                          <div>
                            <p className="font-medium">Email Verification</p>
                            <p className="text-sm text-muted-foreground">john.doe@email.com</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white">Verified</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-spectron-gold" />
                          <div>
                            <p className="font-medium">Phone Verification</p>
                            <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-spectron-gold text-spectron-gold hover:bg-spectron-gold/10">
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}