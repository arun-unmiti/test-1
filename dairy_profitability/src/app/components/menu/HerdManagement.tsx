import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Herd } from '../../types';
import { Plus, Edit, Check, X } from 'lucide-react';

export function HerdManagement() {
  const { data, addHerd, updateHerd, setCurrentHerd } = useAppContext();
  const [isAddingHerd, setIsAddingHerd] = useState(false);
  const [editingHerdId, setEditingHerdId] = useState<string | null>(null);
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

  const handleAddHerd = () => {
    if (formData.herdName.trim() && data.currentFarmId) {
      const herdId = addHerd({
        farmId: data.currentFarmId,
        herdName: formData.herdName,
        breedType: formData.breedType,
        totalAnimals: Number(formData.totalAnimals) || 0,
        lactatingCows: Number(formData.lactatingCows) || 0,
        heifers: Number(formData.heifers) || 0,
        breedingMethod: formData.breedingMethod,
        dateEstablished: formData.dateEstablished,
      });
      setCurrentHerd(herdId);
      resetForm();
      setIsAddingHerd(false);
    }
  };

  const handleEditHerd = (herd: Herd) => {
    setEditingHerdId(herd.id);
    setFormData({
      herdName: herd.herdName,
      breedType: herd.breedType,
      totalAnimals: String(herd.totalAnimals),
      lactatingCows: String(herd.lactatingCows),
      heifers: String(herd.heifers),
      breedingMethod: herd.breedingMethod,
      dateEstablished: herd.dateEstablished,
    });
  };

  const handleSaveEdit = () => {
    if (editingHerdId && formData.herdName.trim()) {
      updateHerd(editingHerdId, {
        herdName: formData.herdName,
        breedType: formData.breedType,
        totalAnimals: Number(formData.totalAnimals) || 0,
        lactatingCows: Number(formData.lactatingCows) || 0,
        heifers: Number(formData.heifers) || 0,
        breedingMethod: formData.breedingMethod,
        dateEstablished: formData.dateEstablished,
      });
      resetForm();
      setEditingHerdId(null);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setEditingHerdId(null);
    setIsAddingHerd(false);
  };

  const resetForm = () => {
    setFormData({
      herdName: '',
      breedType: '',
      totalAnimals: '',
      lactatingCows: '',
      heifers: '',
      breedingMethod: 'AI',
      dateEstablished: '',
    });
  };

  const currentFarmHerds = data.herds.filter(h => h.farmId === data.currentFarmId);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Herd Management</h3>
        <p className="text-sm text-muted-foreground">
          {data.currentFarmId 
            ? `Manage herds for ${data.farms.find(f => f.id === data.currentFarmId)?.farmName}`
            : 'Please select a farm first'}
        </p>
      </div>

      {!data.currentFarmId && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 pb-6">
            <p className="text-sm text-yellow-800">
              Please add and select a farm before managing herds
            </p>
          </CardContent>
        </Card>
      )}

      {data.currentFarmId && (
        <>
          {/* List of Herds */}
          <div className="space-y-3">
            {currentFarmHerds.map((herd) => (
              <Card key={herd.id} className={herd.id === data.currentHerdId ? 'border-green-600' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{herd.herdName}</CardTitle>
                      <CardDescription>{herd.breedType}</CardDescription>
                    </div>
                    {editingHerdId !== herd.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditHerd(herd)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {editingHerdId === herd.id ? (
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Herd Name *</Label>
                      <Input
                        value={formData.herdName}
                        onChange={(e) => handleChange('herdName', e.target.value)}
                        placeholder="Herd name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Breed Type</Label>
                      <Input
                        value={formData.breedType}
                        onChange={(e) => handleChange('breedType', e.target.value)}
                        placeholder="e.g., Holstein"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input
                          type="number"
                          value={formData.totalAnimals}
                          onChange={(e) => handleChange('totalAnimals', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Lactating</Label>
                        <Input
                          type="number"
                          value={formData.lactatingCows}
                          onChange={(e) => handleChange('lactatingCows', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Heifers</Label>
                        <Input
                          type="number"
                          value={formData.heifers}
                          onChange={(e) => handleChange('heifers', e.target.value)}
                          placeholder="0"
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
                        <span className="text-muted-foreground">Total Animals:</span>
                        <span>{herd.totalAnimals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lactating Cows:</span>
                        <span>{herd.lactatingCows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Heifers:</span>
                        <span>{herd.heifers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Breeding:</span>
                        <span>{herd.breedingMethod}</span>
                      </div>
                    </div>
                    {herd.id !== data.currentHerdId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => setCurrentHerd(herd.id)}
                      >
                        Set as Current Herd
                      </Button>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Add New Herd */}
          {!isAddingHerd && !editingHerdId && (
            <Button onClick={() => setIsAddingHerd(true)} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add New Herd
            </Button>
          )}

          {isAddingHerd && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-base">Add New Herd</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Herd Name *</Label>
                  <Input
                    value={formData.herdName}
                    onChange={(e) => handleChange('herdName', e.target.value)}
                    placeholder="e.g., Main Herd"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Breed Type</Label>
                  <Input
                    value={formData.breedType}
                    onChange={(e) => handleChange('breedType', e.target.value)}
                    placeholder="e.g., Holstein, Jersey"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label>Total</Label>
                    <Input
                      type="number"
                      value={formData.totalAnimals}
                      onChange={(e) => handleChange('totalAnimals', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lactating</Label>
                    <Input
                      type="number"
                      value={formData.lactatingCows}
                      onChange={(e) => handleChange('lactatingCows', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Heifers</Label>
                    <Input
                      type="number"
                      value={formData.heifers}
                      onChange={(e) => handleChange('heifers', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Breeding Method</Label>
                  <Select value={formData.breedingMethod} onValueChange={(val) => handleChange('breedingMethod', val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI">Artificial Insemination (AI)</SelectItem>
                      <SelectItem value="Natural">Natural Breeding</SelectItem>
                      <SelectItem value="Both">Both AI & Natural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleAddHerd} size="sm" className="flex-1 bg-green-600">
                    <Check className="h-4 w-4 mr-1" /> Add Herd
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentFarmHerds.length === 0 && !isAddingHerd && (
            <Card className="border-dashed">
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-sm text-muted-foreground">No herds added yet for this farm</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
