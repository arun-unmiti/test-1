import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { DollarSign, Save } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

export function RevenueConfig() {
  const { data, updateMilkData, updateOtherRevenue } = useAppContext();
  const currency = data.farmSetup.currency;

  // Milk prices
  const [milkPriceCooperative, setMilkPriceCooperative] = useState(
    data.milkData.milkPriceCooperative || 0
  );
  const [milkPriceIndividuals, setMilkPriceIndividuals] = useState(
    data.milkData.milkPriceIndividuals || 0
  );
  const [milkPriceInstitutions, setMilkPriceInstitutions] = useState(
    data.milkData.milkPriceInstitutions || 0
  );

  // Manure
  const [manurePricePerKg, setManurePricePerKg] = useState(
    data.otherRevenue.manurePricePerKg || 0
  );
  const [manureKgPerCowPerDay, setManureKgPerCowPerDay] = useState(
    data.otherRevenue.manureKgPerCowPerDay || 0
  );

  // Bull Calves
  const [bullCalvesPerYear, setBullCalvesPerYear] = useState(
    data.otherRevenue.bullCalvesPerYear || 0
  );
  const [bullCalfPrice, setBullCalfPrice] = useState(
    data.otherRevenue.bullCalfPrice || 0
  );

  // Heifers
  const [heifersPerYear, setHeifersPerYear] = useState(
    data.otherRevenue.heifersPerYear || 0
  );
  const [heiferPrice, setHeiferPrice] = useState(
    data.otherRevenue.heiferPrice || 0
  );

  // Cows
  const [cowsPerYear, setCowsPerYear] = useState(
    data.otherRevenue.cowsPerYear || 0
  );
  const [cowPrice, setCowPrice] = useState(
    data.otherRevenue.cowPrice || 0
  );

  // Bulls
  const [bullsPerYear, setBullsPerYear] = useState(
    data.otherRevenue.bullsPerYear || 0
  );
  const [bullPrice, setBullPrice] = useState(
    data.otherRevenue.bullPrice || 0
  );

  // Calculate average milk price
  const avgMilkPrice = 
    (milkPriceCooperative + milkPriceIndividuals + milkPriceInstitutions) / 3;

  // Calculate annual revenue values
  const manureRevenue = manurePricePerKg * manureKgPerCowPerDay * data.herdData.lactatingCows * 365;
  const bullCalvesRevenue = bullCalvesPerYear * bullCalfPrice;
  const heifersRevenue = heifersPerYear * heiferPrice;
  const cowsRevenue = cowsPerYear * cowPrice;
  const bullsRevenue = bullsPerYear * bullPrice;

  const handleSave = () => {
    // Update milk data
    updateMilkData({
      ...data.milkData,
      milkPrice: avgMilkPrice,
      milkPriceCooperative,
      milkPriceIndividuals,
      milkPriceInstitutions,
    });

    // Update other revenue
    updateOtherRevenue({
      manure: manureRevenue,
      bullCalves: bullCalvesRevenue,
      heifers: heifersRevenue,
      cows: cowsRevenue,
      bulls: bullsRevenue,
      manurePricePerKg,
      manureKgPerCowPerDay,
      bullCalvesPerYear,
      bullCalfPrice,
      heifersPerYear,
      heiferPrice,
      cowsPerYear,
      cowPrice,
      bullsPerYear,
      bullPrice,
    });

    alert('Revenue assumptions saved successfully!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold">Revenue Assumptions</h2>
      </div>

      {/* Milk Prices */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Milk Prices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cooperative">Cooperative</Label>
            <Input
              id="cooperative"
              type="number"
              value={milkPriceCooperative}
              onChange={(e) => setMilkPriceCooperative(parseFloat(e.target.value) || 0)}
              placeholder="40.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="individuals">Individuals</Label>
            <Input
              id="individuals"
              type="number"
              value={milkPriceIndividuals}
              onChange={(e) => setMilkPriceIndividuals(parseFloat(e.target.value) || 0)}
              placeholder="50.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="institutions">Institutions/Schools/Hotels</Label>
            <Input
              id="institutions"
              type="number"
              value={milkPriceInstitutions}
              onChange={(e) => setMilkPriceInstitutions(parseFloat(e.target.value) || 0)}
              placeholder="60.00"
            />
          </div>
          <div className="pt-2 border-t bg-yellow-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Average Milk Price:</span>
              <span className="text-lg font-bold">{formatCurrency(avgMilkPrice, currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manure */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Manure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manurePrice">Price per kg</Label>
            <Input
              id="manurePrice"
              type="number"
              value={manurePricePerKg}
              onChange={(e) => setManurePricePerKg(parseFloat(e.target.value) || 0)}
              placeholder="2.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manureAmount">Amount of cowdung/cow/day (kg)</Label>
            <Input
              id="manureAmount"
              type="number"
              value={manureKgPerCowPerDay}
              onChange={(e) => setManureKgPerCowPerDay(parseFloat(e.target.value) || 0)}
              placeholder="5.00"
            />
          </div>
          <div className="pt-2 border-t flex justify-between text-sm">
            <span className="text-muted-foreground">Annual Revenue:</span>
            <span className="font-semibold">{formatCurrency(manureRevenue, currency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Sale of Bull Calves */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sale of Bull Calves</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bullCalvesNum">Number of bull calves sold per year</Label>
            <Input
              id="bullCalvesNum"
              type="number"
              value={bullCalvesPerYear}
              onChange={(e) => setBullCalvesPerYear(parseFloat(e.target.value) || 0)}
              placeholder="2.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bullCalfPrice">Price of bull calf in community</Label>
            <Input
              id="bullCalfPrice"
              type="number"
              value={bullCalfPrice}
              onChange={(e) => setBullCalfPrice(parseFloat(e.target.value) || 0)}
              placeholder="7000.00"
            />
          </div>
          <div className="pt-2 border-t flex justify-between text-sm">
            <span className="text-muted-foreground">Annual Revenue:</span>
            <span className="font-semibold">{formatCurrency(bullCalvesRevenue, currency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Sale of Heifers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sale of Heifers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heifersNum">Number of heifer sold per year</Label>
            <Input
              id="heifersNum"
              type="number"
              value={heifersPerYear}
              onChange={(e) => setHeifersPerYear(parseFloat(e.target.value) || 0)}
              placeholder="1.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heiferPrice">Price of incalf heifer in community</Label>
            <Input
              id="heiferPrice"
              type="number"
              value={heiferPrice}
              onChange={(e) => setHeiferPrice(parseFloat(e.target.value) || 0)}
              placeholder="80000.00"
            />
          </div>
          <div className="pt-2 border-t flex justify-between text-sm">
            <span className="text-muted-foreground">Annual Revenue:</span>
            <span className="font-semibold">{formatCurrency(heifersRevenue, currency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Sale of Cows */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sale of Cows</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cowsNum">Number of cows sold per year</Label>
            <Input
              id="cowsNum"
              type="number"
              value={cowsPerYear}
              onChange={(e) => setCowsPerYear(parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cowPrice">Price of cow in community</Label>
            <Input
              id="cowPrice"
              type="number"
              value={cowPrice}
              onChange={(e) => setCowPrice(parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="pt-2 border-t flex justify-between text-sm">
            <span className="text-muted-foreground">Annual Revenue:</span>
            <span className="font-semibold">{formatCurrency(cowsRevenue, currency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Sale of Bulls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sale of Bulls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bullsNum">Number of bulls sold per year</Label>
            <Input
              id="bullsNum"
              type="number"
              value={bullsPerYear}
              onChange={(e) => setBullsPerYear(parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bullPrice">Price of bull in community</Label>
            <Input
              id="bullPrice"
              type="number"
              value={bullPrice}
              onChange={(e) => setBullPrice(parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="pt-2 border-t flex justify-between text-sm">
            <span className="text-muted-foreground">Annual Revenue:</span>
            <span className="font-semibold">{formatCurrency(bullsRevenue, currency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-5 w-5 mr-2" />
        Save Revenue Assumptions
      </Button>

      {/* Total Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Milk Revenue (Annual):</span>
            <span className="font-medium">
              {formatCurrency(avgMilkPrice * data.milkData.avgMilkPerCow * data.herdData.lactatingCows * 365, currency)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Other Revenue (Annual):</span>
            <span className="font-medium">
              {formatCurrency(manureRevenue + bullCalvesRevenue + heifersRevenue + cowsRevenue + bullsRevenue, currency)}
            </span>
          </div>
          <div className="pt-2 border-t border-green-300 flex justify-between items-center">
            <span className="text-lg font-semibold text-green-900">Total Annual Revenue:</span>
            <span className="text-2xl font-bold text-green-700">
              {formatCurrency(
                avgMilkPrice * data.milkData.avgMilkPerCow * data.herdData.lactatingCows * 365 +
                manureRevenue + bullCalvesRevenue + heifersRevenue + cowsRevenue + bullsRevenue,
                currency
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
