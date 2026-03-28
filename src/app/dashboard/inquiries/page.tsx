import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Phone, Mail, Clock, User } from "lucide-react"

const mockInquiries = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    property: "3BHK Apartment in Salt Lake",
    message: "I'm interested in viewing this property this weekend. What time would work best?",
    createdAt: "2 hours ago",
    status: "new",
    priority: "high"
  },
  {
    id: "2",
    name: "Priya Sharma", 
    email: "priya.sharma@email.com",
    phone: "+91 87654 32109",
    property: "2BHK Flat in Park Street",
    message: "What's the parking situation? Is there covered parking available?",
    createdAt: "5 hours ago",
    status: "replied",
    priority: "medium"
  },
  {
    id: "3",
    name: "Amit Banerjee",
    email: "amit.banerjee@email.com", 
    phone: "+91 76543 21098",
    property: "4BHK Villa in New Town",
    message: "Can we negotiate on the price? I'm a serious buyer and can close quickly.",
    createdAt: "1 day ago",
    status: "new",
    priority: "high"
  }
];

export default function InquiriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-spectron-gold via-spectron-teal to-spectron-crimson bg-clip-text text-transparent">
            Property Inquiries
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage inquiries from potential buyers and renters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-spectron-teal mx-auto mb-2" />
            <p className="text-2xl font-bold">34</p>
            <p className="text-sm text-muted-foreground">Total Inquiries</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-spectron-gold mx-auto mb-2" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Pending Response</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <User className="h-8 w-8 text-spectron-crimson mx-auto mb-2" />
            <p className="text-2xl font-bold">22</p>
            <p className="text-sm text-muted-foreground">Responded</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-spectron-teal" />
            Recent Inquiries
          </CardTitle>
          <CardDescription>
            Respond to potential buyers and schedule property viewings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-4 rounded-lg border border-border/50 hover:bg-heritage-cream/20 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{inquiry.name}</h4>
                    <p className="text-sm text-muted-foreground">{inquiry.property}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={inquiry.status === 'new' ? 'default' : 'secondary'}>
                      {inquiry.status}
                    </Badge>
                    <Badge variant={inquiry.priority === 'high' ? 'destructive' : 'outline'}>
                      {inquiry.priority}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm mb-4 p-3 bg-muted/30 rounded-lg">
                  "{inquiry.message}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {inquiry.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {inquiry.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {inquiry.createdAt}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" className="bg-spectron-teal text-white hover:bg-spectron-teal/90">
                      <Mail className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}