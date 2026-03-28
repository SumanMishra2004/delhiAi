import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Smartphone,
  Mail,
  MessageSquare,
  Eye,
  Lock,
  Trash2,
  Download,
  Upload,
  Building2,
  TrendingDown
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-spectron-gold via-spectron-teal to-spectron-crimson bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Customize your Spectron experience and manage your preferences
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-heritage-cream/50">
          <TabsTrigger value="notifications" className="data-[state=active]:bg-spectron-teal data-[state=active]:text-white">Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-spectron-teal data-[state=active]:text-white">Appearance</TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-spectron-teal data-[state=active]:text-white">Privacy</TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-spectron-teal data-[state=active]:text-white">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-spectron-teal" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about property updates and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Property Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-spectron-gold" />
                      <div>
                        <Label htmlFor="new-properties">New Properties</Label>
                        <p className="text-sm text-muted-foreground">Get notified when new properties match your criteria</p>
                      </div>
                    </div>
                    <Switch id="new-properties" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="h-4 w-4 text-spectron-crimson" />
                      <div>
                        <Label htmlFor="price-drops">Price Drops</Label>
                        <p className="text-sm text-muted-foreground">Alert when saved properties reduce in price</p>
                      </div>
                    </div>
                    <Switch id="price-drops" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                      <div>
                        <Label htmlFor="property-updates">Property Updates</Label>
                        <p className="text-sm text-muted-foreground">Updates on properties you've viewed or saved</p>
                      </div>
                    </div>
                    <Switch id="property-updates" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Communication Channels</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Browser and mobile push notifications</p>
                      </div>
                    </div>
                    <Switch id="push-notifications" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Notification Frequency</h4>
                <Select defaultValue="daily">
                  <SelectTrigger className="border-spectron-teal/20 focus:border-spectron-teal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-spectron-gold" />
                Appearance & Display
              </CardTitle>
              <CardDescription>
                Customize how Spectron looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Theme</h4>
                <Select defaultValue="system">
                  <SelectTrigger className="border-spectron-teal/20 focus:border-spectron-teal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Language</h4>
                <Select defaultValue="en">
                  <SelectTrigger className="border-spectron-teal/20 focus:border-spectron-teal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Display Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Show more content in less space</p>
                    </div>
                    <Switch id="compact-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animations">Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-spectron-crimson" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your privacy settings and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Profile Visibility</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <div>
                        <Label htmlFor="public-profile">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">Allow others to see your profile information</p>
                      </div>
                    </div>
                    <Switch id="public-profile" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <div>
                        <Label htmlFor="contact-info">Contact Information</Label>
                        <p className="text-sm text-muted-foreground">Show email and phone to property owners</p>
                      </div>
                    </div>
                    <Switch id="contact-info" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Data & Analytics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics">Usage Analytics</Label>
                      <p className="text-sm text-muted-foreground">Help improve Spectron by sharing usage data</p>
                    </div>
                    <Switch id="analytics" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="personalization">Personalized Recommendations</Label>
                      <p className="text-sm text-muted-foreground">Use your activity to suggest relevant properties</p>
                    </div>
                    <Switch id="personalization" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Data Management</h4>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-spectron-teal text-spectron-teal hover:bg-spectron-teal/10">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="border-spectron-crimson text-spectron-crimson hover:bg-spectron-crimson/10">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                Account Management
              </CardTitle>
              <CardDescription>
                Manage your account settings and connected services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Connected Accounts</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">G</span>
                      </div>
                      <div>
                        <p className="font-medium">Google</p>
                        <p className="text-sm text-muted-foreground">john.doe@gmail.com</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Account Actions</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-spectron-teal text-spectron-teal hover:bg-spectron-teal/10">
                    <Download className="h-4 w-4 mr-2" />
                    Download Account Data
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start border-orange-500 text-orange-600 hover:bg-orange-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start border-red-500 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Support</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    Help Center
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}