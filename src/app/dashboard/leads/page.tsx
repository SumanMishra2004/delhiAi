import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Phone, 
  Mail, 
  MessageSquare,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  MapPin,
  IndianRupee
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Mock leads data - replace with real data from backend
const leadsData = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    status: 'NEW',
    priority: 'HIGH',
    source: 'Website',
    interestedIn: 'Apartment',
    budget: { min: 5000000, max: 8000000 },
    location: 'Salt Lake City',
    createdAt: '2024-12-25',
    lastContact: '2024-12-25',
    notes: 'Looking for 2-3 BHK apartment near IT hub',
    assignedProperties: 2,
    interactions: 3
  },
  {
    id: '2',
    name: 'Priya Banerjee',
    email: 'priya.b@email.com',
    phone: '+91 87654 32109',
    status: 'CONTACTED',
    priority: 'MEDIUM',
    source: 'Referral',
    interestedIn: 'House',
    budget: { min: 10000000, max: 15000000 },
    location: 'Ballygunge',
    createdAt: '2024-12-22',
    lastContact: '2024-12-24',
    notes: 'Interested in independent house with garden',
    assignedProperties: 4,
    interactions: 7
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit.k@email.com',
    phone: '+91 76543 21098',
    status: 'QUALIFIED',
    priority: 'HIGH',
    source: 'Social Media',
    interestedIn: 'Apartment',
    budget: { min: 6000000, max: 9000000 },
    location: 'New Town',
    createdAt: '2024-12-20',
    lastContact: '2024-12-23',
    notes: 'Ready to buy within 2 months, pre-approved loan',
    assignedProperties: 6,
    interactions: 12
  },
  {
    id: '4',
    name: 'Sneha Das',
    email: 'sneha.das@email.com',
    phone: '+91 65432 10987',
    status: 'PROPOSAL_SENT',
    priority: 'HIGH',
    source: 'Website',
    interestedIn: 'Plot',
    budget: { min: 3000000, max: 5000000 },
    location: 'Rajarhat',
    createdAt: '2024-12-18',
    lastContact: '2024-12-22',
    notes: 'Interested in plot for future construction',
    assignedProperties: 3,
    interactions: 8
  },
  {
    id: '5',
    name: 'Rajesh Gupta',
    email: 'rajesh.g@email.com',
    phone: '+91 54321 09876',
    status: 'CONVERTED',
    priority: 'LOW',
    source: 'Walk-in',
    interestedIn: 'Apartment',
    budget: { min: 7500000, max: 7500000 },
    location: 'Park Street',
    createdAt: '2024-12-15',
    lastContact: '2024-12-21',
    notes: 'Successfully purchased 2BHK apartment',
    assignedProperties: 1,
    interactions: 15
  }
];

const statusColors = {
  NEW: 'bg-blue-100 text-blue-700 border-blue-200',
  CONTACTED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  QUALIFIED: 'bg-purple-100 text-purple-700 border-purple-200',
  PROPOSAL_SENT: 'bg-orange-100 text-orange-700 border-orange-200',
  CONVERTED: 'bg-green-100 text-green-700 border-green-200',
  LOST: 'bg-red-100 text-red-700 border-red-200'
};

const priorityColors = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-green-100 text-green-700'
};

async function LeadsOverview() {
  const stats = [
    {
      title: "Total Leads",
      value: leadsData.length.toString(),
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Qualified Leads",
      value: leadsData.filter(lead => lead.status === 'QUALIFIED' || lead.status === 'PROPOSAL_SENT').length.toString(),
      change: "+18%",
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Conversion Rate",
      value: `${Math.round((leadsData.filter(lead => lead.status === 'CONVERTED').length / leadsData.length) * 100)}%`,
      change: "+5%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Avg Response Time",
      value: "2.5 hrs",
      change: "-15%",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <Badge className="bg-green-100 text-green-700">
                {stat.change}
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function LeadsTable() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-spectron-teal" />
              Lead Management
            </CardTitle>
            <CardDescription>Track and manage your sales leads</CardDescription>
          </div>
          <Button className="bg-gradient-to-r from-spectron-gold to-spectron-teal">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search leads..." 
              className="pl-10 focus:border-spectron-teal focus:ring-spectron-teal"
            />
          </div>
          
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="CONTACTED">Contacted</SelectItem>
              <SelectItem value="QUALIFIED">Qualified</SelectItem>
              <SelectItem value="PROPOSAL_SENT">Proposal Sent</SelectItem>
              <SelectItem value="CONVERTED">Converted</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {leadsData.map((lead) => (
            <div key={lead.id} className="p-6 rounded-lg border bg-heritage-cream/20 hover:bg-heritage-cream/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${lead.name}`} />
                    <AvatarFallback className="bg-spectron-teal/10 text-spectron-teal">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Lead Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{lead.name}</h3>
                      <Badge className={priorityColors[lead.priority as keyof typeof priorityColors]}>
                        {lead.priority}
                      </Badge>
                      <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{lead.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" />
                        <span>₹{(lead.budget.min / 100000).toFixed(0)}L - ₹{(lead.budget.max / 100000).toFixed(0)}L</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-spectron-teal" />
                        <span>{lead.assignedProperties} properties assigned</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-spectron-teal" />
                        <span>{lead.interactions} interactions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-spectron-teal" />
                        <span>Last contact: {new Date(lead.lastContact).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    
                    {lead.notes && (
                      <div className="mt-3 p-3 bg-white/50 rounded-lg">
                        <p className="text-sm">{lead.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Lead
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Building2 className="h-4 w-4 mr-2" />
                        Assign Properties
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Converted
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <XCircle className="h-4 w-4 mr-2" />
                        Mark as Lost
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {leadsData.length} of {leadsData.length} leads
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function LeadsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'BROKER') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-spectron-teal/10 p-2">
              <Users className="h-6 w-6 text-spectron-teal" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Lead Management</h1>
              <Badge className="mt-1 border-spectron-teal/30 bg-spectron-teal/10 text-spectron-teal">
                <TrendingUp className="mr-1 h-3 w-3" />
                Sales Pipeline
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Track, manage, and convert your property leads effectively
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/analytics">
            <Button variant="outline" className="gap-2 hover:bg-spectron-teal/10 hover:text-spectron-teal hover:border-spectron-teal">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Button className="gap-2 bg-gradient-to-r from-spectron-gold to-spectron-teal">
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <Suspense fallback={
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <LeadsOverview />
      </Suspense>

      {/* Leads Table */}
      <Suspense fallback={
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      }>
        <LeadsTable />
      </Suspense>
    </div>
  );
}