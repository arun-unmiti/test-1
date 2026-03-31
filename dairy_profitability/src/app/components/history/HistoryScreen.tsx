import { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { calculateBaselineMetrics, formatCurrency, formatNumber } from '../../utils/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, TrendingUp, Save } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlySnapshot } from '../../types';

export function HistoryScreen() {
  const { data, addMonthlySnapshot } = useAppContext();

  const currentMetrics = useMemo(() => {
    return calculateBaselineMetrics(
      data.herdData,
      data.milkData,
      data.feedItems,
      data.costs,
      data.otherRevenue
    );
  }, [data]);

  const handleSaveSnapshot = () => {
    const now = new Date();
    const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const snapshot: MonthlySnapshot = {
      month: monthName,
      date: now.toISOString(),
      metrics: currentMetrics,
      herdData: data.herdData,
      milkData: data.milkData,
    };
    addMonthlySnapshot(snapshot);
  };

  const trendData = data.history.map((snapshot) => ({
    month: snapshot.month,
    profit: snapshot.metrics.profit,
    revenue: snapshot.metrics.totalRevenue,
    cost: snapshot.metrics.totalCost,
    milk: snapshot.metrics.avgMilkPerCow,
  }));

  const currency = data.farmSetup.currency;

  return (
    <div className="space-y-6 p-4 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">History</h1>
          <p className="text-muted-foreground">Track performance over time</p>
        </div>
        <Button onClick={handleSaveSnapshot}>
          <Save className="h-4 w-4 mr-2" />
          Save Snapshot
        </Button>
      </div>

      {/* Current Performance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Current Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-900">Profit:</span>
            <span className="font-semibold text-blue-900">
              {formatCurrency(currentMetrics.profit, currency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-900">Avg Milk/Cow:</span>
            <span className="font-semibold text-blue-900">
              {formatNumber(currentMetrics.avgMilkPerCow)} L/day
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-900">Cost/Litre:</span>
            <span className="font-semibold text-blue-900">
              {formatCurrency(currentMetrics.costPerLitre, currency)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Trend Charts */}
      {trendData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Profit Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
                  <Legend />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Milk Production Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${formatNumber(Number(value))} L/day`} />
                  <Legend />
                  <Line type="monotone" dataKey="milk" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Cost Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {/* Monthly Snapshots */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Monthly Snapshots</h2>
        {data.history.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No snapshots saved yet</p>
              <p className="text-sm mt-1">Save your first monthly snapshot to track progress</p>
            </CardContent>
          </Card>
        ) : (
          data.history.slice().reverse().map((snapshot, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">{snapshot.month}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profit:</span>
                  <span className={snapshot.metrics.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(snapshot.metrics.profit, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Milk/Cow:</span>
                  <span>{formatNumber(snapshot.metrics.avgMilkPerCow)} L/day</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Lactating Cows:</span>
                  <span>{snapshot.herdData.lactatingCows}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
