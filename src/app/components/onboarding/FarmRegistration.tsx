import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Farm } from '../../types';
import { ChevronLeft } from 'lucide-react';

interface FarmRegistrationProps {
  onNext: (farm: Omit<Farm, 'id'>) => void;
  onBack: () => void;
  onSkip: () => void;
}

export function FarmRegistration({ onNext, onBack, onSkip }: FarmRegistrationProps) {
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    farmSize: '',
    establishedYear: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    farmIdCode: '',
    typeOfFarm: 'Dairy',
    currency: '₹',
    units: 'kg' as 'kg' | 'lb',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.farmName.trim()) {
      onNext(formData);
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
            <h2 className="text-xl font-semibold">Farm Registration</h2>
            <p className="text-sm text-gray-600">Step 1 of 3</p>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 w-1/3 transition-all duration-300" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Farm Details</CardTitle>
            <CardDescription>Enter your farm information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="farmName">Farm Name *</Label>
                <Input
                  id="farmName"
                  placeholder="Enter farm name"
                  value={formData.farmName}
                  onChange={(e) => handleChange('farmName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size (acres)</Label>
                  <Input
                    id="farmSize"
                    placeholder="e.g., 50"
                    value={formData.farmSize}
                    onChange={(e) => handleChange('farmSize', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    placeholder="e.g., 2010"
                    value={formData.establishedYear}
                    onChange={(e) => handleChange('establishedYear', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="Owner/Manager name"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="10-digit number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="farmIdCode">Farm ID/Code</Label>
                  <Input
                    id="farmIdCode"
                    placeholder="Optional ID"
                    value={formData.farmIdCode}
                    onChange={(e) => handleChange('farmIdCode', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="typeOfFarm">Type of Farm</Label>
                  <Select value={formData.typeOfFarm} onValueChange={(val) => handleChange('typeOfFarm', val)}>
                    <SelectTrigger id="typeOfFarm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                      <SelectItem value="Organic">Organic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(val) => handleChange('currency', val)}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="₹">₹ (INR)</SelectItem>
                      <SelectItem value="$">$ (USD)</SelectItem>
                      <SelectItem value="€">€ (EUR)</SelectItem>
                      <SelectItem value="£">£ (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units">Units</Label>
                  <Select value={formData.units} onValueChange={(val) => handleChange('units', val)}>
                    <SelectTrigger id="units">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
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
