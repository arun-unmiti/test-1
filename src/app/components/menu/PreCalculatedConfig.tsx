import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Calculator, Save } from 'lucide-react';
import { PreCalculatedParams } from '../../types';

export function PreCalculatedConfig() {
  const { data, updatePreCalculatedParams } = useAppContext();
  const params = data.preCalculatedParams || {
    daysInYear: 365,
    monthsInYear: 12,
    weeksInYear: 52,
    recommendedLactatingPercentage: 75,
    recommendedMilkYieldIncrease: 10,
    daysOpen: 90,
    gestationPeriod: 283,
    recommendedCalvingInterval: 365,
    lengthOfDryingPeriod: 60,
    cowWeightAdjustmentFactor: 4.47,
    cowWeightLessConstant: 393.13,
    heiferWeightAdjustmentFactor: 4.31,
    heiferWeightLessConstant: 284.31,
    amountOfCowdungPerCowPerDay: 20,
    concentrateLessThan7Litres: 0,
    concentrate7To10Litres: 2,
    concentrate10To13Litres: 3,
    concentrate13To16Litres: 4,
    concentrate16To20Litres: 5,
    concentrateAbove20Litres: 6,
    forageCombination1: 'chopped hay, silage',
    forageCombination2: 'chopped hay, Nappier grass',
    forageCombination3: 'chopped hay, legume',
    forageCombination4: 'Nappier grass/brachiaria, legume',
    recommendedHealthVisitsPerYear: 4,
    recommendedDewormingFrequencyPerYear: 4,
    recommendedTickControlFrequencyPerWeek: 2,
    totalMilkFedToCalves: 300,
    numberOfMilkFeedingDays: 90,
    recommendedAIServicesPerConception: 3,
    insurancePremium: 0,
    costOfTransportPerLitre: 0,
  };

  const [formData, setFormData] = useState<PreCalculatedParams>(params);

  const handleChange = (field: keyof PreCalculatedParams, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : value,
    }));
  };

  const handleSave = () => {
    updatePreCalculatedParams(formData);
    alert('Pre-calculated parameters saved successfully!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Pre-Calculated Parameters</h2>
      </div>

      {/* Reference Financial Period */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Reference Financial Period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Days in a year</Label>
            <Input
              type="number"
              value={formData.daysInYear}
              onChange={(e) => handleChange('daysInYear', parseFloat(e.target.value) || 0)}
              placeholder="365"
            />
          </div>
          <div className="space-y-2">
            <Label>Months in a year</Label>
            <Input
              type="number"
              value={formData.monthsInYear}
              onChange={(e) => handleChange('monthsInYear', parseFloat(e.target.value) || 0)}
              placeholder="12"
            />
          </div>
          <div className="space-y-2">
            <Label>Weeks in a year</Label>
            <Input
              type="number"
              value={formData.weeksInYear}
              onChange={(e) => handleChange('weeksInYear', parseFloat(e.target.value) || 0)}
              placeholder="52"
            />
          </div>
        </CardContent>
      </Card>

      {/* Herd Management */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Herd Management Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Recommended % lactating herd</Label>
            <Input
              type="number"
              value={formData.recommendedLactatingPercentage}
              onChange={(e) => handleChange('recommendedLactatingPercentage', parseFloat(e.target.value) || 0)}
              placeholder="75"
            />
          </div>
          <div className="space-y-2">
            <Label>Recommended increase in target milk yield for new lactating herd (%)</Label>
            <Input
              type="number"
              value={formData.recommendedMilkYieldIncrease}
              onChange={(e) => handleChange('recommendedMilkYieldIncrease', parseFloat(e.target.value) || 0)}
              placeholder="10"
            />
          </div>
          <div className="space-y-2">
            <Label>Days open</Label>
            <Input
              type="number"
              value={formData.daysOpen}
              onChange={(e) => handleChange('daysOpen', parseFloat(e.target.value) || 0)}
              placeholder="90"
            />
          </div>
          <div className="space-y-2">
            <Label>Gestation period (days)</Label>
            <Input
              type="number"
              value={formData.gestationPeriod}
              onChange={(e) => handleChange('gestationPeriod', parseFloat(e.target.value) || 0)}
              placeholder="283"
            />
          </div>
          <div className="space-y-2">
            <Label>Recommended calving interval (days)</Label>
            <Input
              type="number"
              value={formData.recommendedCalvingInterval}
              onChange={(e) => handleChange('recommendedCalvingInterval', parseFloat(e.target.value) || 0)}
              placeholder="365"
            />
          </div>
          <div className="space-y-2">
            <Label>Length of drying period (days)</Label>
            <Input
              type="number"
              value={formData.lengthOfDryingPeriod}
              onChange={(e) => handleChange('lengthOfDryingPeriod', parseFloat(e.target.value) || 0)}
              placeholder="60"
            />
          </div>
        </CardContent>
      </Card>

      {/* Weight Approximations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Weight Approximation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="font-semibold text-sm mb-2">Cow Weight</div>
          <div className="space-y-2">
            <Label>Adjustment factor</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.cowWeightAdjustmentFactor}
              onChange={(e) => handleChange('cowWeightAdjustmentFactor', parseFloat(e.target.value) || 0)}
              placeholder="4.47"
            />
          </div>
          <div className="space-y-2">
            <Label>Less constant</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.cowWeightLessConstant}
              onChange={(e) => handleChange('cowWeightLessConstant', parseFloat(e.target.value) || 0)}
              placeholder="393.13"
            />
          </div>
          
          <div className="font-semibold text-sm mb-2 mt-4 pt-4 border-t">Heifer Weight</div>
          <div className="space-y-2">
            <Label>Adjustment factor</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.heiferWeightAdjustmentFactor}
              onChange={(e) => handleChange('heiferWeightAdjustmentFactor', parseFloat(e.target.value) || 0)}
              placeholder="4.31"
            />
          </div>
          <div className="space-y-2">
            <Label>Less constant</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.heiferWeightLessConstant}
              onChange={(e) => handleChange('heiferWeightLessConstant', parseFloat(e.target.value) || 0)}
              placeholder="284.31"
            />
          </div>
        </CardContent>
      </Card>

      {/* Manure */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Manure Production</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Amount of cowdung/cow/day (kg)</Label>
            <Input
              type="number"
              value={formData.amountOfCowdungPerCowPerDay}
              onChange={(e) => handleChange('amountOfCowdungPerCowPerDay', parseFloat(e.target.value) || 0)}
              placeholder="20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Concentrate Feeding */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recommended Concentrate Feeding (kg)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>&lt;7 litres</Label>
            <Input
              type="number"
              value={formData.concentrateLessThan7Litres}
              onChange={(e) => handleChange('concentrateLessThan7Litres', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>7-10 litres</Label>
            <Input
              type="number"
              value={formData.concentrate7To10Litres}
              onChange={(e) => handleChange('concentrate7To10Litres', parseFloat(e.target.value) || 0)}
              placeholder="2"
            />
          </div>
          <div className="space-y-2">
            <Label>10-13 litres</Label>
            <Input
              type="number"
              value={formData.concentrate10To13Litres}
              onChange={(e) => handleChange('concentrate10To13Litres', parseFloat(e.target.value) || 0)}
              placeholder="3"
            />
          </div>
          <div className="space-y-2">
            <Label>13-16 litres</Label>
            <Input
              type="number"
              value={formData.concentrate13To16Litres}
              onChange={(e) => handleChange('concentrate13To16Litres', parseFloat(e.target.value) || 0)}
              placeholder="4"
            />
          </div>
          <div className="space-y-2">
            <Label>16-20 litres</Label>
            <Input
              type="number"
              value={formData.concentrate16To20Litres}
              onChange={(e) => handleChange('concentrate16To20Litres', parseFloat(e.target.value) || 0)}
              placeholder="5"
            />
          </div>
          <div className="space-y-2">
            <Label>&gt;20 litres</Label>
            <Input
              type="number"
              value={formData.concentrateAbove20Litres}
              onChange={(e) => handleChange('concentrateAbove20Litres', parseFloat(e.target.value) || 0)}
              placeholder="6"
            />
          </div>
        </CardContent>
      </Card>

      {/* Forage Combinations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recommended Forage Combinations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>1. Chopped hay + silage</Label>
            <Input
              type="text"
              value={formData.forageCombination1}
              onChange={(e) => handleChange('forageCombination1', e.target.value)}
              placeholder="chopped hay, silage"
            />
          </div>
          <div className="space-y-2">
            <Label>2. Chopped hay + Nappier grass</Label>
            <Input
              type="text"
              value={formData.forageCombination2}
              onChange={(e) => handleChange('forageCombination2', e.target.value)}
              placeholder="chopped hay, Nappier grass"
            />
          </div>
          <div className="space-y-2">
            <Label>3. Chopped hay + legume</Label>
            <Input
              type="text"
              value={formData.forageCombination3}
              onChange={(e) => handleChange('forageCombination3', e.target.value)}
              placeholder="chopped hay, legume"
            />
          </div>
          <div className="space-y-2">
            <Label>4. Napier grass/brachiaria + legume</Label>
            <Input
              type="text"
              value={formData.forageCombination4}
              onChange={(e) => handleChange('forageCombination4', e.target.value)}
              placeholder="Nappier grass/brachiaria, legume"
            />
          </div>
        </CardContent>
      </Card>

      {/* Health Management */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Health Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Recommended frequency of routine herd health visits/year</Label>
            <Input
              type="number"
              value={formData.recommendedHealthVisitsPerYear}
              onChange={(e) => handleChange('recommendedHealthVisitsPerYear', parseFloat(e.target.value) || 0)}
              placeholder="4"
            />
          </div>
          <div className="space-y-2">
            <Label>Recommended deworming frequency/year</Label>
            <Input
              type="number"
              value={formData.recommendedDewormingFrequencyPerYear}
              onChange={(e) => handleChange('recommendedDewormingFrequencyPerYear', parseFloat(e.target.value) || 0)}
              placeholder="4"
            />
          </div>
          <div className="space-y-2">
            <Label>Recommended tick control frequency/week</Label>
            <Input
              type="number"
              value={formData.recommendedTickControlFrequencyPerWeek}
              onChange={(e) => handleChange('recommendedTickControlFrequencyPerWeek', parseFloat(e.target.value) || 0)}
              placeholder="2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Calf Feeding */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Calf Feeding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Total milk fed (litres)</Label>
            <Input
              type="number"
              value={formData.totalMilkFedToCalves}
              onChange={(e) => handleChange('totalMilkFedToCalves', parseFloat(e.target.value) || 0)}
              placeholder="300"
            />
          </div>
          <div className="space-y-2">
            <Label>Number of milk feeding days</Label>
            <Input
              type="number"
              value={formData.numberOfMilkFeedingDays}
              onChange={(e) => handleChange('numberOfMilkFeedingDays', parseFloat(e.target.value) || 0)}
              placeholder="90"
            />
          </div>
        </CardContent>
      </Card>

      {/* Other Costs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Other Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Recommended # of AI services per conception</Label>
            <Input
              type="number"
              value={formData.recommendedAIServicesPerConception}
              onChange={(e) => handleChange('recommendedAIServicesPerConception', parseFloat(e.target.value) || 0)}
              placeholder="3"
            />
          </div>
          <div className="space-y-2">
            <Label>Insurance premium (annual)</Label>
            <Input
              type="number"
              value={formData.insurancePremium}
              onChange={(e) => handleChange('insurancePremium', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Cost of transport ({data.farmSetup.currency}/litre of milk)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.costOfTransportPerLitre}
              onChange={(e) => handleChange('costOfTransportPerLitre', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-5 w-5 mr-2" />
        Save Parameters
      </Button>
    </div>
  );
}
