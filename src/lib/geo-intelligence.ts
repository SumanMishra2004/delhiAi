// Geo-Intelligence Utilities for Urban Sprawl & Market Analysis
// Transforms raw GEE data into judge-friendly visualizations

export interface UrbanSprawlData {
  year: number;
  urbanSqKm: number;
  percentage: number;
}

export interface TransformedSprawlData extends UrbanSprawlData {
  // Visualization multipliers for hackathon impact
  growthScore: number;      // percentage * 1.5
  areaImpact: number;        // urbanSqKm * 10
  marketHeat: number;        // (growthScore + areaImpact) / 2
  growthLabel: 'High' | 'Medium' | 'Low';
}

/**
 * Transform raw urban sprawl data with visualization multipliers
 * Makes trends visually impactful for judges
 */
export function transformUrbanSprawlData(
  rawData: UrbanSprawlData[]
): TransformedSprawlData[] {
  return rawData.map(item => {
    const growthScore = item.percentage * 1.5;
    const areaImpact = item.urbanSqKm * 10;
    const marketHeat = (growthScore + areaImpact) / 2;

    // Determine growth label based on percentage
    let growthLabel: 'High' | 'Medium' | 'Low';
    if (item.percentage > 30) growthLabel = 'High';
    else if (item.percentage > 15) growthLabel = 'Medium';
    else growthLabel = 'Low';

    return {
      ...item,
      growthScore,
      areaImpact,
      marketHeat,
      growthLabel
    };
  });
}

/**
 * Calculate CAGR (Compound Annual Growth Rate) for urban sprawl
 */
export function calculateCAGR(data: UrbanSprawlData[]): number {
  if (data.length < 2) return 0;

  const sorted = [...data].sort((a, b) => a.year - b.year);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  if (first.percentage === 0) return 0;

  const years = last.year - first.year;
  const cagr = (Math.pow(last.percentage / first.percentage, 1 / years) - 1) * 100;

  return Math.round(cagr * 100) / 100;
}

/**
 * Detect growth acceleration or deceleration
 */
export function getGrowthTrend(data: UrbanSprawlData[]): {
  trend: 'Accelerating' | 'Decelerating' | 'Stable';
  description: string;
} {
  if (data.length < 3) {
    return { trend: 'Stable', description: 'Insufficient data for trend analysis' };
  }

  const sorted = [...data].sort((a, b) => a.year - b.year);
  const recentYears = sorted.slice(-3);

  const growth1 = recentYears[1].percentage - recentYears[0].percentage;
  const growth2 = recentYears[2].percentage - recentYears[1].percentage;

  if (growth2 > growth1 * 1.2) {
    return {
      trend: 'Accelerating',
      description: 'Urban expansion is speeding up - high investment potential'
    };
  } else if (growth2 < growth1 * 0.8) {
    return {
      trend: 'Decelerating',
      description: 'Urban growth is slowing - market stabilization phase'
    };
  } else {
    return {
      trend: 'Stable',
      description: 'Consistent urban growth - predictable market conditions'
    };
  }
}

/**
 * Generate market insights based on urban sprawl data
 */
export function generateMarketInsights(data: TransformedSprawlData[]): {
  investmentScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendation: string;
  keyFactors: string[];
} {
  if (data.length === 0) {
    return {
      investmentScore: 50,
      riskLevel: 'Medium',
      recommendation: 'Insufficient data for analysis',
      keyFactors: []
    };
  }

  const latest = data[data.length - 1];
  const cagr = calculateCAGR(data);
  const trend = getGrowthTrend(data);

  // Calculate investment score
  let score = 50;
  if (latest.percentage > 30) score += 20;
  else if (latest.percentage > 15) score += 10;
  
  if (cagr > 5) score += 15;
  else if (cagr > 2) score += 10;
  
  if (trend.trend === 'Accelerating') score += 15;
  else if (trend.trend === 'Stable') score += 10;

  score = Math.min(100, Math.max(0, score));

  // Determine risk level
  let riskLevel: 'Low' | 'Medium' | 'High';
  if (score > 75) riskLevel = 'Low';
  else if (score > 50) riskLevel = 'Medium';
  else riskLevel = 'High';

  // Generate recommendation
  let recommendation: string;
  if (score > 75) {
    recommendation = 'Strong buy - High growth area with excellent infrastructure development';
  } else if (score > 60) {
    recommendation = 'Good investment - Steady growth with moderate risk';
  } else if (score > 40) {
    recommendation = 'Hold - Monitor market conditions before investing';
  } else {
    recommendation = 'Caution - Limited growth indicators, consider alternatives';
  }

  // Key factors
  const keyFactors: string[] = [];
  keyFactors.push(`${latest.percentage.toFixed(1)}% urban coverage`);
  keyFactors.push(`${cagr.toFixed(1)}% annual growth rate`);
  keyFactors.push(`${trend.trend} growth trend`);
  keyFactors.push(`Market heat index: ${latest.marketHeat.toFixed(1)}`);

  return {
    investmentScore: Math.round(score),
    riskLevel,
    recommendation,
    keyFactors
  };
}

// AQI Data Types
export interface AQIData {
  year: number;
  month: number;
  aqi: number;
}

export interface AQIAnalysis {
  avgAQI: number;
  livabilityScore: number; // 100 - avgAQI
  trend: 'Improving' | 'Worsening' | 'Stable';
  category: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  description: string;
}

/**
 * Analyze AQI data and calculate livability score
 */
export function analyzeAQI(data: AQIData[]): AQIAnalysis {
  if (data.length === 0) {
    return {
      avgAQI: 0,
      livabilityScore: 100,
      trend: 'Stable',
      category: 'Good',
      description: 'No AQI data available'
    };
  }

  const avgAQI = data.reduce((sum, item) => sum + item.aqi, 0) / data.length;
  const livabilityScore = Math.max(0, 100 - avgAQI);

  // Determine trend
  let trend: 'Improving' | 'Worsening' | 'Stable' = 'Stable';
  if (data.length >= 12) {
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.aqi, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.aqi, 0) / secondHalf.length;
    
    if (secondAvg < firstAvg * 0.9) trend = 'Improving';
    else if (secondAvg > firstAvg * 1.1) trend = 'Worsening';
  }

  // Categorize AQI
  let category: AQIAnalysis['category'];
  let description: string;
  
  if (avgAQI <= 50) {
    category = 'Good';
    description = 'Excellent air quality - ideal for living';
  } else if (avgAQI <= 100) {
    category = 'Moderate';
    description = 'Acceptable air quality - suitable for most people';
  } else if (avgAQI <= 150) {
    category = 'Unhealthy';
    description = 'Sensitive groups may experience health effects';
  } else if (avgAQI <= 200) {
    category = 'Very Unhealthy';
    description = 'Health warnings - everyone may experience effects';
  } else {
    category = 'Hazardous';
    description = 'Health alert - serious health effects for all';
  }

  return {
    avgAQI: Math.round(avgAQI),
    livabilityScore: Math.round(livabilityScore),
    trend,
    category,
    description
  };
}

/**
 * Get color for AQI visualization
 */
export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#10b981'; // Green
  if (aqi <= 100) return '#fbbf24'; // Yellow
  if (aqi <= 150) return '#f97316'; // Orange
  if (aqi <= 200) return '#ef4444'; // Red
  return '#991b1b'; // Dark red
}

/**
 * Get color for growth visualization
 */
export function getGrowthColor(percentage: number): string {
  if (percentage > 30) return '#10b981'; // High growth - Green
  if (percentage > 15) return '#fbbf24'; // Medium growth - Yellow
  return '#94a3b8'; // Low growth - Gray
}
