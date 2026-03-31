import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Coins, Save, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { FeedItem } from '../../types';

export function CostConfig() {
  const { data, updateFeedItems, updateCosts } = useAppContext();
  const currency = data.farmSetup.currency;

  // Feed state
  const [feedItems, setFeedItems] = useState<FeedItem[]>(data.feedItems);

  // Breeding state
  const [numberOfAIServices, setNumberOfAIServices] = useState(
    data.costs.numberOfAIServices || 3
  );
  const [costPerAIService, setCostPerAIService] = useState(
    data.costs.costPerAIService || 1000
  );
  const [costOfPregnancyDiagnosis, setCostOfPregnancyDiagnosis] = useState(
    data.costs.costOfPregnancyDiagnosis || 500
  );
  const [numberOfCowsDiagnosed, setNumberOfCowsDiagnosed] = useState(
    data.costs.numberOfCowsDiagnosedForPregnancy || 1
  );
  const [calfFeedingMilk, setCalfFeedingMilk] = useState(
    data.costs.calfFeedingMilk || 0
  );
  const [calfFeedingMilkReplacer, setCalfFeedingMilkReplacer] = useState(
    data.costs.calfFeedingMilkReplacer || 0
  );
  const [calfFeedingPellet, setCalfFeedingPellet] = useState(
    data.costs.calfFeedingPellet || 0
  );

  // Labor state
  const [numberOfWorkers, setNumberOfWorkers] = useState(
    data.costs.numberOfWorkers || 1
  );
  const [monthlyWageEmployee, setMonthlyWageEmployee] = useState(
    data.costs.monthlyWageRateEmployee || 5000
  );
  const [numberOfManagers, setNumberOfManagers] = useState(
    data.costs.numberOfManagers || 0
  );
  const [monthlyWageManager, setMonthlyWageManager] = useState(
    data.costs.monthlyWageRateManager || 10000
  );

  const feedOptions = [
    'Commercial concentrate',
    'Bran',
    'Germ',
    'Cotton seed cake',
    'Other ingredients',
    'Mineral lick',
    'Mineral powder',
    'Hay',
    'Silage',
    'Nappier grass',
    'Brachiaria',
    'Rhodes grass',
    'Desmodium',
    'Other legume fodder',
    'Dry matter'
  ];

  const handleAddFeed = () => {
    const newFeed: FeedItem = {
      id: Date.now().toString(),
      type: 'Commercial concentrate',
      quantityPerCow: 0,
      pricePerKg: 0,
      saleUnit: '50kg',
      totalPrice: 0,
      currentAmountFedPerCow: 0,
    };
    setFeedItems([...feedItems, newFeed]);
  };

  const handleRemoveFeed = (id: string) => {
    setFeedItems(feedItems.filter(item => item.id !== id));
  };

  const handleUpdateFeed = (id: string, updates: Partial<FeedItem>) => {
    setFeedItems(feedItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const calculatePricePerKg = (item: FeedItem) => {
    if (!item.totalPrice || !item.saleUnit) return 0;
    
    const unitSize = item.saleUnit === '50kg' ? 50 
      : item.saleUnit === '70kg' ? 70
      : item.saleUnit === '2kg' ? 2
      : item.saleUnit === '5kg' ? 5
      : 1;
    
    return item.totalPrice / unitSize;
  };

  const handleSave = () => {
    // Calculate feed costs
    const totalFeedCostPerYear = feedItems.reduce((sum, item) => {
      const amountPerCow = item.currentAmountFedPerCow || item.quantityPerCow || 0;
      const pricePerKg = item.pricePerKg || calculatePricePerKg(item);
      return sum + (amountPerCow * pricePerKg * data.herdData.lactatingCows * 365);
    }, 0);

    // Calculate breeding costs
    const totalBreedingCost = 
      (numberOfAIServices * costPerAIService * data.herdData.lactatingCows) +
      (costOfPregnancyDiagnosis * numberOfCowsDiagnosed) +
      calfFeedingMilk +
      calfFeedingMilkReplacer +
      calfFeedingPellet;

    // Calculate labor costs
    const totalLaborCost = 
      (numberOfWorkers * monthlyWageEmployee * 12) +
      (numberOfManagers * monthlyWageManager * 12);

    // Update feed items with calculated price per kg
    const updatedFeedItems = feedItems.map(item => ({
      ...item,
      pricePerKg: item.pricePerKg || calculatePricePerKg(item),
      quantityPerCow: item.currentAmountFedPerCow || item.quantityPerCow || 0,
    }));

    updateFeedItems(updatedFeedItems);

    updateCosts({
      ...data.costs,
      breeding: totalBreedingCost,
      labor: totalLaborCost,
      numberOfAIServices,
      costPerAIService,
      costOfPregnancyDiagnosis,
      numberOfCowsDiagnosedForPregnancy: numberOfCowsDiagnosed,
      calfFeedingMilk,
      calfFeedingMilkReplacer,
      calfFeedingPellet,
      numberOfWorkers,
      monthlyWageRateEmployee: monthlyWageEmployee,
      numberOfManagers,
      monthlyWageRateManager: monthlyWageManager,
    });

    alert('Cost assumptions saved successfully!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-6 w-6 text-orange-600" />
        <h2 className="text-xl font-semibold">Cost Assumptions</h2>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="breeding">Breeding</TabsTrigger>
          <TabsTrigger value="labor">Labor</TabsTrigger>
        </TabsList>

        {/* FEED TAB */}
        <TabsContent value="feed" className="space-y-4 mt-4">
          {feedItems.map((item, index) => (
            <Card key={item.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Feed Item {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFeed(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Feed Name</Label>
                  <Select
                    value={item.type}
                    onValueChange={(value) => handleUpdateFeed(item.id, { type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select feed type" />
                    </SelectTrigger>
                    <SelectContent>
                      {feedOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sale Unit</Label>
                    <Select
                      value={item.saleUnit || '50kg'}
                      onValueChange={(value: any) => handleUpdateFeed(item.id, { saleUnit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50kg">50kg</SelectItem>
                        <SelectItem value="70kg">70kg</SelectItem>
                        <SelectItem value="2kg">2kg</SelectItem>
                        <SelectItem value="5kg">5kg</SelectItem>
                        <SelectItem value="bale">Bale</SelectItem>
                        <SelectItem value="bundle">Bundle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Total Price</Label>
                    <Input
                      type="number"
                      value={item.totalPrice || 0}
                      onChange={(e) => {
                        const totalPrice = parseFloat(e.target.value) || 0;
                        const pricePerKg = calculatePricePerKg({ ...item, totalPrice });
                        handleUpdateFeed(item.id, { totalPrice, pricePerKg });
                      }}
                      placeholder="2600"
                    />
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">Price per kg:</span>
                    <span className="text-lg font-bold text-yellow-900">
                      {formatCurrency(item.pricePerKg || calculatePricePerKg(item), currency)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current amount fed (kg/cow/day)</Label>
                  <Input
                    type="number"
                    value={item.currentAmountFedPerCow || item.quantityPerCow || 0}
                    onChange={(e) => handleUpdateFeed(item.id, { 
                      currentAmountFedPerCow: parseFloat(e.target.value) || 0,
                      quantityPerCow: parseFloat(e.target.value) || 0
                    })}
                    placeholder="3"
                  />
                </div>

                {(item.type === 'Mineral lick' || item.type === 'Mineral powder') && (
                  <>
                    <div className="space-y-2">
                      <Label>Number of cows fed/block</Label>
                      <Input
                        type="number"
                        value={item.numberOfCowsFedPerBlock || 0}
                        onChange={(e) => handleUpdateFeed(item.id, { 
                          numberOfCowsFedPerBlock: parseFloat(e.target.value) || 0
                        })}
                        placeholder="6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Number of days each block lasts</Label>
                      <Input
                        type="number"
                        value={item.numberOfDaysPerBlock || 0}
                        onChange={(e) => handleUpdateFeed(item.id, { 
                          numberOfDaysPerBlock: parseFloat(e.target.value) || 0
                        })}
                        placeholder="5"
                      />
                    </div>
                  </>
                )}

                {item.type === 'Hay' && (
                  <div className="space-y-2">
                    <Label>Weight of bale (kg)</Label>
                    <Input
                      type="number"
                      value={item.weightOfBale || 0}
                      onChange={(e) => handleUpdateFeed(item.id, { 
                        weightOfBale: parseFloat(e.target.value) || 0
                      })}
                      placeholder="12"
                    />
                  </div>
                )}

                {(item.type.includes('green') || item.type.includes('grass') || item.type.includes('legume') || 
                  item.type === 'Nappier grass' || item.type === 'Brachiaria' || item.type === 'Rhodes grass' || 
                  item.type === 'Desmodium' || item.type === 'Other legume fodder') && (
                  <>
                    <div className="space-y-2">
                      <Label>Measurement units (bags, bundles, kg, etc.)</Label>
                      <Input
                        type="text"
                        value={item.measurementUnit || ''}
                        onChange={(e) => handleUpdateFeed(item.id, { 
                          measurementUnit: e.target.value
                        })}
                        placeholder="bundles"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Number of units fed/cow</Label>
                      <Input
                        type="number"
                        value={item.numberOfUnitsFedPerCow || 0}
                        onChange={(e) => handleUpdateFeed(item.id, { 
                          numberOfUnitsFedPerCow: parseFloat(e.target.value) || 0
                        })}
                        placeholder="0"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}

          <Button onClick={handleAddFeed} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Feed Item
          </Button>
        </TabsContent>

        {/* BREEDING TAB */}
        <TabsContent value="breeding" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Breeding Cost</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Number of AI services per conception</Label>
                <Input
                  type="number"
                  value={numberOfAIServices}
                  onChange={(e) => setNumberOfAIServices(parseFloat(e.target.value) || 0)}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label>Cost of AI per service</Label>
                <Input
                  type="number"
                  value={costPerAIService}
                  onChange={(e) => setCostPerAIService(parseFloat(e.target.value) || 0)}
                  placeholder="1000"
                />
              </div>
              <div className="space-y-2">
                <Label>Cost of pregnancy diagnosis</Label>
                <Input
                  type="number"
                  value={costOfPregnancyDiagnosis}
                  onChange={(e) => setCostOfPregnancyDiagnosis(parseFloat(e.target.value) || 0)}
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <Label>Number of cows diagnosed for pregnancy</Label>
                <Input
                  type="number"
                  value={numberOfCowsDiagnosed}
                  onChange={(e) => setNumberOfCowsDiagnosed(parseFloat(e.target.value) || 0)}
                  placeholder="1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Feeding Cost (Calf)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Milk (annual cost)</Label>
                <Input
                  type="number"
                  value={calfFeedingMilk}
                  onChange={(e) => setCalfFeedingMilk(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Milk Replacer (annual cost)</Label>
                <Input
                  type="number"
                  value={calfFeedingMilkReplacer}
                  onChange={(e) => setCalfFeedingMilkReplacer(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Calf Pellet (annual cost)</Label>
                <Input
                  type="number"
                  value={calfFeedingPellet}
                  onChange={(e) => setCalfFeedingPellet(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-orange-50 rounded border border-orange-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Breeding Cost (Annual):</span>
              <span className="text-xl font-bold text-orange-700">
                {formatCurrency(
                  (numberOfAIServices * costPerAIService * data.herdData.lactatingCows) +
                  (costOfPregnancyDiagnosis * numberOfCowsDiagnosed) +
                  calfFeedingMilk +
                  calfFeedingMilkReplacer +
                  calfFeedingPellet,
                  currency
                )}
              </span>
            </div>
          </div>
        </TabsContent>

        {/* LABOR TAB */}
        <TabsContent value="labor" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Employees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Number of workers employed in dairy</Label>
                <Input
                  type="number"
                  value={numberOfWorkers}
                  onChange={(e) => setNumberOfWorkers(parseFloat(e.target.value) || 0)}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly wage rate - Employee</Label>
                <Input
                  type="number"
                  value={monthlyWageEmployee}
                  onChange={(e) => setMonthlyWageEmployee(parseFloat(e.target.value) || 0)}
                  placeholder="5000"
                />
              </div>
              <div className="pt-2 border-t flex justify-between text-sm">
                <span className="text-muted-foreground">Annual Labor Cost (Employees):</span>
                <span className="font-semibold">
                  {formatCurrency(numberOfWorkers * monthlyWageEmployee * 12, currency)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Number of managers</Label>
                <Input
                  type="number"
                  value={numberOfManagers}
                  onChange={(e) => setNumberOfManagers(parseFloat(e.target.value) || 0)}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly wage rate - Manager</Label>
                <Input
                  type="number"
                  value={monthlyWageManager}
                  onChange={(e) => setMonthlyWageManager(parseFloat(e.target.value) || 0)}
                  placeholder="10000"
                />
              </div>
              <div className="pt-2 border-t flex justify-between text-sm">
                <span className="text-muted-foreground">Annual Labor Cost (Management):</span>
                <span className="font-semibold">
                  {formatCurrency(numberOfManagers * monthlyWageManager * 12, currency)}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-orange-50 rounded border border-orange-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Labor Cost (Annual):</span>
              <span className="text-xl font-bold text-orange-700">
                {formatCurrency(
                  (numberOfWorkers * monthlyWageEmployee * 12) +
                  (numberOfManagers * monthlyWageManager * 12),
                  currency
                )}
              </span>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-5 w-5 mr-2" />
        Save Cost Assumptions
      </Button>
    </div>
  );
}