import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import { Coins } from 'lucide-react';

export function CostPriceList() {
  const { data } = useAppContext();
  const currency = data.farmSetup.currency;

  // Feed calculations
  const feedCostPerCowPerDay = data.feedItems.reduce(
    (sum, item) => sum + item.quantityPerCow * item.pricePerKg,
    0
  );
  const totalFeedCostPerYear = feedCostPerCowPerDay * data.herdData.lactatingCows * 365;

  // Total costs
  const totalCost = totalFeedCostPerYear + data.costs.labor + data.costs.breeding + data.costs.health;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-6 w-6 text-orange-600" />
        <h2 className="text-xl font-semibold">Cost Price List</h2>
      </div>

      {/* Feed Costs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Feed Costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.feedItems.length > 0 ? (
            data.feedItems.map((item, index) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">{item.type || `Feed Item ${index + 1}`}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity per Cow:</span>
                    <span className="font-medium">{formatNumber(item.quantityPerCow)} {data.farmSetup.units}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per {data.farmSetup.units}:</span>
                    <span className="font-medium">{formatCurrency(item.pricePerKg, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Price (bag):</span>
                    <span className="font-medium">
                      50kg: {formatCurrency(item.pricePerKg * 50, currency)} | 
                      70kg: {formatCurrency(item.pricePerKg * 70, currency)}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-gray-200 flex justify-between">
                    <span className="text-muted-foreground">Cost per Cow/Day:</span>
                    <span className="font-semibold">{formatCurrency(item.quantityPerCow * item.pricePerKg, currency)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No feed items added yet</p>
          )}
          <div className="pt-2 border-t flex justify-between">
            <span className="font-medium">Total Annual Feed Cost:</span>
            <span className="font-semibold text-orange-600">{formatCurrency(totalFeedCostPerYear, currency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Breeding Costs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Breeding Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Annual Breeding Cost:</span>
            <span className="font-semibold text-orange-600">{formatCurrency(data.costs.breeding, currency)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Includes artificial insemination and breeding management
          </p>
        </CardContent>
      </Card>

      {/* Health Costs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Herd Health Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Annual Health Cost:</span>
            <span className="font-semibold text-orange-600">{formatCurrency(data.costs.health, currency)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Includes veterinary, medicines, and vaccinations
          </p>
        </CardContent>
      </Card>

      {/* Labor Costs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Labor Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Annual Labor Cost:</span>
            <span className="font-semibold text-orange-600">{formatCurrency(data.costs.labor, currency)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Total cost for farm labor and staff
          </p>
        </CardContent>
      </Card>

      {/* Total Cost */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-orange-900">Total Annual Cost:</span>
            <span className="text-2xl font-bold text-orange-700">{formatCurrency(totalCost, currency)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
