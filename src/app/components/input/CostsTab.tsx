import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

export function CostsTab() {
  const { data, updateCosts } = useAppContext();
  const [labor, setLabor] = useState(data.costs.labor.toString());
  const [breeding, setBreeding] = useState(data.costs.breeding.toString());
  const [health, setHealth] = useState(data.costs.health.toString());

  const handleSave = () => {
    updateCosts({
      labor: Number(labor),
      breeding: Number(breeding),
      health: Number(health),
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Annual Costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="labor">Labor Cost ({data.farmSetup.currency}/year)</Label>
            <Input
              id="labor"
              type="number"
              value={labor}
              onChange={(e) => setLabor(e.target.value)}
              min="0"
            />
            <p className="text-sm text-muted-foreground">
              Total annual cost for farm labor
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="breeding">Breeding Cost ({data.farmSetup.currency}/year)</Label>
            <Input
              id="breeding"
              type="number"
              value={breeding}
              onChange={(e) => setBreeding(e.target.value)}
              min="0"
            />
            <p className="text-sm text-muted-foreground">
              Artificial insemination, breeding management
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="health">Herd Health Cost ({data.farmSetup.currency}/year)</Label>
            <Input
              id="health"
              type="number"
              value={health}
              onChange={(e) => setHealth(e.target.value)}
              min="0"
            />
            <p className="text-sm text-muted-foreground">
              Veterinary, medicines, vaccinations
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
