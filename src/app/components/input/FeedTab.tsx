import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { FeedItem } from '../../types';
import { formatCurrency } from '../../utils/calculations';

export function FeedTab() {
  const { data, updateFeedItems } = useAppContext();
  const [feedItems, setFeedItems] = useState<FeedItem[]>(data.feedItems);

  const addFeedItem = () => {
    const newItem: FeedItem = {
      id: Date.now().toString(),
      type: '',
      quantityPerCow: 0,
      pricePerKg: 0,
    };
    setFeedItems([...feedItems, newItem]);
  };

  const removeFeedItem = (id: string) => {
    setFeedItems(feedItems.filter(item => item.id !== id));
  };

  const updateFeedItem = (id: string, field: keyof FeedItem, value: string | number) => {
    setFeedItems(feedItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    updateFeedItems(feedItems);
  };

  const totalFeedCostPerCow = feedItems.reduce(
    (sum, item) => sum + (item.quantityPerCow * item.pricePerKg),
    0
  );
  const totalFeedCostPerDay = totalFeedCostPerCow * data.herdData.lactatingCows;
  const totalFeedCostPerYear = totalFeedCostPerDay * 365;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Feed Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedItems.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Feed Item</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeedItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Feed Type</Label>
                <Input
                  placeholder="e.g., Green Fodder, Concentrate"
                  value={item.type}
                  onChange={(e) => updateFeedItem(item.id, 'type', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Quantity per Cow ({data.farmSetup.units}/day)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={item.quantityPerCow}
                  onChange={(e) => updateFeedItem(item.id, 'quantityPerCow', Number(e.target.value))}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Price per {data.farmSetup.units} ({data.farmSetup.currency})</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.pricePerKg}
                  onChange={(e) => updateFeedItem(item.id, 'pricePerKg', Number(e.target.value))}
                  min="0"
                />
              </div>

              <div className="pt-2 text-sm text-muted-foreground">
                Cost per cow/day: {formatCurrency(item.quantityPerCow * item.pricePerKg, data.farmSetup.currency)}
              </div>
            </div>
          ))}

          <Button onClick={addFeedItem} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Feed Item
          </Button>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900">Total Feed Cost</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-orange-900">Per Cow per Day:</span>
            <span className="font-semibold text-orange-900">
              {formatCurrency(totalFeedCostPerCow, data.farmSetup.currency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-orange-900">Total per Day:</span>
            <span className="font-semibold text-orange-900">
              {formatCurrency(totalFeedCostPerDay, data.farmSetup.currency)}
            </span>
          </div>
          <div className="pt-3 border-t border-orange-300">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">Annual Feed Cost:</span>
              <span className="text-lg font-semibold text-orange-900">
                {formatCurrency(totalFeedCostPerYear, data.farmSetup.currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
