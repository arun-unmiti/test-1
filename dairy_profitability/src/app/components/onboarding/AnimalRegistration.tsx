import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Animal } from '../../types';
import { ChevronLeft } from 'lucide-react';

interface AnimalRegistrationProps {
  herdId: string;
  onComplete: (animal: Omit<Animal, 'id'>) => void;
  onBack: () => void;
  onSkip: () => void;
}

export function AnimalRegistration({ herdId, onComplete, onBack, onSkip }: AnimalRegistrationProps) {
  const [formData, setFormData] = useState({
    tagId: '',
    animalType: 'Cow',
    breed: '',
    dateOfBirth: '',
    gender: 'Female',
    damId: '',
    sireId: '',
    purchaseOrBorn: 'Born on farm' as 'Purchase' | 'Born on farm',
    dateOfEntry: '',
    source: '',
    purchasePrice: '',
    currentWeight: '',
    healthStatus: 'Healthy',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tagId.trim()) {
      onComplete({
        herdId,
        tagId: formData.tagId,
        animalType: formData.animalType,
        breed: formData.breed,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        damId: formData.damId || undefined,
        sireId: formData.sireId || undefined,
        purchaseOrBorn: formData.purchaseOrBorn,
        dateOfEntry: formData.dateOfEntry,
        source: formData.source || undefined,
        purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : undefined,
        currentWeight: formData.currentWeight ? Number(formData.currentWeight) : undefined,
        healthStatus: formData.healthStatus || undefined,
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
            <h2 className="text-xl font-semibold">Animal Registration</h2>
            <p className="text-sm text-gray-600">Step 3 of 3</p>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 w-full transition-all duration-300" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Animal Details</CardTitle>
            <CardDescription>Add your first animal (you can add more later)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tagId">Tag ID / Animal ID *</Label>
                <Input
                  id="tagId"
                  placeholder="e.g., A001"
                  value={formData.tagId}
                  onChange={(e) => handleChange('tagId', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="animalType">Animal Type</Label>
                  <Select value={formData.animalType} onValueChange={(val) => handleChange('animalType', val)}>
                    <SelectTrigger id="animalType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cow">Cow</SelectItem>
                      <SelectItem value="Heifer">Heifer</SelectItem>
                      <SelectItem value="Bull">Bull</SelectItem>
                      <SelectItem value="Calf">Calf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    placeholder="e.g., Holstein"
                    value={formData.breed}
                    onChange={(e) => handleChange('breed', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(val) => handleChange('gender', val)}>
                    <SelectTrigger id="gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Origin</Label>
                <RadioGroup 
                  value={formData.purchaseOrBorn} 
                  onValueChange={(val) => handleChange('purchaseOrBorn', val)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Born on farm" id="born" />
                    <Label htmlFor="born" className="font-normal">Born on farm</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Purchase" id="purchase" />
                    <Label htmlFor="purchase" className="font-normal">Purchase</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.purchaseOrBorn === 'Born on farm' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="damId">Dam ID (Mother)</Label>
                    <Input
                      id="damId"
                      placeholder="Optional"
                      value={formData.damId}
                      onChange={(e) => handleChange('damId', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sireId">Sire ID (Father)</Label>
                    <Input
                      id="sireId"
                      placeholder="Optional"
                      value={formData.sireId}
                      onChange={(e) => handleChange('sireId', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {formData.purchaseOrBorn === 'Purchase' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="source">Source / Vendor</Label>
                    <Input
                      id="source"
                      placeholder="Where purchased from"
                      value={formData.source}
                      onChange={(e) => handleChange('source', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      placeholder="0"
                      value={formData.purchasePrice}
                      onChange={(e) => handleChange('purchasePrice', e.target.value)}
                      min="0"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="dateOfEntry">Date of Entry</Label>
                <Input
                  id="dateOfEntry"
                  type="date"
                  value={formData.dateOfEntry}
                  onChange={(e) => handleChange('dateOfEntry', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    placeholder="0"
                    value={formData.currentWeight}
                    onChange={(e) => handleChange('currentWeight', e.target.value)}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthStatus">Health Status</Label>
                  <Select value={formData.healthStatus} onValueChange={(val) => handleChange('healthStatus', val)}>
                    <SelectTrigger id="healthStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Healthy">Healthy</SelectItem>
                      <SelectItem value="Under Treatment">Under Treatment</SelectItem>
                      <SelectItem value="Quarantine">Quarantine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  Complete
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
