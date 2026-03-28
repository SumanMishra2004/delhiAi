'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  transformUrbanSprawlData, 
  calculateCAGR, 
  getGrowthTrend,
  generateMarketInsights,
  type UrbanSprawlData 
} from '@/lib/geo-intelligence';
import { TrendingUp, TrendingDown, Minus, Target, AlertCircle } from 'lucide-react';

interface UrbanSprawlChartProps {
  data: UrbanSprawlData[];
}

export function UrbanSprawlChart({ data }: UrbanSprawlChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No urban sprawl data available</p>
      </div>
    );
  }

  const transformedData = transformUrbanSprawlData(data);
  const cagr = calculateCAGR(data);
  const trend = getGrowthTrend(data);
  const insights = generateMarketInsights(transformedData);

  // Prepare chart data
  const chartData = transformedData.map(item => ({
    year: item.year,
    'Urban Coverage %': item.percentage,
    'Growth Score': item.growthScore,
    'Market Heat': item.marketHeat,
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-0 bg-green-50">
          <div className="text-center">
            <p className="text-sm text-green-700 mb-1">CAGR</p>
            <p className="text-2xl font-bold text-green-900">{cagr.toFixed(1)}%</p>
            <p className="text-xs text-green-600 mt-1">Annual Growth</p>
          </div>
        </Card>

        <Card className="p-4 border-0 bg-blue-50">
          <div className="text-center">
            <p className="text-sm text-blue-700 mb-1">Trend</p>
            <div className="flex items-center justify-center gap-1 mb-1">
              {trend.trend === 'Accelerating' && <TrendingUp className="h-5 w-5 text-blue-900" />}
              {trend.trend === 'Decelerating' && <TrendingDown className="h-5 w-5 text-blue-900" />}
              {trend.trend === 'Stable' && <Minus className="h-5 w-5 text-blue-900" />}
              <p className="text-lg font-bold text-blue-900">{trend.trend}</p>
            </div>
            <p className="text-xs text-blue-600">Growth Pattern</p>
          </div>
        </Card>

        <Card className="p-4 border-0 bg-purple-50">
          <div className="text-center">
            <p className="text-sm text-purple-700 mb-1">Investment Score</p>
            <p className="text-2xl font-bold text-purple-900">{insights.investmentScore}/100</p>
            <Badge 
              variant="outline" 
              className={`mt-1 text-xs ${
                insights.riskLevel === 'Low' 
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : insights.riskLevel === 'Medium'
                  ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                  : 'border-red-300 bg-red-50 text-red-700'
              }`}
            >
              {insights.riskLevel} Risk
            </Badge>
          </div>
        </Card>

        <Card className="p-4 border-0 bg-orange-50">
          <div className="text-center">
            <p className="text-sm text-orange-700 mb-1">Current Coverage</p>
            <p className="text-2xl font-bold text-orange-900">
              {transformedData[transformedData.length - 1].percentage.toFixed(1)}%
            </p>
            <Badge 
              variant="outline"
              className={`mt-1 text-xs ${
                transformedData[transformedData.length - 1].growthLabel === 'High'
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : transformedData[transformedData.length - 1].growthLabel === 'Medium'
                  ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                  : 'border-gray-300 bg-gray-50 text-gray-700'
              }`}
            >
              {transformedData[transformedData.length - 1].growthLabel} Growth
            </Badge>
          </div>
        </Card>
      </div>

      {/* Market Heat Chart */}
      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-spectron-teal" />
          Market Heat Index (Visualization Enhanced)
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorHeat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="year" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="Market Heat" 
              stroke="#14b8a6" 
              fillOpacity={1} 
              fill="url(#colorHeat)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Market Heat = (Growth Score + Area Impact) / 2 • Higher values indicate stronger investment potential
        </p>
      </div>

      {/* Urban Coverage Trend */}
      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          10-Year Urban Sprawl Growth
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="year" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'Coverage %', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line 
              type="monotone" 
              dataKey="Urban Coverage %" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="Growth Score" 
              stroke="#f59e0b" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#f59e0b', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Growth Score = Urban Coverage % × 1.5 • Amplified for visual impact
        </p>
      </div>

      {/* Market Insights */}
      <Card className="p-4 border-0 bg-gradient-to-br from-spectron-teal/10 to-spectron-gold/10">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-spectron-teal mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm mb-1">AI-Powered Market Recommendation</h4>
              <p className="text-sm text-gray-700">{insights.recommendation}</p>
            </div>
          </div>

          <div className="pt-3 border-t space-y-1">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Key Factors:</p>
            {insights.keyFactors.map((factor, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-spectron-teal"></div>
                <span>{factor}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground italic">
              {trend.description}
            </p>
          </div>
        </div>
      </Card>

      {/* Data Source Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="text-xs">
          Powered by Google Earth Engine
        </Badge>
        <span>•</span>
        <span>Satellite-backed analysis</span>
      </div>
    </div>
  );
}
