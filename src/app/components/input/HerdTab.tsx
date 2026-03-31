import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

export function HerdTab() {
  const { data, updateHerdData } = useAppContext();
  const [totalAnimals, setTotalAnimals] = useState(data.herdData.totalAnimals.toString());
  const [lactatingCows, setLactatingCows] = useState(data.herdData.lactatingCows.toString());
  const [heifers, setHeifers] = useState(data.herdData.heifers.toString());
  const [lactatingPercentage, setLactatingPercentage] = useState(
    data.herdData.totalAnimals > 0 
      ? Math.round((data.herdData.lactatingCows / data.herdData.totalAnimals) * 100)
      : 50
  );

  const handleSave = () => {
    updateHerdData({
      totalAnimals: Number(totalAnimals),
      lactatingCows: Number(lactatingCows),
      heifers: Number(heifers),
    });
  };

  const handlePercentageChange = (value: number[]) => {
    const percentage = value[0];
    setLactatingPercentage(percentage);
    const total = Number(totalAnimals);
    if (total > 0) {
      const newLactating = Math.round((total * percentage) / 100);
      setLactatingCows(newLactating.toString());
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Herd Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totalAnimals">Total Animals</Label>
            <Input
              id="totalAnimals"
              type="number"
              value={totalAnimals}
              onChange={(e) => setTotalAnimals(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lactatingCows">Lactating Cows</Label>
            <Input
              id="lactatingCows"
              type="number"
              value={lactatingCows}
              onChange={(e) => setLactatingCows(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Lactating Percentage: {lactatingPercentage}%</Label>
            <Slider
              value={[lactatingPercentage]}
              onValueChange={handlePercentageChange}
              min={0}
              max={100}
              step={1}
            />
            <p className="text-sm text-muted-foreground">
              Adjust the slider to set the percentage of lactating cows
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heifers">Heifers</Label>
            <Input
              id="heifers"
              type="number"
              value={heifers}
              onChange={(e) => setHeifers(e.target.value)}
              min="0"
            />
            <p className="text-sm text-muted-foreground">
              Young female cattle that have not yet calved
            </p>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
