import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import { DollarSign } from 'lucide-react';

export function RevenuePriceList() {
  const { data } = useAppContext();
  const currency = data.farmSetup.currency;

  const totalMilkPerYear = data.herdData.lactatingCows * data.milkData.avgMilkPerCow * 365;
  const milkRevenue = totalMilkPerYear * data.milkData.milkPrice;

  const totalOtherRevenue =
    data.otherRevenue.manure +
    data.otherRevenue.bullCalves +
    data.otherRevenue.heifers +
    data.otherRevenue.cows +
    data.otherRevenue.bulls;

  const totalRevenue = milkRevenue + totalOtherRevenue;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold">Revenue Price List</h2>
      </div>

      {/* Milk Revenue */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Milk Sales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price per Litre:</span>
            <span className="font-medium">{formatCurrency(data.milkData.milkPrice, currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Annual Production:</span>
            <span className="font-medium">{formatNumber(totalMilkPerYear)} L</span>
          </div>
          <div className="pt-2 border-t flex justify-between">
            <span className="font-medium">Total Milk Revenue:</span>
            <span className="font-semibold text-green-600">{formatCurrency(milkRevenue, currency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Other Revenue */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Other Revenue Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Manure Sales:</span>
            <span className="font-medium">{formatCurrency(data.otherRevenue.manure, currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Bull Calves:</span>
            <span className="font-medium">{formatCurrency(data.otherRevenue.bullCalves, currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Heifer Sales:</span>
            <span className="font-medium">{formatCurrency(data.otherRevenue.heifers, currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cow Sales:</span>
            <span className="font-medium">{formatCurrency(data.otherRevenue.cows, currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Bull Sales:</span>
            <span className="font-medium">{formatCurrency(data.otherRevenue.bulls, currency)}</span>
          </div>
          <div className="pt-2 border-t flex justify-between">
            <span className="font-medium">Total Other Revenue:</span>
            <span className="font-semibold text-green-600">{formatCurrency(totalOtherRevenue, currency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-green-900">Total Annual Revenue:</span>
            <span className="text-2xl font-bold text-green-700">{formatCurrency(totalRevenue, currency)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
