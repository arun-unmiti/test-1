import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, FarmSetup, HerdData, MilkData, FeedItem, CostsData, OtherRevenue, TargetData, MonthlySnapshot, PreCalculatedParams, Farm, Herd, Animal } from '../types';

const STORAGE_KEY = 'dairy_app_data';

const defaultData: AppData = {
  onboardingComplete: false,
  farmSetup: {
    farmName: '',
    currency: '₹',
    units: 'kg',
  },
  herdData: {
    totalAnimals: 0,
    lactatingCows: 0,
    heifers: 0,
  },
  milkData: {
    avgMilkPerCow: 0,
    milkPrice: 0,
  },
  feedItems: [],
  costs: {
    labor: 0,
    breeding: 0,
    health: 0,
  },
  otherRevenue: {
    manure: 0,
    bullCalves: 0,
    heifers: 0,
    cows: 0,
    bulls: 0,
  },
  target: null,
  history: [],
  farms: [],
  herds: [],
  animals: [],
  preCalculatedParams: {
    daysInYear: 365,
    monthsInYear: 12,
    weeksInYear: 52,
    recommendedLactatingPercentage: 75,
    recommendedMilkYieldIncrease: 10,
    daysOpen: 90,
    gestationPeriod: 283,
    recommendedCalvingInterval: 365,
    lengthOfDryingPeriod: 60,
    cowWeightAdjustmentFactor: 4.47,
    cowWeightLessConstant: 393.13,
    heiferWeightAdjustmentFactor: 4.31,
    heiferWeightLessConstant: 284.31,
    amountOfCowdungPerCowPerDay: 20,
    concentrateLessThan7Litres: 0,
    concentrate7To10Litres: 2,
    concentrate10To13Litres: 3,
    concentrate13To16Litres: 4,
    concentrate16To20Litres: 5,
    concentrateAbove20Litres: 6,
    forageCombination1: 'chopped hay, silage',
    forageCombination2: 'chopped hay, Nappier grass',
    forageCombination3: 'chopped hay, legume',
    forageCombination4: 'Nappier grass/brachiaria, legume',
    recommendedHealthVisitsPerYear: 4,
    recommendedDewormingFrequencyPerYear: 4,
    recommendedTickControlFrequencyPerWeek: 2,
    totalMilkFedToCalves: 300,
    numberOfMilkFeedingDays: 90,
    recommendedAIServicesPerConception: 3,
    insurancePremium: 0,
    costOfTransportPerLitre: 0,
  },
};

