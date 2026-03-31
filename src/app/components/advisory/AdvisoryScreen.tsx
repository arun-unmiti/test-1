import { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { calculateBaselineMetrics, calculateTargetMetrics, generateRecommendations, formatCurrency, formatNumber } from '../../utils/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { TrendingUp, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdvisoryScreen() {
  const { data, updateTarget } = useAppContext();
  const [milkIncrease, setMilkIncrease] = useState(data.target?.value.toString() || '10');
  const [showResults, setShowResults] = useState(false);

  const baseline = useMemo(() => {
    return calculateBaselineMetrics(
      data.herdData,
      data.milkData,
      data.feedItems,
      data.costs,
      data.otherRevenue
    );
  }, [data]);

  const target = useMemo(() => {
    return calculateTargetMetrics(
      baseline,
      data.herdData,
      data.milkData,
      data.feedItems,
      data.costs,
      data.otherRevenue,
      Number(milkIncrease)
    );
  }, [baseline, data, milkIncrease]);

  const recommendations = useMemo(() => {
    return generateRecommendations(baseline, target, data.herdData);
  }, [baseline, target, data.herdData]);

  const handleSetTarget = () => {
    updateTarget({
      type: 'milkIncrease',
      value: Number(milkIncrease),
    });
    setShowResults(true);
  };

  const comparisonData = [
    {
      name: 'Revenue',
      Current: baseline.totalRevenue,
      Target: target.totalRevenue,
    },
    {
      name: 'Cost',
      Current: baseline.totalCost,
      Target: target.totalCost,
    },
    {
      name: 'Profit',
      Current: baseline.profit,
      Target: target.profit,
    },
  ];

  const currency = data.farmSetup.currency;

  return (
    <div className="space-y-6 p-4 pb-24">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Advisory</h1>
        <p className="text-muted-foreground">Set targets and get recommendations</p>
      </div>

      {/* Target Setting */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Target className="h-5 w-5" />
            Set Your Target
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="milkIncrease" className="text-purple-900">
              Target Milk Production Increase (%)
            </Label>
            <Input
              id="milkIncrease"
              type="number"
              step="1"
              value={milkIncrease}
              onChange={(e) => setMilkIncrease(e.target.value)}
              min="0"
              max="100"
              className="bg-white"
            />
            <p className="text-sm text-purple-700">
              How much do you want to improve your milk production?
            </p>
          </div>

          <Button onClick={handleSetTarget} className="w-full">
            Calculate Impact
          </Button>
        </CardContent>
      </Card>

      {showResults && (
        <>
          {/* Current vs Target */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Current vs Target
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Milk/Cow</p>
                  <p className="text-2xl font-semibold">{formatNumber(baseline.avgMilkPerCow)} L</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Target Milk/Cow</p>
                  <p className="text-2xl font-semibold text-green-600">{formatNumber(target.avgMilkPerCow)} L</p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revenue Change:</span>
                  <span className="font-semibold text-green-600">
                    +{formatCurrency(target.totalRevenue - baseline.totalRevenue, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cost Change:</span>
                  <span className="font-semibold text-orange-600">
                    +{formatCurrency(target.totalCost - baseline.totalCost, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Profit Improvement:</span>
                  <span className="text-lg font-semibold text-green-600">
                    +{formatCurrency(target.profit - baseline.profit, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cost per Litre:</span>
                  <span className="font-semibold">
                    {formatCurrency(baseline.costPerLitre, currency)} <ArrowRight className="inline h-4 w-4" /> {formatCurrency(target.costPerLitre, currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Before vs After Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
                  <Legend />
                  <Bar dataKey="Current" fill="#94a3b8" />
                  <Bar dataKey="Target" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Lightbulb className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg space-y-2">
                    <h3 className="font-semibold text-amber-900">{rec.title}</h3>
                    <p className="text-sm text-amber-800">{rec.description}</p>
                    <div className="text-sm font-medium text-amber-900">
                      {rec.impact}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-amber-800">
                  Your farm is performing well! Keep monitoring your metrics.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
