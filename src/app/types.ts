export interface FarmSetup {
  farmName: string;
  currency: string;
  units: 'kg' | 'lb';
}

// New detailed Farm entity
export interface Farm {
  id: string;
  farmName: string;
  location: string;
  farmSize: string; // in acres/hectares
  establishedYear: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  farmIdCode: string;
  typeOfFarm: string; // e.g., "Dairy", "Mixed", etc.
  currency: string;
  units: 'kg' | 'lb';
}

// New Herd entity
export interface Herd {
  id: string;
  farmId: string;
  herdName: string;
  breedType: string;
  totalAnimals: number;
  lactatingCows: number;
  heifers: number;
  breedingMethod: string; // e.g., "AI", "Natural", "Both"
  dateEstablished: string;
}

// New Animal entity
export interface Animal {
  id: string;
  herdId: string;
  tagId: string;
  animalType: string; // "Cow", "Heifer", "Bull", "Calf"
  breed: string;
  dateOfBirth: string;
  gender: string;
  damId?: string;
  sireId?: string;
  purchaseOrBorn: 'Purchase' | 'Born on farm';
  dateOfEntry: string;
  source?: string;
  purchasePrice?: number;
  currentWeight?: number;
  healthStatus?: string;
}

// Legacy HerdData interface for backward compatibility
export interface HerdData {
  totalAnimals: number;
  lactatingCows: number;
  heifers: number;
}

export interface MilkData {
  avgMilkPerCow: number; // litres per day
  milkPrice: number; // per litre (average)
  milkPriceCooperative?: number;
  milkPriceIndividuals?: number;
  milkPriceInstitutions?: number;
}

export interface FeedItem {
  id: string;
  type: string;
  quantityPerCow: number; // kg per day
  pricePerKg: number;
  // Detailed feed configuration
  saleUnit?: '50kg' | '70kg' | '2kg' | '5kg' | 'bale' | 'bundle' | 'custom';
  totalPrice?: number;
  currentAmountFedPerCow?: number;
  numberOfCowsFedPerBlock?: number;
  numberOfDaysPerBlock?: number;
  weightOfBale?: number;
  measurementUnit?: string;
  numberOfUnitsFedPerCow?: number;
}

export interface CostsData {
  labor: number;
  breeding: number;
  health: number;
  // Detailed breeding costs
  numberOfAIServices?: number;
  costPerAIService?: number;
  costOfPregnancyDiagnosis?: number;
  numberOfCowsDiagnosedForPregnancy?: number;
  // Calf feeding costs (part of breeding)
  calfFeedingMilk?: number;
  calfFeedingMilkReplacer?: number;
  calfFeedingPellet?: number;
  // Detailed labor costs
  numberOfWorkers?: number;
  monthlyWageRateEmployee?: number;
  numberOfManagers?: number;
  monthlyWageRateManager?: number;
}

export interface OtherRevenue {
  manure: number;
  bullCalves: number;
  heifers: number;
  cows: number;
  bulls: number;
  // Detailed assumptions
  manurePricePerKg?: number;
  manureKgPerCowPerDay?: number;
  bullCalvesPerYear?: number;
  bullCalfPrice?: number;
  heifersPerYear?: number;
  heiferPrice?: number;
  cowsPerYear?: number;
  cowPrice?: number;
  bullsPerYear?: number;
  bullPrice?: number;
}

export interface TargetData {
  type: 'milkIncrease' | 'profitTarget';
  value: number; // percentage for milk or amount for profit
}

export interface CalculatedMetrics {
  totalRevenue: number;
  totalCost: number;
  profit: number;
  costPerLitre: number;
  avgMilkPerCow: number;
  totalMilkPerDay: number;
  totalMilkPerMonth: number;
  totalMilkPerYear: number;
  milkRevenue: number;
  feedCost: number;
  lactatingPercentage: number;
}

export interface MonthlySnapshot {
  month: string;
  date: string;
  metrics: CalculatedMetrics;
  herdData: HerdData;
  milkData: MilkData;
}

export interface AppData {
  onboardingComplete: boolean;
  farmSetup: FarmSetup;
  herdData: HerdData;
  milkData: MilkData;
  feedItems: FeedItem[];
  costs: CostsData;
  otherRevenue: OtherRevenue;
  target: TargetData | null;
  history: MonthlySnapshot[];
  preCalculatedParams?: PreCalculatedParams;
  // New entity collections
  farms: Farm[];
  herds: Herd[];
  animals: Animal[];
  currentFarmId?: string;
  currentHerdId?: string;
}

export interface PreCalculatedParams {
  // Reference financial period
  daysInYear: number;
  monthsInYear: number;
  weeksInYear: number;
  
  // Herd management
  recommendedLactatingPercentage: number;
  recommendedMilkYieldIncrease: number;
  daysOpen: number;
  gestationPeriod: number;
  recommendedCalvingInterval: number;
  lengthOfDryingPeriod: number;
  
  // Weight approximations
  cowWeightAdjustmentFactor: number;
  cowWeightLessConstant: number;
  heiferWeightAdjustmentFactor: number;
  heiferWeightLessConstant: number;
  
  // Manure
  amountOfCowdungPerCowPerDay: number;
  
  // Concentrate feeding recommendations (kg per milk range)
  concentrateLessThan7Litres: number;
  concentrate7To10Litres: number;
  concentrate10To13Litres: number;
  concentrate13To16Litres: number;
  concentrate16To20Litres: number;
  concentrateAbove20Litres: number;
  
  // Forage combinations
  forageCombination1: string; // e.g., "chopped hay, silage"
  forageCombination2: string; // e.g., "chopped hay, Nappier grass"
  forageCombination3: string; // e.g., "chopped hay, legume"
  forageCombination4: string; // e.g., "Nappier grass/brachiaria, legume"
  
  // Health management
  recommendedHealthVisitsPerYear: number;
  recommendedDewormingFrequencyPerYear: number;
  recommendedTickControlFrequencyPerWeek: number;
  
  // Calf feeding
  totalMilkFedToCalves: number;
  numberOfMilkFeedingDays: number;
  
  // Other costs
  recommendedAIServicesPerConception: number;
  insurancePremium: number;
  costOfTransportPerLitre: number;
}

export interface Recommendation {
  type: 'milk' | 'breeding' | 'feed';
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  impact: string;
}