import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Phone, Mail, Calendar, Plus, Eye, Edit, Star } from "lucide-react"

const mockClients = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    status: "active",
    type: "buyer",
    budget: "₹80L - ₹1Cr",
    preferences: "3-4BHK, Salt Lake area",
    lastContact: "2 days ago",
    properties: 3,
    rating: 5
  },
  {
    id: "2", 
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 87654 32109",
    status: "prospect",
    type: "investor",
    budget: "₹50L - ₹75L",
    preferences: "2-3BHK, Good ROI",
    lastContact: "1 week ago",
    properties: 1,
    rating: 4
  },
  {
    id: "3",
    name: "Amit Banerjee", 
    email: "amit.banerjee@email.com",
    phone: "+91 76543 21098",
    status: "converted",
    type: "buyer",
    budget: "₹1.2Cr+",
    preferences: "Luxury villa, New Town",
    lastContact: "3 days ago",
    properties: 5,
    rating: 5
  }
];

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-spectron-gold via-spectron-teal to-spectron-crimson bg-clip-text text-transparent">
            Client Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your client relationships and track interactions
          </p>
        </div>
        <Button className="bg-gradient-to-r from-spectron-gold to-spectron-teal text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-spectron-teal mx-auto mb-2" />
            <p className="text-2xl font-bold">89</p>
            <p className="text-sm text-muted-foreground">Total Clients</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Eye className="h-8 w-8 text-spectron-gold mx-auto mb-2" />
            <p className="text-2xl font-bold">34</p>
            <p className="text-sm text-muted-foreground">Active Prospects</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-spectron-crimson mx-auto mb-2" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Meetings This Week</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">4.8</p>
            <p className="text-sm text-muted-foreground">Avg. Rating</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-spectron-teal" />
            Client Portfolio
          </CardTitle>
          <CardDescription>
            Manage your client relationships and track their property journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockClients.map((client) => (
              <div key={client.id} className="p-4 rounded-lg border border-border/50 hover:bg-heritage-cream/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`} />
                      <AvatarFallback className="bg-gradient-to-br from-spectron-gold to-spectron-teal text-white">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-lg">{client.name}</h4>
                        <Badge variant={
                          client.status === 'active' ? 'default' :
                          client.status === 'converted' ? 'secondary' : 'outline'
                        }>
                          {client.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {client.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < client.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Last contact: {client.lastContact}</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Budget Range</p>
                    <p className="font-semibold text-spectron-teal">{client.budget}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preferences</p>
                    <p className="font-medium">{client.preferences}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Properties Viewed</p>
                    <p className="font-semibold">{client.properties} properties</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                  <Button size="sm" className="bg-spectron-teal text-white hover:bg-spectron-teal/90">
                    <Eye className="h-3 w-3 mr-1" />
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}