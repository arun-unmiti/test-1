import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Farm } from '../../types';
import { Plus, Edit, Check, X } from 'lucide-react';

export function FarmManagement() {
  const { data, addFarm, updateFarm, setCurrentFarm } = useAppContext();
  const [isAddingFarm, setIsAddingFarm] = useState(false);
  const [editingFarmId, setEditingFarmId] = useState<string | null>(null);
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

  const handleAddFarm = () => {
    if (formData.farmName.trim()) {
      const farmId = addFarm(formData);
      setCurrentFarm(farmId);
      resetForm();
      setIsAddingFarm(false);
    }
  };

  const handleEditFarm = (farm: Farm) => {
    setEditingFarmId(farm.id);
    setFormData({
      farmName: farm.farmName,
      location: farm.location,
      farmSize: farm.farmSize,
      establishedYear: farm.establishedYear,
      contactPerson: farm.contactPerson,
      phoneNumber: farm.phoneNumber,
      email: farm.email,
      farmIdCode: farm.farmIdCode,
      typeOfFarm: farm.typeOfFarm,
      currency: farm.currency,
      units: farm.units,
    });
  };

  const handleSaveEdit = () => {
    if (editingFarmId && formData.farmName.trim()) {
      updateFarm(editingFarmId, formData);
      resetForm();
      setEditingFarmId(null);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setEditingFarmId(null);
    setIsAddingFarm(false);
  };

  const resetForm = () => {
    setFormData({
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
      units: 'kg',
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Farm Management</h3>
        <p className="text-sm text-muted-foreground">Manage your farms</p>
      </div>

      {/* List of Farms */}
      <div className="space-y-3">
        {data.farms.map((farm) => (
          <Card key={farm.id} className={farm.id === data.currentFarmId ? 'border-green-600' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{farm.farmName}</CardTitle>
                  <CardDescription>{farm.location}</CardDescription>
                </div>
                {editingFarmId !== farm.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditFarm(farm)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            {editingFarmId === farm.id ? (
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Farm Name *</Label>
                  <Input
                    value={formData.farmName}
                    onChange={(e) => handleChange('farmName', e.target.value)}
                    placeholder="Farm name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Farm Size</Label>
                    <Input
                      value={formData.farmSize}
                      onChange={(e) => handleChange('farmSize', e.target.value)}
                      placeholder="acres"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input
                      value={formData.establishedYear}
                      onChange={(e) => handleChange('establishedYear', e.target.value)}
                      placeholder="e.g., 2010"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSaveEdit} size="sm" className="flex-1 bg-green-600">
                    <Check className="h-4 w-4 mr-1" /> Save
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{farm.typeOfFarm}</span>
                  </div>
                  {farm.farmSize && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{farm.farmSize} acres</span>
                    </div>
                  )}
                  {farm.contactPerson && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact:</span>
                      <span>{farm.contactPerson}</span>
                    </div>
                  )}
                </div>
                {farm.id !== data.currentFarmId && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => setCurrentFarm(farm.id)}
                  >
                    Set as Current Farm
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Add New Farm */}
      {!isAddingFarm && !editingFarmId && (
        <Button onClick={() => setIsAddingFarm(true)} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add New Farm
        </Button>
      )}

      {isAddingFarm && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-base">Add New Farm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Farm Name *</Label>
              <Input
                value={formData.farmName}
                onChange={(e) => handleChange('farmName', e.target.value)}
                placeholder="Farm name"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="City, State"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Farm Size</Label>
                <Input
                  value={formData.farmSize}
                  onChange={(e) => handleChange('farmSize', e.target.value)}
                  placeholder="acres"
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  value={formData.establishedYear}
                  onChange={(e) => handleChange('establishedYear', e.target.value)}
                  placeholder="e.g., 2010"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
                placeholder="Owner/Manager"
              />
            </div>
            <div className="space-y-2">
              <Label>Type of Farm</Label>
              <Select value={formData.typeOfFarm} onValueChange={(val) => handleChange('typeOfFarm', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                  <SelectItem value="Organic">Organic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddFarm} size="sm" className="flex-1 bg-green-600">
                <Check className="h-4 w-4 mr-1" /> Add Farm
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {data.farms.length === 0 && !isAddingFarm && (
        <Card className="border-dashed">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-sm text-muted-foreground">No farms added yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
