import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Animal } from '../../types';
import { Plus, Edit, Check, X, Search } from 'lucide-react';

export function AnimalManagement() {
  const { data, addAnimal, updateAnimal } = useAppContext();
  const [isAddingAnimal, setIsAddingAnimal] = useState(false);
  const [editingAnimalId, setEditingAnimalId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    tagId: '',
    animalType: 'Cow',
    breed: '',
    dateOfBirth: '',
    gender: 'Female',
    purchaseOrBorn: 'Born on farm' as 'Purchase' | 'Born on farm',
    dateOfEntry: '',
    currentWeight: '',
    healthStatus: 'Healthy',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAnimal = () => {
    if (formData.tagId.trim() && data.currentHerdId) {
      addAnimal({
        herdId: data.currentHerdId,
        tagId: formData.tagId,
        animalType: formData.animalType,
        breed: formData.breed,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        purchaseOrBorn: formData.purchaseOrBorn,
        dateOfEntry: formData.dateOfEntry,
        currentWeight: formData.currentWeight ? Number(formData.currentWeight) : undefined,
        healthStatus: formData.healthStatus,
      });
      resetForm();
      setIsAddingAnimal(false);
    }
  };

  const handleEditAnimal = (animal: Animal) => {
    setEditingAnimalId(animal.id);
    setFormData({
      tagId: animal.tagId,
      animalType: animal.animalType,
      breed: animal.breed,
      dateOfBirth: animal.dateOfBirth,
      gender: animal.gender,
      purchaseOrBorn: animal.purchaseOrBorn,
      dateOfEntry: animal.dateOfEntry,
      currentWeight: animal.currentWeight ? String(animal.currentWeight) : '',
      healthStatus: animal.healthStatus || 'Healthy',
    });
  };

  const handleSaveEdit = () => {
    if (editingAnimalId && formData.tagId.trim()) {
      updateAnimal(editingAnimalId, {
        tagId: formData.tagId,
        animalType: formData.animalType,
        breed: formData.breed,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        purchaseOrBorn: formData.purchaseOrBorn,
        dateOfEntry: formData.dateOfEntry,
        currentWeight: formData.currentWeight ? Number(formData.currentWeight) : undefined,
        healthStatus: formData.healthStatus,
      });
      resetForm();
      setEditingAnimalId(null);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setEditingAnimalId(null);
    setIsAddingAnimal(false);
  };

  const resetForm = () => {
    setFormData({
      tagId: '',
      animalType: 'Cow',
      breed: '',
      dateOfBirth: '',
      gender: 'Female',
      purchaseOrBorn: 'Born on farm',
      dateOfEntry: '',
      currentWeight: '',
      healthStatus: 'Healthy',
    });
  };

  const currentHerdAnimals = data.animals.filter(a => a.herdId === data.currentHerdId);
  const filteredAnimals = currentHerdAnimals.filter(a => 
    a.tagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.animalType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Animal Management</h3>
        <p className="text-sm text-muted-foreground">
          {data.currentHerdId 
            ? `Manage animals for ${data.herds.find(h => h.id === data.currentHerdId)?.herdName}`
            : 'Please select a herd first'}
        </p>
      </div>

      {!data.currentHerdId && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 pb-6">
            <p className="text-sm text-yellow-800">
              Please add and select a herd before managing animals
            </p>
          </CardContent>
        </Card>
      )}

      {data.currentHerdId && (
        <>
          {/* Search Bar */}
          {currentHerdAnimals.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Tag ID, Breed, or Type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* List of Animals */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAnimals.map((animal) => (
              <Card key={animal.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">Tag: {animal.tagId}</CardTitle>
                      <CardDescription>{animal.breed} {animal.animalType}</CardDescription>
                    </div>
                    {editingAnimalId !== animal.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAnimal(animal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {editingAnimalId === animal.id ? (
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Tag ID *</Label>
                      <Input
                        value={formData.tagId}
                        onChange={(e) => handleChange('tagId', e.target.value)}
                        placeholder="Tag ID"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={formData.animalType} onValueChange={(val) => handleChange('animalType', val)}>
                          <SelectTrigger>
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
                        <Label>Gender</Label>
                        <Select value={formData.gender} onValueChange={(val) => handleChange('gender', val)}>
                          <SelectTrigger>
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
                      <Label>Breed</Label>
                      <Input
                        value={formData.breed}
                        onChange={(e) => handleChange('breed', e.target.value)}
                        placeholder="Breed"
                      />
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
                        <span className="text-muted-foreground">Gender:</span>
                        <span>{animal.gender}</span>
                      </div>
                      {animal.dateOfBirth && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">DOB:</span>
                          <span>{new Date(animal.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Origin:</span>
                        <span>{animal.purchaseOrBorn}</span>
                      </div>
                      {animal.currentWeight && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight:</span>
                          <span>{animal.currentWeight} kg</span>
                        </div>
                      )}
                      {animal.healthStatus && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Health:</span>
                          <span className={animal.healthStatus === 'Healthy' ? 'text-green-600' : 'text-orange-600'}>
                            {animal.healthStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Add New Animal */}
          {!isAddingAnimal && !editingAnimalId && (
            <Button onClick={() => setIsAddingAnimal(true)} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add New Animal
            </Button>
          )}

          {isAddingAnimal && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-base">Add New Animal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Tag ID / Animal ID *</Label>
                  <Input
                    value={formData.tagId}
                    onChange={(e) => handleChange('tagId', e.target.value)}
                    placeholder="e.g., A001"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Animal Type</Label>
                    <Select value={formData.animalType} onValueChange={(val) => handleChange('animalType', val)}>
                      <SelectTrigger>
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
                    <Label>Gender</Label>
                    <Select value={formData.gender} onValueChange={(val) => handleChange('gender', val)}>
                      <SelectTrigger>
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
                  <Label>Breed</Label>
                  <Input
                    value={formData.breed}
                    onChange={(e) => handleChange('breed', e.target.value)}
                    placeholder="e.g., Holstein"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Weight (kg)</Label>
                    <Input
                      type="number"
                      value={formData.currentWeight}
                      onChange={(e) => handleChange('currentWeight', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleAddAnimal} size="sm" className="flex-1 bg-green-600">
                    <Check className="h-4 w-4 mr-1" /> Add Animal
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentHerdAnimals.length === 0 && !isAddingAnimal && (
            <Card className="border-dashed">
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-sm text-muted-foreground">No animals added yet for this herd</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
