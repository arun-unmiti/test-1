import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { HerdData } from '../../types';

interface HerdOverviewProps {
  onComplete: (herd: HerdData) => void;
}

export function HerdOverview({ onComplete }: HerdOverviewProps) {
  const [totalAnimals, setTotalAnimals] = useState('');
  const [lactatingCows, setLactatingCows] = useState('');
  const [heifers, setHeifers] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      totalAnimals: Number(totalAnimals),
      lactatingCows: Number(lactatingCows),
      heifers: Number(heifers),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Herd Overview</CardTitle>
          <CardDescription>Enter basic information about your herd</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totalAnimals">Total Animals</Label>
              <Input
                id="totalAnimals"
                type="number"
                placeholder="0"
                value={totalAnimals}
                onChange={(e) => setTotalAnimals(e.target.value)}
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lactatingCows">Lactating Cows</Label>
              <Input
                id="lactatingCows"
                type="number"
                placeholder="0"
                value={lactatingCows}
                onChange={(e) => setLactatingCows(e.target.value)}
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heifers">Heifers</Label>
              <Input
                id="heifers"
                type="number"
                placeholder="0"
                value={heifers}
                onChange={(e) => setHeifers(e.target.value)}
                required
                min="0"
              />
              <p className="text-sm text-muted-foreground">
                Young female cattle that have not yet calved
              </p>
            </div>

            <Button type="submit" className="w-full">
              Complete Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
