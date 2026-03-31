import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Herd } from '../../types';
import { ChevronLeft } from 'lucide-react';

interface HerdRegistrationProps {
  farmId: string;
  onNext: (herd: Omit<Herd, 'id'>) => void;
  onBack: () => void;
  onSkip: () => void;
}

export function HerdRegistration({ farmId, onNext, onBack, onSkip }: HerdRegistrationProps) {
  const [formData, setFormData] = useState({
    herdName: '',
    breedType: '',
    totalAnimals: '',
    lactatingCows: '',
    heifers: '',
    breedingMethod: 'AI',
    dateEstablished: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.herdName.trim()) {
      onNext({
        farmId,
        herdName: formData.herdName,
        breedType: formData.breedType,
        totalAnimals: Number(formData.totalAnimals) || 0,
        lactatingCows: Number(formData.lactatingCows) || 0,
        heifers: Number(formData.heifers) || 0,
        breedingMethod: formData.breedingMethod,
        dateEstablished: formData.dateEstablished,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-xl font-semibold">Herd Registration</h2>
            <p className="text-sm text-gray-600">Step 2 of 3</p>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 w-2/3 transition-all duration-300" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Herd Details</CardTitle>
            <CardDescription>Enter information about your herd</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="herdName">Herd Name *</Label>
                <Input
                  id="herdName"
                  placeholder="e.g., Main Herd"
                  value={formData.herdName}
                  onChange={(e) => handleChange('herdName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="breedType">Breed Type</Label>
                <Input
                  id="breedType"
                  placeholder="e.g., Holstein, Jersey"
                  value={formData.breedType}
                  onChange={(e) => handleChange('breedType', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalAnimals">Total Animals</Label>
                <Input
                  id="totalAnimals"
                  type="number"
                  placeholder="0"
                  value={formData.totalAnimals}
                  onChange={(e) => handleChange('totalAnimals', e.target.value)}
                  min="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lactatingCows">Lactating Cows</Label>
                  <Input
                    id="lactatingCows"
                    type="number"
                    placeholder="0"
                    value={formData.lactatingCows}
                    onChange={(e) => handleChange('lactatingCows', e.target.value)}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heifers">Heifers</Label>
                  <Input
                    id="heifers"
                    type="number"
                    placeholder="0"
                    value={formData.heifers}
                    onChange={(e) => handleChange('heifers', e.target.value)}
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Young females not yet calved
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="breedingMethod">Breeding Method</Label>
                <Select value={formData.breedingMethod} onValueChange={(val) => handleChange('breedingMethod', val)}>
                  <SelectTrigger id="breedingMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AI">Artificial Insemination (AI)</SelectItem>
                    <SelectItem value="Natural">Natural Breeding</SelectItem>
                    <SelectItem value="Both">Both AI & Natural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateEstablished">Date Established</Label>
                <Input
                  id="dateEstablished"
                  type="date"
                  value={formData.dateEstablished}
                  onChange={(e) => handleChange('dateEstablished', e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onSkip}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Next
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