interface AppContextType {
  data: AppData;
  updateFarmSetup: (setup: FarmSetup) => void;
  updateHerdData: (herd: HerdData) => void;
  updateMilkData: (milk: MilkData) => void;
  updateFeedItems: (items: FeedItem[]) => void;
  updateCosts: (costs: CostsData) => void;
  updateOtherRevenue: (revenue: OtherRevenue) => void;
  updateTarget: (target: TargetData | null) => void;
  updatePreCalculatedParams: (params: PreCalculatedParams) => void;
  completeOnboarding: () => void;
  addMonthlySnapshot: (snapshot: MonthlySnapshot) => void;
  resetData: () => void;
  // New methods for farms, herds, and animals
  addFarm: (farm: Omit<Farm, 'id'>) => string;
  updateFarm: (id: string, farm: Partial<Farm>) => void;
  addHerd: (herd: Omit<Herd, 'id'>) => string;
  updateHerd: (id: string, herd: Partial<Herd>) => void;
  addAnimal: (animal: Omit<Animal, 'id'>) => string;
  updateAnimal: (id: string, animal: Partial<Animal>) => void;
  setCurrentFarm: (farmId: string) => void;
  setCurrentHerd: (herdId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateFarmSetup = (setup: FarmSetup) => {
    setData(prev => ({ ...prev, farmSetup: setup }));
  };

  const updateHerdData = (herd: HerdData) => {
    setData(prev => ({ ...prev, herdData: herd }));
  };

  const updateMilkData = (milk: MilkData) => {
    setData(prev => ({ ...prev, milkData: milk }));
  };

  const updateFeedItems = (items: FeedItem[]) => {
    setData(prev => ({ ...prev, feedItems: items }));
  };

  const updateCosts = (costs: CostsData) => {
    setData(prev => ({ ...prev, costs: costs }));
  };

  const updateOtherRevenue = (revenue: OtherRevenue) => {
    setData(prev => ({ ...prev, otherRevenue: revenue }));
  };

  const updateTarget = (target: TargetData | null) => {
    setData(prev => ({ ...prev, target }));
  };

  const updatePreCalculatedParams = (params: PreCalculatedParams) => {
    setData(prev => ({ ...prev, preCalculatedParams: params }));
  };

  const completeOnboarding = () => {
    setData(prev => ({ ...prev, onboardingComplete: true }));
  };

  const addMonthlySnapshot = (snapshot: MonthlySnapshot) => {
    setData(prev => ({
      ...prev,
      history: [...prev.history, snapshot],
    }));
  };

  const resetData = () => {
    setData(defaultData);
    localStorage.removeItem(STORAGE_KEY);
  };

  // New methods for farms, herds, and animals
  const addFarm = (farm: Omit<Farm, 'id'>) => {
    const newId = `farm-${Date.now()}`;
    const newFarm = { ...farm, id: newId };
    setData(prev => ({
      ...prev,
      farms: [...prev.farms, newFarm],
      // Also sync with legacy farmSetup for backward compatibility
      farmSetup: {
        farmName: farm.farmName,
        currency: farm.currency,
        units: farm.units,
      },
    }));
    return newId;
  };

  const updateFarm = (id: string, farm: Partial<Farm>) => {
    setData(prev => {
      const updatedFarms = prev.farms.map(f => (f.id === id ? { ...f, ...farm } : f));
      const currentFarm = updatedFarms.find(f => f.id === id);
      
      // If updating the current farm, also sync with legacy farmSetup
      const updatedFarmSetup = (id === prev.currentFarmId && currentFarm) ? {
        farmName: currentFarm.farmName,
        currency: currentFarm.currency,
        units: currentFarm.units,
      } : prev.farmSetup;

      return {
        ...prev,
        farms: updatedFarms,
        farmSetup: updatedFarmSetup,
      };
    });
  };

  const addHerd = (herd: Omit<Herd, 'id'>) => {
    const newId = `herd-${Date.now()}`;
    const newHerd = { ...herd, id: newId };
    setData(prev => ({
      ...prev,
      herds: [...prev.herds, newHerd],
      // Also sync with legacy herdData for backward compatibility
      herdData: {
        totalAnimals: herd.totalAnimals,
        lactatingCows: herd.lactatingCows,
        heifers: herd.heifers,
      },
    }));
    return newId;
  };

  const updateHerd = (id: string, herd: Partial<Herd>) => {
    setData(prev => {
      const updatedHerds = prev.herds.map(h => (h.id === id ? { ...h, ...herd } : h));
      const currentHerd = updatedHerds.find(h => h.id === id);
      
      // If updating the current herd, also sync with legacy herdData
      const updatedHerdData = (id === prev.currentHerdId && currentHerd) ? {
        totalAnimals: currentHerd.totalAnimals,
        lactatingCows: currentHerd.lactatingCows,
        heifers: currentHerd.heifers,
      } : prev.herdData;

      return {
        ...prev,
        herds: updatedHerds,
        herdData: updatedHerdData,
      };
    });
  };

  const addAnimal = (animal: Omit<Animal, 'id'>) => {
    const newId = `animal-${Date.now()}`;
    setData(prev => ({
      ...prev,
      animals: [...prev.animals, { ...animal, id: newId }],
    }));
    return newId;
  };

  const updateAnimal = (id: string, animal: Partial<Animal>) => {
    setData(prev => ({
      ...prev,
      animals: prev.animals.map(a => (a.id === id ? { ...a, ...animal } : a)),
    }));
  };

  const setCurrentFarm = (farmId: string) => {
    setData(prev => {
      const farm = prev.farms.find(f => f.id === farmId);
      if (farm) {
        return {
          ...prev,
          currentFarmId: farmId,
          // Sync with legacy farmSetup
          farmSetup: {
            farmName: farm.farmName,
            currency: farm.currency,
            units: farm.units,
          },
        };
      }
      return { ...prev, currentFarmId: farmId };
    });
  };

  const setCurrentHerd = (herdId: string) => {
    setData(prev => {
      const herd = prev.herds.find(h => h.id === herdId);
      if (herd) {
        return {
          ...prev,
          currentHerdId: herdId,
          // Sync with legacy herdData
          herdData: {
            totalAnimals: herd.totalAnimals,
            lactatingCows: herd.lactatingCows,
            heifers: herd.heifers,
          },
        };
      }
      return { ...prev, currentHerdId: herdId };
    });
  };

  return (
    <AppContext.Provider
      value={{
        data,
        updateFarmSetup,
        updateHerdData,
        updateMilkData,
        updateFeedItems,
        updateCosts,
        updateOtherRevenue,
        updateTarget,
        updatePreCalculatedParams,
        completeOnboarding,
        addMonthlySnapshot,
        resetData,
        // New methods for farms, herds, and animals
        addFarm,
        updateFarm,
        addHerd,
        updateHerd,
        addAnimal,
        updateAnimal,
        setCurrentFarm,
        setCurrentHerd,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}