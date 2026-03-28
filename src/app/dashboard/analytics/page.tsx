import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Eye, Users, Building2, Calendar } from "lucide-react"

const analyticsData = [
  {
    title: "Property Views",
    value: "12,847",
    change: "+23%",
    trend: "up",
    description: "Total views across all listings"
  },
  {
    title: "Inquiries Generated", 
    value: "284",
    change: "+15%",
    trend: "up",
    description: "Direct inquiries from listings"
  },
  {
    title: "Conversion Rate",
    value: "24.5%",
    change: "+3.2%", 
    trend: "up",
    description: "Views to inquiries ratio"
  },
  {
    title: "Avg. Time on Listing",
    value: "3m 42s",
    change: "+12%",
    trend: "up",
    description: "Average engagement time"
  }
];

const propertyPerformance = [
  { name: "3BHK Salt Lake", views: 2847, inquiries: 34, conversion: 1.2 },
  { name: "2BHK Park Street", views: 1923, inquiries: 28, conversion: 1.5 },
  { name: "4BHK New Town", views: 3456, inquiries: 45, conversion: 1.3 },
  { name: "1BHK Ballygunge", views: 1234, inquiries: 18, conversion: 1.5 }
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-spectron-gold via-spectron-teal to-spectron-crimson bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your property performance and market insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <BarChart3 className="h-4 w-4 text-spectron-teal" />
              </div>
              <p className="text-2xl font-bold mb-1">{metric.value}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {metric.change}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Performance */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-spectron-gold" />
            Property Performance
          </CardTitle>
          <CardDescription>
            Individual listing analytics and conversion metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {propertyPerformance.map((property, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{property.name}</h4>
                  <Badge variant="outline" className="bg-spectron-teal/10 text-spectron-teal">
                    {property.conversion}% conversion
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold text-lg">{property.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Inquiries</p>
                    <p className="font-semibold text-lg">{property.inquiries}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conversion</p>
                    <p className="font-semibold text-lg">{property.conversion}%</p>
                  </div>
                </div>
                <Progress value={property.conversion * 20} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-spectron-crimson" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: "Direct Search", percentage: 45, visitors: "5,234" },
                { source: "Social Media", percentage: 28, visitors: "3,156" },
                { source: "Referrals", percentage: 18, visitors: "2,089" },
                { source: "Email Campaign", percentage: 9, visitors: "1,045" }
              ].map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{source.source}</p>
                    <p className="text-sm text-muted-foreground">{source.visitors} visitors</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={source.percentage} className="w-24 h-2" />
                    <span className="text-sm font-medium w-12">{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Weekly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { day: "Monday", views: 1234, inquiries: 23 },
                { day: "Tuesday", views: 1456, inquiries: 28 },
                { day: "Wednesday", views: 1789, inquiries: 34 },
                { day: "Thursday", views: 1567, inquiries: 31 },
                { day: "Friday", views: 1890, inquiries: 38 },
                { day: "Saturday", views: 2134, inquiries: 45 },
                { day: "Sunday", views: 1678, inquiries: 32 }
              ].map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{day.day}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      <Eye className="h-3 w-3 inline mr-1" />
                      {day.views}
                    </span>
                    <span className="text-spectron-teal font-medium">
                      {day.inquiries} inquiries
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}