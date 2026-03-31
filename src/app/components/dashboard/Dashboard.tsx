import { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { calculateBaselineMetrics, formatCurrency, formatNumber } from '../../utils/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, DollarSign, Droplet, Coins } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MenuDialog } from '../menu/MenuDialog';

export function Dashboard() {
  const { data } = useAppContext();

  const metrics = useMemo(() => {
    return calculateBaselineMetrics(
      data.herdData,
      data.milkData,
      data.feedItems,
      data.costs,
      data.otherRevenue
    );
  }, [data]);

  const isProfitable = metrics.profit >= 0;
  const currency = data.farmSetup.currency;

  // Generate mock weekly data for time-based charts
  const weeklyTimelineData = [
    { week: 'Week 1', revenue: metrics.totalRevenue * 0.23, cost: metrics.totalCost * 0.24 },
    { week: 'Week 2', revenue: metrics.totalRevenue * 0.25, cost: metrics.totalCost * 0.26 },
    { week: 'Week 3', revenue: metrics.totalRevenue * 0.26, cost: metrics.totalCost * 0.25 },
    { week: 'Week 4', revenue: metrics.totalRevenue * 0.26, cost: metrics.totalCost * 0.25 },
  ];

  // Cost distribution data
  const costBreakdownData = [
    { name: 'Feed', value: metrics.feedCost },
    { name: 'Labor', value: data.costs.labor },
    { name: 'Breeding', value: data.costs.breeding },
    { name: 'Health', value: data.costs.health },
  ];

  // Revenue distribution data
  const revenueDistributionData = [
    { name: 'Milk Sales', value: metrics.milkRevenue },
    { name: 'Manure', value: data.otherRevenue.manure },
    { name: 'Bull Calves', value: data.otherRevenue.bullCalves },
    { name: 'Heifers', value: data.otherRevenue.heifers },
    { name: 'Cows', value: data.otherRevenue.cows },
    { name: 'Bulls', value: data.otherRevenue.bulls },
  ].filter(item => item.value > 0);

  // Milk production data (weekly)
  const avgDailyMilk = metrics.totalMilkPerDay;
  const milkProductionData = [
    { week: 'Week 1', production: avgDailyMilk * 7 * 0.97 },
    { week: 'Week 2', production: avgDailyMilk * 7 * 1.02 },
    { week: 'Week 3', production: avgDailyMilk * 7 * 0.99 },
    { week: 'Week 4', production: avgDailyMilk * 7 * 1.02 },
  ];

  // Milk price data (weekly) - 3 buyer types + average
  const avgPrice = data.milkData.milkPrice;
  const milkPriceData = [
    {
      week: 'Week 1',
      cooperative: data.milkData.milkPriceCooperative || avgPrice * 0.95,
      individuals: data.milkData.milkPriceIndividuals || avgPrice * 1.05,
      institutions: data.milkData.milkPriceInstitutions || avgPrice * 1.1,
      average: avgPrice,
    },
    {
      week: 'Week 2',
      cooperative: (data.milkData.milkPriceCooperative || avgPrice * 0.95) * 1.02,
      individuals: (data.milkData.milkPriceIndividuals || avgPrice * 1.05) * 0.98,
      institutions: (data.milkData.milkPriceInstitutions || avgPrice * 1.1) * 1.01,
      average: avgPrice * 1.01,
    },
    {
      week: 'Week 3',
      cooperative: (data.milkData.milkPriceCooperative || avgPrice * 0.95) * 0.98,
      individuals: (data.milkData.milkPriceIndividuals || avgPrice * 1.05) * 1.03,
      institutions: (data.milkData.milkPriceInstitutions || avgPrice * 1.1) * 0.99,
      average: avgPrice * 0.99,
    },
    {
      week: 'Week 4',
      cooperative: (data.milkData.milkPriceCooperative || avgPrice * 0.95) * 1.01,
      individuals: (data.milkData.milkPriceIndividuals || avgPrice * 1.05) * 1.02,
      institutions: (data.milkData.milkPriceInstitutions || avgPrice * 1.1) * 1.02,
      average: avgPrice * 1.02,
    },
  ];

  // Animal price data (weekly) - 5 types
  const animalPriceData = [
    {
      week: 'Week 1',
      bullCalf: data.otherRevenue.bullCalfPrice || 5000,
      heifer: data.otherRevenue.heiferPrice || 30000,
      cow: data.otherRevenue.cowPrice || 50000,
      bull: data.otherRevenue.bullPrice || 40000,
      calf: (data.otherRevenue.bullCalfPrice || 5000) * 0.8,
    },
    {
      week: 'Week 2',
      bullCalf: (data.otherRevenue.bullCalfPrice || 5000) * 1.02,
      heifer: (data.otherRevenue.heiferPrice || 30000) * 1.01,
      cow: (data.otherRevenue.cowPrice || 50000) * 0.99,
      bull: (data.otherRevenue.bullPrice || 40000) * 1.01,
      calf: (data.otherRevenue.bullCalfPrice || 5000) * 0.82,
    },
    {
      week: 'Week 3',
      bullCalf: (data.otherRevenue.bullCalfPrice || 5000) * 0.98,
      heifer: (data.otherRevenue.heiferPrice || 30000) * 1.03,
      cow: (data.otherRevenue.cowPrice || 50000) * 1.02,
      bull: (data.otherRevenue.bullPrice || 40000) * 0.99,
      calf: (data.otherRevenue.bullCalfPrice || 5000) * 0.79,
    },
    {
      week: 'Week 4',
      bullCalf: (data.otherRevenue.bullCalfPrice || 5000) * 1.03,
      heifer: (data.otherRevenue.heiferPrice || 30000) * 1.02,
      cow: (data.otherRevenue.cowPrice || 50000) * 1.01,
      bull: (data.otherRevenue.bullPrice || 40000) * 1.02,
      calf: (data.otherRevenue.bullCalfPrice || 5000) * 0.83,
    },
  ];

  // Feed consumption data
  const feedConsumptionData = data.feedItems.map(feed => ({
    name: feed.type,
    quantity: feed.quantityPerCow * data.herdData.lactatingCows,
    cost: feed.quantityPerCow * data.herdData.lactatingCows * feed.pricePerKg,
  }));

  // Breeding cost breakdown (calf feeding)
  const breedingCostData = [
    { name: 'Milk', value: data.costs.calfFeedingMilk || 0 },
    { name: 'Milk Replacer', value: data.costs.calfFeedingMilkReplacer || 0 },
    { name: 'Calf Pellet', value: data.costs.calfFeedingPellet || 0 },
  ].filter(item => item.value > 0);

  // Labor cost split
  const laborCostData = [
    { 
      name: 'Workers', 
      value: (data.costs.numberOfWorkers || 2) * (data.costs.monthlyWageRateEmployee || 5000) * 12 
    },
    { 
      name: 'Managers', 
      value: (data.costs.numberOfManagers || 1) * (data.costs.monthlyWageRateManager || 10000) * 12 
    },
  ].filter(item => item.value > 0);

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <div className="space-y-6 p-4 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            {data.farmSetup.farmName || 'Welcome to Dairy Manager'}
          </h1>
          <p className="text-muted-foreground">
            {data.farmSetup.farmName ? 'Current Performance' : 'Get started by adding your farm from the menu'}
          </p>
        </div>
        <MenuDialog />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-semibold">{formatCurrency(metrics.totalRevenue, currency)}</div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Annual income from all sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-semibold">{formatCurrency(metrics.totalCost, currency)}</div>
              <Coins className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Annual operational expenses</p>
          </CardContent>
        </Card>

        <Card className={isProfitable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isProfitable ? 'Profit' : 'Loss'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-semibold ${isProfitable ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(metrics.profit, currency)}
              </div>
              {isProfitable ? (
                <TrendingUp className="h-8 w-8 text-green-700" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-700" />
              )}
            </div>
            <p className={`text-sm mt-2 ${isProfitable ? 'text-green-700' : 'text-red-700'}`}>
              {isProfitable ? 'Your farm is profitable' : 'Your farm needs improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost per Litre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-semibold">{formatCurrency(metrics.costPerLitre, currency)}</div>
              <Droplet className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Production cost efficiency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Milk per Cow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-semibold">{formatNumber(metrics.avgMilkPerCow)} L/day</div>
              <Droplet className="h-8 w-8 text-cyan-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Daily production per lactating cow</p>
          </CardContent>
        </Card>
      </div>

      {/* 1. Revenue vs Cost Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Cost Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyTimelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={2} name="Cost" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Cost Distribution - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={costBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${((entry.value / metrics.totalCost) * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {costBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Revenue Distribution - Pie Chart */}
      {revenueDistributionData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${((entry.value / metrics.totalRevenue) * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* 4. Milk Production (Week 1-4) */}
      <Card>
        <CardHeader>
          <CardTitle>Milk Production (Weekly)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={milkProductionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => `${formatNumber(Number(value))} L`} />
              <Legend />
              <Line type="monotone" dataKey="production" stroke="#3b82f6" strokeWidth={2} name="Production (L)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 5. Milk Price - 4 Lines (3 buyer types + average) */}
      <Card>
        <CardHeader>
          <CardTitle>Milk Price Trends (Weekly)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={milkPriceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
              <Legend />
              <Line type="monotone" dataKey="cooperative" stroke="#10b981" strokeWidth={2} name="Cooperative" />
              <Line type="monotone" dataKey="individuals" stroke="#f59e0b" strokeWidth={2} name="Individuals" />
              <Line type="monotone" dataKey="institutions" stroke="#3b82f6" strokeWidth={2} name="Institutions" />
              <Line type="monotone" dataKey="average" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" name="Average" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 6. Animal Price - 5 Lines */}
      <Card>
        <CardHeader>
          <CardTitle>Animal Price Trends (Weekly)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={animalPriceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
              <Legend />
              <Line type="monotone" dataKey="bullCalf" stroke="#10b981" strokeWidth={2} name="Bull Calf" />
              <Line type="monotone" dataKey="heifer" stroke="#f59e0b" strokeWidth={2} name="Heifer" />
              <Line type="monotone" dataKey="cow" stroke="#3b82f6" strokeWidth={2} name="Cow" />
              <Line type="monotone" dataKey="bull" stroke="#8b5cf6" strokeWidth={2} name="Bull" />
              <Line type="monotone" dataKey="calf" stroke="#ec4899" strokeWidth={2} name="Calf" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 7. Feed Consumption - Bar Chart */}
      {feedConsumptionData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Feed Consumption (Daily Total)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feedConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => 
                    name === 'quantity' ? `${formatNumber(Number(value))} kg` : formatCurrency(Number(value), currency)
                  } 
                />
                <Legend />
                <Bar dataKey="quantity" fill="#10b981" name="Quantity (kg)" />
                <Bar dataKey="cost" fill="#f59e0b" name="Daily Cost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* 8. Breeding Cost - Calf Feeding Breakdown */}
      {breedingCostData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Breeding Cost - Calf Feeding</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={breedingCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Annual Cost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* 9. Labor Cost Split */}
      {laborCostData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Labor Cost Split</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={laborCostData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => {
                    const total = laborCostData.reduce((sum, item) => sum + item.value, 0);
                    return `${entry.name}: ${((entry.value / total) * 100).toFixed(1)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {laborCostData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}