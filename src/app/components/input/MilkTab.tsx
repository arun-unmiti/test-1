import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { formatCurrency, formatNumber } from '../../utils/calculations';

export function MilkTab() {
  const { data, updateMilkData } = useAppContext();
  const [avgMilkPerCow, setAvgMilkPerCow] = useState(data.milkData.avgMilkPerCow.toString());
  const [milkPrice, setMilkPrice] = useState(data.milkData.milkPrice.toString());

  const totalMilkPerDay = data.herdData.lactatingCows * Number(avgMilkPerCow);
  const totalMilkPerMonth = totalMilkPerDay * 30;
  const totalMilkPerYear = totalMilkPerDay * 365;

  const handleSave = () => {
    updateMilkData({
      avgMilkPerCow: Number(avgMilkPerCow),
      milkPrice: Number(milkPrice),
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Milk Production</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avgMilkPerCow">Average Milk per Cow (litres/day)</Label>
            <Input
              id="avgMilkPerCow"
              type="number"
              step="0.1"
              value={avgMilkPerCow}
              onChange={(e) => setAvgMilkPerCow(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="milkPrice">Milk Price ({data.farmSetup.currency}/litre)</Label>
            <Input
              id="milkPrice"
              type="number"
              step="0.01"
              value={milkPrice}
              onChange={(e) => setMilkPrice(e.target.value)}
              min="0"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Calculated Production</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-900">Total Milk per Day:</span>
            <span className="font-semibold text-blue-900">{formatNumber(totalMilkPerDay)} L</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-900">Total Milk per Month:</span>
            <span className="font-semibold text-blue-900">{formatNumber(totalMilkPerMonth)} L</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-900">Total Milk per Year:</span>
            <span className="font-semibold text-blue-900">{formatNumber(totalMilkPerYear)} L</span>
          </div>
          <div className="pt-3 border-t border-blue-300">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-900">Annual Milk Revenue:</span>
              <span className="text-lg font-semibold text-blue-900">
                {formatCurrency(totalMilkPerYear * Number(milkPrice), data.farmSetup.currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
