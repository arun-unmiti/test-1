import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

export function OtherRevenueTab() {
  const { data, updateOtherRevenue } = useAppContext();
  const [manure, setManure] = useState(data.otherRevenue.manure.toString());
  const [bullCalves, setBullCalves] = useState(data.otherRevenue.bullCalves.toString());
  const [heifers, setHeifers] = useState(data.otherRevenue.heifers.toString());
  const [cows, setCows] = useState(data.otherRevenue.cows.toString());
  const [bulls, setBulls] = useState(data.otherRevenue.bulls.toString());

  const handleSave = () => {
    updateOtherRevenue({
      manure: Number(manure),
      bullCalves: Number(bullCalves),
      heifers: Number(heifers),
      cows: Number(cows),
      bulls: Number(bulls),
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Other Revenue Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manure">Manure Sales ({data.farmSetup.currency}/year)</Label>
            <Input
              id="manure"
              type="number"
              value={manure}
              onChange={(e) => setManure(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bullCalves">Bull Calves Sales ({data.farmSetup.currency}/year)</Label>
            <Input
              id="bullCalves"
              type="number"
              value={bullCalves}
              onChange={(e) => setBullCalves(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heifers">Heifer Sales ({data.farmSetup.currency}/year)</Label>
            <Input
              id="heifers"
              type="number"
              value={heifers}
              onChange={(e) => setHeifers(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cows">Cow Sales ({data.farmSetup.currency}/year)</Label>
            <Input
              id="cows"
              type="number"
              value={cows}
              onChange={(e) => setCows(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulls">Bull Sales ({data.farmSetup.currency}/year)</Label>
            <Input
              id="bulls"
              type="number"
              value={bulls}
              onChange={(e) => setBulls(e.target.value)}
              min="0"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
