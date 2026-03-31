import { HerdData, MilkData, FeedItem, CostsData, OtherRevenue, CalculatedMetrics, Recommendation } from '../types';

// Benchmarks for recommendations
const BENCHMARKS = {
  avgMilkPerCow: 10, // litres per day
  lactatingPercentage: 66, // 66% of total cows should be lactating
  feedCostPerLitre: 15, // maximum acceptable feed cost per litre
};

export function calculateBaselineMetrics(
  herdData: HerdData,
  milkData: MilkData,
  feedItems: FeedItem[],
  costs: CostsData,
  otherRevenue: OtherRevenue
): CalculatedMetrics {
  const { lactatingCows } = herdData;
  const { avgMilkPerCow, milkPrice } = milkData;

  // Milk calculations
  const totalMilkPerDay = lactatingCows * avgMilkPerCow;
  const totalMilkPerMonth = totalMilkPerDay * 30;
  const totalMilkPerYear = totalMilkPerDay * 365;
  const milkRevenue = totalMilkPerYear * milkPrice;

  // Feed cost calculations
  const feedCostPerCowPerDay = feedItems.reduce(
    (sum, item) => sum + item.quantityPerCow * item.pricePerKg,
    0
  );
  const feedCost = feedCostPerCowPerDay * lactatingCows * 365;

  // Total costs (annualized)
  const totalCost = feedCost + costs.labor + costs.breeding + costs.health;

  // Total revenue
  const totalRevenue =
    milkRevenue +
    otherRevenue.manure +
    otherRevenue.bullCalves +
    otherRevenue.heifers +
    otherRevenue.cows +
    otherRevenue.bulls;

  // Profit
  const profit = totalRevenue - totalCost;

  // Cost per litre
  const costPerLitre = totalMilkPerYear > 0 ? totalCost / totalMilkPerYear : 0;

  // Lactating percentage
  const lactatingPercentage = herdData.totalAnimals > 0 
    ? (lactatingCows / herdData.totalAnimals) * 100 
    : 0;

  return {
    totalRevenue,
    totalCost,
    profit,
    costPerLitre,
    avgMilkPerCow,
    totalMilkPerDay,
    totalMilkPerMonth,
    totalMilkPerYear,
    milkRevenue,
    feedCost,
    lactatingPercentage,
  };
}

export function calculateTargetMetrics(
  baseline: CalculatedMetrics,
  herdData: HerdData,
  milkData: MilkData,
  feedItems: FeedItem[],
  costs: CostsData,
  otherRevenue: OtherRevenue,
  targetMilkIncrease: number // percentage
): CalculatedMetrics {
  // New milk per cow
  const newAvgMilkPerCow = baseline.avgMilkPerCow * (1 + targetMilkIncrease / 100);

  // Create new milk data
  const newMilkData: MilkData = {
    ...milkData,
    avgMilkPerCow: newAvgMilkPerCow,
  };

  // Recalculate with new milk production
  // Assume feed requirement increases proportionally with milk production
  const feedMultiplier = 1 + targetMilkIncrease / 100;
  const adjustedFeedItems = feedItems.map(item => ({
    ...item,
    quantityPerCow: item.quantityPerCow * feedMultiplier,
  }));

  return calculateBaselineMetrics(
    herdData,
    newMilkData,
    adjustedFeedItems,
    costs,
    otherRevenue
  );
}

export function generateRecommendations(
  baseline: CalculatedMetrics,
  target: CalculatedMetrics,
  herdData: HerdData
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Milk production recommendation
  if (baseline.avgMilkPerCow < BENCHMARKS.avgMilkPerCow) {
    const milkIncrease = target.avgMilkPerCow - baseline.avgMilkPerCow;
    const revenueIncrease = target.milkRevenue - baseline.milkRevenue;
    
    recommendations.push({
      type: 'milk',
      title: 'Increase Milk Production',
      description: `Improve average milk production per cow through better nutrition and herd management`,
      currentValue: baseline.avgMilkPerCow,
      targetValue: target.avgMilkPerCow,
      impact: `+${milkIncrease.toFixed(1)} litres/cow/day → +${formatCurrency(revenueIncrease)} annual revenue`,
    });
  }

  // Breeding/Lactating ratio recommendation
  if (baseline.lactatingPercentage < BENCHMARKS.lactatingPercentage) {
    const currentLactating = herdData.lactatingCows;
    const targetLactating = Math.round((herdData.totalAnimals * BENCHMARKS.lactatingPercentage) / 100);
    const potentialIncrease = (targetLactating - currentLactating) * baseline.avgMilkPerCow * 365 * 0; // Revenue impact would need milk price
    
    recommendations.push({
      type: 'breeding',
      title: 'Improve Lactation Ratio',
      description: `Increase the percentage of lactating cows through better breeding management`,
      currentValue: baseline.lactatingPercentage,
      targetValue: BENCHMARKS.lactatingPercentage,
      impact: `${baseline.lactatingPercentage.toFixed(0)}% → ${BENCHMARKS.lactatingPercentage}% lactating cows`,
    });
  }

  // Feed efficiency recommendation
  if (baseline.costPerLitre > BENCHMARKS.feedCostPerLitre) {
    const costReduction = baseline.costPerLitre - target.costPerLitre;
    
    recommendations.push({
      type: 'feed',
      title: 'Optimize Feed Efficiency',
      description: `Improve feed conversion ratio to reduce cost per litre of milk produced`,
      currentValue: baseline.costPerLitre,
      targetValue: target.costPerLitre,
      impact: `-${costReduction.toFixed(2)} per litre → ${formatCurrency((costReduction * baseline.totalMilkPerYear))} annual savings`,
    });
  }

  return recommendations;
}

export function formatCurrency(value: number, currency: string = '₹'): string {
  return `${currency}${Math.abs(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-IN', { maximumFractionDigits: 1 });
}
