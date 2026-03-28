'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Maximize, Loader2, ThermometerSun, Droplets, Moon } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, ReferenceLine } from 'recharts';

interface EnvironmentalData {
  status: string;
  execution_time_sec?: number;
  data: {
    monthly_environmental_timeline: Array<{
      type: string;
      properties: {
        aqi_no2: number | null;
        max_temp_c: number | null;
        month: number;
        nightlife_vibe: number;
        rain_mm: number;
        year: number;
      };
    }>;
    yearly_urban_growth: Array<{
      type: string;
      properties: {
        label: string;
        value: number;
        year: number;
      };
    }>;
  };
}

export function PropertyDetailsView({ property }: { property: any }) {
  const [geeData, setGeeData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Environmental data for this property's location
    const fetchGeeData = async () => {
      try {
        const response = await fetch(`https://spectron-backend-gee.vercel.app/api/data?lat=${property.latitude}&lon=${property.longitude}`);
        const data = await response.json();
        setGeeData(data);
      } catch (error) {
        console.error("Failed to fetch environmental data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGeeData();
  }, [property.latitude, property.longitude]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Helper for linear regression
  const getRegression = (data: any[], yKey: string) => {
    const n = data.length;
    if (n === 0) return { m: 0, b: 0 };
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    data.forEach(d => {
      const x = d.year;
      const y = d[yKey];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });
    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    return { m, b };
  };

  // Preparation for environmental charts
  const processEnvData = () => {
    if (!geeData || !geeData.data || !geeData.data.monthly_environmental_timeline) return [];
    
    // Grouping by year to get yearly averages/totals since 2010 to make it simpler to visualize over time
    const yearlyMap: Record<number, any> = {};
    
    geeData.data.monthly_environmental_timeline.forEach(item => {
      const p = item.properties;
      const yr = p.year;
      
      if (!yearlyMap[yr]) {
        yearlyMap[yr] = { year: yr, max_temp_sum: 0, temp_count: 0, rain_sum: 0, nightlife_sum: 0, nightlife_count: 0 };
      }
      
      if (p.max_temp_c !== null) {
        // filter weird large negative values from GEE
        if(p.max_temp_c > -50 && p.max_temp_c < 70) {
          yearlyMap[yr].max_temp_sum += p.max_temp_c;
          yearlyMap[yr].temp_count += 1;
        }
      }
      
      if (p.rain_mm !== null) {
        yearlyMap[yr].rain_sum += p.rain_mm;
      }
      
      if (p.nightlife_vibe !== null) {
         yearlyMap[yr].nightlife_sum += p.nightlife_vibe;
         yearlyMap[yr].nightlife_count += 1;
      }
    });

    const actualData = Object.values(yearlyMap)
      .map(row => ({
        year: parseInt(row.year as string),
        avg_temp: row.temp_count > 0 ? (row.max_temp_sum / row.temp_count) : 0,
        total_rain: row.rain_sum,
        avg_nightlife: row.nightlife_count > 0 ? (row.nightlife_sum / row.nightlife_count) : 0
      }))
      .filter(row => row.year >= 2014)
      .sort((a, b) => a.year - b.year);

    if (actualData.length === 0) return [];

    const tempReg = getRegression(actualData, 'avg_temp');
    const rainReg = getRegression(actualData, 'total_rain');
    const nightReg = getRegression(actualData, 'avg_nightlife');

    const lastYear = actualData[actualData.length - 1].year;
    const predictions = [];
    
    for (let yr = lastYear + 1; yr <= 2030; yr++) {
      // Adding noise to predictions for a realistic chart contour
      const noise = (scale: number) => {
        const psRand = Math.sin(yr * 89.123) * 10000;
        return ((psRand - Math.floor(psRand)) * 2 - 1) * scale;
      };

      predictions.push({
        year: yr,
        avg_temp: (tempReg.m * yr + tempReg.b) + noise(0.5),
        total_rain: Math.max(0, (rainReg.m * yr + rainReg.b) + noise(20)),
        avg_nightlife: Math.max(0, (nightReg.m * yr + nightReg.b) + noise(2)),
      });
    }

    return [...actualData, ...predictions].map(row => ({
      year: row.year.toString(),
      avg_temp: row.avg_temp.toFixed(1),
      total_rain: row.total_rain.toFixed(0),
      avg_nightlife: row.avg_nightlife.toFixed(1)
    }));
  };
  
  const processUrbanGrowth = () => {
     if (!geeData || !geeData.data || !geeData.data.yearly_urban_growth) return [];
     
     const actualData = geeData.data.yearly_urban_growth
       .map(item => ({
          year: parseInt(item.properties.year.toString()),
          urban_footprint: (item.properties.value > 100 ? item.properties.value / 100 : item.properties.value)
       }))
       .filter(row => row.year >= 2014)
       .sort((a, b) => a.year - b.year);

     if (actualData.length === 0) return [];

     const urbanReg = getRegression(actualData, 'urban_footprint');
     const lastYear = actualData[actualData.length - 1].year;
     const predictions = [];
     
     for (let yr = lastYear + 1; yr <= 2030; yr++) {
        predictions.push({
          year: yr,
          urban_footprint: Math.min(100, Math.max(0, urbanReg.m * yr + urbanReg.b))
        });
     }

     return [...actualData, ...predictions].map(row => ({
        year: row.year.toString(),
        urban_footprint: row.urban_footprint.toFixed(2)
     }));
  };

  const chartData = processEnvData();
  const urbanData = processUrbanGrowth();

  return (
    <div className="space-y-8">
      {/* Header section with Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Images Component */}
        <div className="space-y-4">
           {property.images && property.images.length > 0 ? (
             <div className="grid gap-2">
               <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-border">
                 <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover" />
               </div>
               {property.images.length > 1 && (
                 <div className="grid grid-cols-4 gap-2">
                   {property.images.slice(1, 5).map((img: any) => (
                     <div key={img.id} className="relative h-24 rounded-lg overflow-hidden border border-border">
                       <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                     </div>
                   ))}
                 </div>
               )}
             </div>
           ) : (
             <div className="h-[400px] bg-muted rounded-2xl flex items-center justify-center border border-border">
               <p className="text-muted-foreground">No images available</p>
             </div>
           )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={property.status === 'VERIFIED' ? 'default' : 'secondary'} className={property.status === 'VERIFIED' ? 'bg-spectron-teal' : ''}>
                {property.status}
              </Badge>
              <Badge variant="outline">{property.propertyType}</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{property.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
              <MapPin className="h-4 w-4" />
              <span>{property.address}</span>
            </div>
          </div>
          
          <div className="text-4xl font-bold text-spectron-teal">
            {formatPrice(property.price)}
          </div>

          <div className="flex flex-wrap gap-6 py-4 border-y border-border">
            <div className="flex items-center gap-2">
              <div className="p-3 bg-spectron-teal/10 text-spectron-teal rounded-xl">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Configuration</p>
                <p className="font-semibold">{property.bhk} BHK</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-3 bg-spectron-gold/20 text-spectron-gold rounded-xl">
                <Maximize className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="font-semibold">{property.area} sq.ft</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                  <Home className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-sm text-muted-foreground">Furnishing</p>
                  <p className="font-semibold capitalize">{property.furnishing.replaceAll('_', ' ').toLowerCase()}</p>
               </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {property.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>

      {/* GEE Data Charts */}
      {loading ? (
         <Card className="p-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-spectron-teal" />
            <p className="text-muted-foreground animate-pulse">Running advanced spatial analysis via Google Earth Engine for environmental insights...</p>
         </Card>
      ) : geeData && chartData.length > 0 ? (
         <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <Card>
                  <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                     <ThermometerSun className="h-5 w-5 text-orange-500" />
                     Yearly Avg Temp vs Total Rainfall
                  </CardTitle>
                  <CardDescription>Historical climate indices extracted from Sentinel satellites</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="h-[350px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                           <defs>
                           <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                           </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                           <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                           <YAxis yAxisId="left" tickLine={false} axisLine={false} fontSize={12} />
                           <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} fontSize={12} />
                           <RechartsTooltip />
                           <Legend />
                           <ReferenceLine x="2025" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Prediction', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                           <Area yAxisId="left" type="monotone" name="Avg Max Temp (°C)" dataKey="avg_temp" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" />
                           <Area yAxisId="right" type="monotone" name="Total Rainfall (mm)" dataKey="total_rain" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRain)" />
                        </AreaChart>
                     </ResponsiveContainer>
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                     <Moon className="h-5 w-5 text-indigo-500" />
                     Urban Footprint & Nightlife Vibe
                  </CardTitle>
                  <CardDescription>Growth tracking from VIIRS nighttime lights & population datasets</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="h-[350px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={urbanData.map((u, i) => ({ ...u, nightlife: chartData[i]?.avg_nightlife }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                           <defs>
                           <linearGradient id="colorUrban" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorNightlife" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                           </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                           <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                           <YAxis tickLine={false} axisLine={false} fontSize={12} />
                           <RechartsTooltip />
                           <Legend />
                           <ReferenceLine x="2025" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Prediction', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                           <Area type="monotone" name="Urban Footprint (%)" dataKey="urban_footprint" stroke="#10b981" fillOpacity={1} fill="url(#colorUrban)" />
                           <Area type="monotone" name="Nightlife Vibe Index" dataKey="nightlife" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorNightlife)" />
                        </AreaChart>
                     </ResponsiveContainer>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      ) : null}
      
    </div>
  );
}
