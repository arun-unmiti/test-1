// ─── OVERVIEW SUMMARY CARDS ──────────────────────────────────────────────────
export const summaryStats = {
  totalFarms: 24,
  totalHerds: 67,
  totalAnimals: 842,
  totalMilkProductionLitersPerDay: 6480,
  totalSalesMonthly: 1_248_000,
  totalBreedingCostMonthly: 156_000,
  totalIncomeMonthly: 1_620_000,
  totalCostMonthly: 1_134_000,
  profitLossMonthly: 486_000,
};

// ─── MONTHLY MILK PRODUCTION (last 12 months) ─────────────────────────────────
export const monthlyMilkProduction = [
  { month: 'Apr', production: 178400, target: 175000, avgFarmer: 162000 },
  { month: 'May', production: 182600, target: 175000, avgFarmer: 165000 },
  { month: 'Jun', production: 176800, target: 175000, avgFarmer: 160000 },
  { month: 'Jul', production: 171200, target: 175000, avgFarmer: 158000 },
  { month: 'Aug', production: 168900, target: 175000, avgFarmer: 156000 },
  { month: 'Sep', production: 174500, target: 175000, avgFarmer: 160000 },
  { month: 'Oct', production: 181300, target: 175000, avgFarmer: 163000 },
  { month: 'Nov', production: 186700, target: 175000, avgFarmer: 167000 },
  { month: 'Dec', production: 192400, target: 175000, avgFarmer: 170000 },
  { month: 'Jan', production: 189100, target: 180000, avgFarmer: 172000 },
  { month: 'Feb', production: 194600, target: 180000, avgFarmer: 175000 },
  { month: 'Mar', production: 198200, target: 180000, avgFarmer: 178000 },
];

// ─── MILK PRICE COMPARISON ────────────────────────────────────────────────────
export const milkPriceStats = {
  regionalAvgPrice: 48.5,
  farmersAboveAvg: 14,
  farmersBelowAvg: 10,
};

// ─── MONTHLY SALES BY CATEGORY ────────────────────────────────────────────────
export const monthlySalesByCategory = [
  { month: 'Apr', milk: 820000, animals: 145000, manure: 62000 },
  { month: 'May', milk: 854000, animals: 120000, manure: 68000 },
  { month: 'Jun', milk: 832000, animals: 180000, manure: 58000 },
  { month: 'Jul', milk: 808000, animals: 95000, manure: 55000 },
  { month: 'Aug', milk: 796000, animals: 110000, manure: 52000 },
  { month: 'Sep', milk: 820000, animals: 165000, manure: 60000 },
  { month: 'Oct', milk: 848000, animals: 140000, manure: 64000 },
  { month: 'Nov', milk: 872000, animals: 195000, manure: 70000 },
  { month: 'Dec', milk: 910000, animals: 220000, manure: 76000 },
  { month: 'Jan', milk: 895000, animals: 130000, manure: 72000 },
  { month: 'Feb', milk: 918000, animals: 115000, manure: 74000 },
  { month: 'Mar', milk: 942000, animals: 160000, manure: 78000 },
];

export const salesPriceStats = {
  avgSellingPrice: 52.4,
  regionalAvgPrice: 48.5,
  farmersAboveAvg: 16,
  farmersBelowAvg: 8,
};

// ─── INCOME BREAKDOWN (current month) ─────────────────────────────────────────
export const incomeBreakdown = [
  { name: 'Milk Sales', value: 942000, color: '#16a34a' },
  { name: 'Animal Sales', value: 160000, color: '#3b82f6' },
  { name: 'Manure', value: 78000, color: '#f97316' },
  { name: 'Other', value: 42000, color: '#8b5cf6' },
];

// ─── COST BREAKDOWN ───────────────────────────────────────────────────────────
export const costBreakdown = [
  { name: 'Feed', value: 648000, color: '#f97316' },
  { name: 'Labor', value: 216000, color: '#3b82f6' },
  { name: 'Breeding', value: 156000, color: '#8b5cf6' },
  { name: 'Health & Vet', value: 84000, color: '#ef4444' },
  { name: 'Transport', value: 30000, color: '#14b8a6' },
];

// ─── FEEDING COST TIMELINE ─────────────────────────────────────────────────────
export const monthlyFeedingCost = [
  { month: 'Apr', concentrate: 320000, forage: 180000, minerals: 42000 },
  { month: 'May', concentrate: 334000, forage: 185000, minerals: 44000 },
  { month: 'Jun', concentrate: 328000, forage: 192000, minerals: 41000 },
  { month: 'Jul', concentrate: 312000, forage: 188000, minerals: 38000 },
  { month: 'Aug', concentrate: 305000, forage: 178000, minerals: 36000 },
  { month: 'Sep', concentrate: 318000, forage: 182000, minerals: 39000 },
  { month: 'Oct', concentrate: 336000, forage: 190000, minerals: 42000 },
  { month: 'Nov', concentrate: 352000, forage: 196000, minerals: 45000 },
  { month: 'Dec', concentrate: 368000, forage: 204000, minerals: 48000 },
  { month: 'Jan', concentrate: 358000, forage: 200000, minerals: 46000 },
  { month: 'Feb', concentrate: 374000, forage: 208000, minerals: 49000 },
  { month: 'Mar', concentrate: 388000, forage: 214000, minerals: 52000 },
];

// ─── PROFIT / LOSS TIMELINE ───────────────────────────────────────────────────
export const monthlyProfitLoss = [
  { month: 'Apr', actual: 245000, baseline: 200000 },
  { month: 'May', actual: 278000, baseline: 200000 },
  { month: 'Jun', actual: 234000, baseline: 200000 },
  { month: 'Jul', actual: 198000, baseline: 200000 },
  { month: 'Aug', actual: 182000, baseline: 200000 },
  { month: 'Sep', actual: 231000, baseline: 200000 },
  { month: 'Oct', actual: 268000, baseline: 210000 },
  { month: 'Nov', actual: 312000, baseline: 210000 },
  { month: 'Dec', actual: 356000, baseline: 210000 },
  { month: 'Jan', actual: 334000, baseline: 210000 },
  { month: 'Feb', actual: 368000, baseline: 215000 },
  { month: 'Mar', actual: 486000, baseline: 215000 },
];

// ─── FARMER PROFILES ──────────────────────────────────────────────────────────
export const farmerProfiles = [
  {
    id: 'fp1', name: 'John Mwangi', farm: 'Green Valley Farm', phone: '+254 712 345 678',
    location: 'Nakuru', level1: 'Rift Valley', level2: 'Nakuru County', level3: 'Nakuru Town',
    herds: 2, animals: 45, lactatingCows: 32, milkPerCowPerDay: 14.2,
    milkPrice: 52, regionalAvgPrice: 48.5,
    monthlyIncome: 71500, monthlyCost: 48200, monthlyProfit: 23300,
    status: 'active',
  },
  {
    id: 'fp2', name: 'Mary Wanjiku', farm: 'Sunrise Dairy', phone: '+254 723 456 789',
    location: 'Nakuru', level1: 'Rift Valley', level2: 'Nakuru County', level3: 'Gilgil',
    herds: 3, animals: 67, lactatingCows: 48, milkPerCowPerDay: 16.8,
    milkPrice: 55, regionalAvgPrice: 48.5,
    monthlyIncome: 120960, monthlyCost: 78400, monthlyProfit: 42560,
    status: 'active',
  },
  {
    id: 'fp3', name: 'Peter Kamau', farm: 'Highland Dairy', phone: '+254 734 567 890',
    location: 'Eldoret', level1: 'Rift Valley', level2: 'Uasin Gishu', level3: 'Eldoret',
    herds: 1, animals: 28, lactatingCows: 18, milkPerCowPerDay: 11.5,
    milkPrice: 44, regionalAvgPrice: 48.5,
    monthlyIncome: 24840, monthlyCost: 19200, monthlyProfit: 5640,
    status: 'active',
  },
  {
    id: 'fp4', name: 'Grace Njoroge', farm: 'Fertile Fields', phone: '+254 745 678 901',
    location: 'Naivasha', level1: 'Rift Valley', level2: 'Nakuru County', level3: 'Naivasha',
    herds: 4, animals: 112, lactatingCows: 78, milkPerCowPerDay: 18.4,
    milkPrice: 56, regionalAvgPrice: 48.5,
    monthlyIncome: 257068, monthlyCost: 168500, monthlyProfit: 88568,
    status: 'active',
  },
  {
    id: 'fp5', name: 'David Ochieng', farm: 'Lakeview Farm', phone: '+254 756 789 012',
    location: 'Kisumu', level1: 'Nyanza', level2: 'Kisumu County', level3: 'Kisumu City',
    herds: 2, animals: 38, lactatingCows: 24, milkPerCowPerDay: 10.2,
    milkPrice: 42, regionalAvgPrice: 46.0,
    monthlyIncome: 29376, monthlyCost: 26800, monthlyProfit: 2576,
    status: 'active',
  },
  {
    id: 'fp6', name: 'Agnes Chepkoech', farm: 'Kapkures Dairy', phone: '+254 767 890 123',
    location: 'Kericho', level1: 'Rift Valley', level2: 'Kericho County', level3: 'Kericho Town',
    herds: 3, animals: 89, lactatingCows: 62, milkPerCowPerDay: 19.6,
    milkPrice: 58, regionalAvgPrice: 50.0,
    monthlyIncome: 219072, monthlyCost: 142000, monthlyProfit: 77072,
    status: 'active',
  },
];

// ─── DATA MANAGEMENT: FARMS ───────────────────────────────────────────────────
export const farmsData = [
  { id: 'F001', name: 'Green Valley Farm', owner: 'John Mwangi', location: 'Nakuru', level1: 'Rift Valley', level2: 'Nakuru County', size: '12 acres', registered: '2022-03-15', status: 'active' },
  { id: 'F002', name: 'Sunrise Dairy', owner: 'Mary Wanjiku', location: 'Gilgil', level1: 'Rift Valley', level2: 'Nakuru County', size: '8 acres', registered: '2021-07-22', status: 'active' },
  { id: 'F003', name: 'Highland Dairy', owner: 'Peter Kamau', location: 'Eldoret', level1: 'Rift Valley', level2: 'Uasin Gishu', size: '6 acres', registered: '2023-01-10', status: 'active' },
  { id: 'F004', name: 'Fertile Fields', owner: 'Grace Njoroge', location: 'Naivasha', level1: 'Rift Valley', level2: 'Nakuru County', size: '22 acres', registered: '2020-11-05', status: 'active' },
  { id: 'F005', name: 'Lakeview Farm', owner: 'David Ochieng', location: 'Kisumu', level1: 'Nyanza', level2: 'Kisumu County', size: '9 acres', registered: '2022-08-18', status: 'active' },
  { id: 'F006', name: 'Kapkures Dairy', owner: 'Agnes Chepkoech', location: 'Kericho', level1: 'Rift Valley', level2: 'Kericho County', size: '18 acres', registered: '2021-04-30', status: 'active' },
  { id: 'F007', name: 'Maasai Mara Farm', owner: 'Samuel Lemayian', location: 'Narok', level1: 'Rift Valley', level2: 'Narok County', size: '30 acres', registered: '2022-06-14', status: 'active' },
  { id: 'F008', name: 'Aberdare Dairy', owner: 'Ruth Ngugi', location: 'Nyeri', level1: 'Central', level2: 'Nyeri County', size: '5 acres', registered: '2023-03-22', status: 'inactive' },
];

// ─── DATA MANAGEMENT: HERDS ───────────────────────────────────────────────────
export const herdsData = [
  { id: 'H001', farmId: 'F001', farmName: 'Green Valley Farm', name: 'Herd A', breed: 'Friesian', totalAnimals: 25, lactating: 18, dry: 4, heifers: 3, lastUpdated: '2026-03-01', status: 'active' },
  { id: 'H002', farmId: 'F001', farmName: 'Green Valley Farm', name: 'Herd B', breed: 'Ayrshire', totalAnimals: 20, lactating: 14, dry: 3, heifers: 3, lastUpdated: '2026-03-01', status: 'active' },
  { id: 'H003', farmId: 'F002', farmName: 'Sunrise Dairy', name: 'Main Herd', breed: 'Friesian', totalAnimals: 35, lactating: 26, dry: 5, heifers: 4, lastUpdated: '2026-02-28', status: 'active' },
  { id: 'H004', farmId: 'F002', farmName: 'Sunrise Dairy', name: 'Young Stock', breed: 'Crossbred', totalAnimals: 18, lactating: 10, dry: 2, heifers: 6, lastUpdated: '2026-02-28', status: 'active' },
  { id: 'H005', farmId: 'F003', farmName: 'Highland Dairy', name: 'Herd 1', breed: 'Guernsey', totalAnimals: 28, lactating: 18, dry: 4, heifers: 6, lastUpdated: '2026-03-02', status: 'active' },
  { id: 'H006', farmId: 'F004', farmName: 'Fertile Fields', name: 'Herd Alpha', breed: 'Friesian', totalAnimals: 45, lactating: 34, dry: 6, heifers: 5, lastUpdated: '2026-03-03', status: 'active' },
  { id: 'H007', farmId: 'F004', farmName: 'Fertile Fields', name: 'Herd Beta', breed: 'Jersey', totalAnimals: 30, lactating: 22, dry: 4, heifers: 4, lastUpdated: '2026-03-03', status: 'active' },
  { id: 'H008', farmId: 'F005', farmName: 'Lakeview Farm', name: 'Lakeview Herd', breed: 'Ayrshire', totalAnimals: 38, lactating: 24, dry: 7, heifers: 7, lastUpdated: '2026-03-01', status: 'active' },
];

// ─── DATA MANAGEMENT: ANIMALS ────────────────────────────────────────────────
export const animalsData = [
  { id: 'A001', tag: 'KE-001-2021', herdId: 'H001', herdName: 'Herd A', farmName: 'Green Valley Farm', name: 'Daisy', breed: 'Friesian', age: '4y 2m', gender: 'Female', status: 'Lactating', milkYield: 16.5, calvingDate: '2025-10-12', weight: 520 },
  { id: 'A002', tag: 'KE-002-2021', herdId: 'H001', herdName: 'Herd A', farmName: 'Green Valley Farm', name: 'Rosie', breed: 'Friesian', age: '5y 1m', gender: 'Female', status: 'Lactating', milkYield: 14.8, calvingDate: '2025-08-20', weight: 545 },
  { id: 'A003', tag: 'KE-003-2022', herdId: 'H001', herdName: 'Herd A', farmName: 'Green Valley Farm', name: 'Bella', breed: 'Friesian', age: '3y 6m', gender: 'Female', status: 'Dry', milkYield: 0, calvingDate: '2026-04-10', weight: 498 },
  { id: 'A004', tag: 'KE-004-2020', herdId: 'H002', herdName: 'Herd B', farmName: 'Green Valley Farm', name: 'Lucy', breed: 'Ayrshire', age: '6y 0m', gender: 'Female', status: 'Lactating', milkYield: 12.2, calvingDate: '2025-11-05', weight: 480 },
  { id: 'A005', tag: 'KE-005-2023', herdId: 'H002', herdName: 'Herd B', farmName: 'Green Valley Farm', name: 'Heifer-1', breed: 'Ayrshire', age: '1y 8m', gender: 'Female', status: 'Heifer', milkYield: 0, calvingDate: null, weight: 320 },
  { id: 'A006', tag: 'KE-006-2021', herdId: 'H003', herdName: 'Main Herd', farmName: 'Sunrise Dairy', name: 'Molly', breed: 'Friesian', age: '4y 5m', gender: 'Female', status: 'Lactating', milkYield: 18.4, calvingDate: '2025-09-30', weight: 560 },
  { id: 'A007', tag: 'KE-007-2021', herdId: 'H003', herdName: 'Main Herd', farmName: 'Sunrise Dairy', name: 'Stella', breed: 'Friesian', age: '4y 8m', gender: 'Female', status: 'Lactating', milkYield: 17.6, calvingDate: '2025-10-18', weight: 552 },
  { id: 'A008', tag: 'KE-008-2023', herdId: 'H004', herdName: 'Young Stock', farmName: 'Sunrise Dairy', name: 'Calf-1', breed: 'Crossbred', age: '0y 4m', gender: 'Female', status: 'Calf', milkYield: 0, calvingDate: null, weight: 85 },
];

// ─── DATA MANAGEMENT: MILK PRODUCTION ────────────────────────────────────────
export const milkProductionData = [
  { id: 'MP001', farmName: 'Green Valley Farm', herdName: 'Herd A', date: '2026-03-05', session: 'Morning', volumeLitres: 142.5, pricePerLitre: 52, totalValue: 7410, buyer: 'Cooperative', quality: 'Grade A' },
  { id: 'MP002', farmName: 'Green Valley Farm', herdName: 'Herd A', date: '2026-03-05', session: 'Evening', volumeLitres: 108.2, pricePerLitre: 50, totalValue: 5410, buyer: 'Individual', quality: 'Grade A' },
  { id: 'MP003', farmName: 'Sunrise Dairy', herdName: 'Main Herd', date: '2026-03-05', session: 'Morning', volumeLitres: 220.4, pricePerLitre: 55, totalValue: 12122, buyer: 'Institution', quality: 'Grade A' },
  { id: 'MP004', farmName: 'Sunrise Dairy', herdName: 'Main Herd', date: '2026-03-05', session: 'Evening', volumeLitres: 168.8, pricePerLitre: 55, totalValue: 9284, buyer: 'Institution', quality: 'Grade A' },
  { id: 'MP005', farmName: 'Highland Dairy', herdName: 'Herd 1', date: '2026-03-05', session: 'Morning', volumeLitres: 98.6, pricePerLitre: 44, totalValue: 4338, buyer: 'Individual', quality: 'Grade B' },
  { id: 'MP006', farmName: 'Fertile Fields', herdName: 'Herd Alpha', date: '2026-03-04', session: 'Morning', volumeLitres: 312.8, pricePerLitre: 56, totalValue: 17517, buyer: 'Cooperative', quality: 'Grade A' },
  { id: 'MP007', farmName: 'Lakeview Farm', herdName: 'Lakeview Herd', date: '2026-03-04', session: 'Morning', volumeLitres: 128.4, pricePerLitre: 42, totalValue: 5393, buyer: 'Individual', quality: 'Grade B' },
  { id: 'MP008', farmName: 'Kapkures Dairy', herdName: 'Herd 1', date: '2026-03-04', session: 'Morning', volumeLitres: 284.6, pricePerLitre: 58, totalValue: 16507, buyer: 'Institution', quality: 'Grade A' },
];

// ─── DATA MANAGEMENT: SALES ───────────────────────────────────────────────────
export const salesData = [
  { id: 'S001', farmName: 'Green Valley Farm', date: '2026-03-01', category: 'Milk', item: 'Fresh Milk', quantity: 3200, unit: 'Litres', unitPrice: 52, totalAmount: 166400, buyer: 'Nakuru Cooperative', status: 'Completed' },
  { id: 'S002', farmName: 'Sunrise Dairy', date: '2026-03-02', category: 'Animal', item: 'Heifer (18 months)', quantity: 1, unit: 'Head', unitPrice: 85000, totalAmount: 85000, buyer: 'Direct Sale', status: 'Completed' },
  { id: 'S003', farmName: 'Fertile Fields', date: '2026-03-03', category: 'Milk', item: 'Fresh Milk', quantity: 9480, unit: 'Litres', unitPrice: 56, totalAmount: 530880, buyer: 'KCC Institution', status: 'Completed' },
  { id: 'S004', farmName: 'Highland Dairy', date: '2026-03-04', category: 'Manure', item: 'Organic Compost', quantity: 2400, unit: 'Kg', unitPrice: 8, totalAmount: 19200, buyer: 'Local Market', status: 'Completed' },
  { id: 'S005', farmName: 'Kapkures Dairy', date: '2026-03-04', category: 'Animal', item: 'Bull Calf (3 months)', quantity: 2, unit: 'Head', unitPrice: 15000, totalAmount: 30000, buyer: 'Direct Sale', status: 'Completed' },
  { id: 'S006', farmName: 'Lakeview Farm', date: '2026-03-05', category: 'Milk', item: 'Fresh Milk', quantity: 2880, unit: 'Litres', unitPrice: 42, totalAmount: 120960, buyer: 'Individual', status: 'Pending' },
  { id: 'S007', farmName: 'Sunrise Dairy', date: '2026-03-05', category: 'Milk', item: 'Fresh Milk', quantity: 5640, unit: 'Litres', unitPrice: 55, totalAmount: 310200, buyer: 'KCC Institution', status: 'Completed' },
  { id: 'S008', farmName: 'Green Valley Farm', date: '2026-03-05', category: 'Animal', item: 'Cow (5 years)', quantity: 1, unit: 'Head', unitPrice: 95000, totalAmount: 95000, buyer: 'Direct Sale', status: 'Pending' },
];

// ─── DATA MANAGEMENT: COSTS ───────────────────────────────────────────────────
export const costsData = [
  { id: 'C001', farmName: 'Green Valley Farm', date: '2026-03-01', category: 'Feeding', subCategory: 'Concentrate Feed', description: 'Dairy Meal 25kg x 120 bags', quantity: 3000, unit: 'Kg', unitCost: 55, totalCost: 165000 },
  { id: 'C002', farmName: 'Green Valley Farm', date: '2026-03-01', category: 'Labor', subCategory: 'Employee Wages', description: '3 Farm workers - March salary', quantity: 3, unit: 'Months', unitCost: 15000, totalCost: 45000 },
  { id: 'C003', farmName: 'Sunrise Dairy', date: '2026-03-02', category: 'Breeding', subCategory: 'AI Service', description: 'Artificial Insemination x 4 cows', quantity: 4, unit: 'Services', unitCost: 3500, totalCost: 14000 },
  { id: 'C004', farmName: 'Fertile Fields', date: '2026-03-03', category: 'Feeding', subCategory: 'Forage', description: 'Napier Grass hay bales', quantity: 180, unit: 'Bales', unitCost: 450, totalCost: 81000 },
  { id: 'C005', farmName: 'Highland Dairy', date: '2026-03-03', category: 'Health', subCategory: 'Veterinary', description: 'Quarterly health check - 28 animals', quantity: 28, unit: 'Animals', unitCost: 800, totalCost: 22400 },
  { id: 'C006', farmName: 'Kapkures Dairy', date: '2026-03-04', category: 'Breeding', subCategory: 'Calf Feeding', description: 'Milk replacer for 6 calves', quantity: 90, unit: 'Kg', unitCost: 280, totalCost: 25200 },
  { id: 'C007', farmName: 'Lakeview Farm', date: '2026-03-04', category: 'Labor', subCategory: 'Manager Salary', description: 'Farm manager - March', quantity: 1, unit: 'Month', unitCost: 35000, totalCost: 35000 },
  { id: 'C008', farmName: 'Sunrise Dairy', date: '2026-03-05', category: 'Feeding', subCategory: 'Minerals', description: 'Mineral licks x 24 blocks', quantity: 24, unit: 'Blocks', unitCost: 850, totalCost: 20400 },
];

// ─── DATA MANAGEMENT: ADVISORIES ─────────────────────────────────────────────
export const advisoriesData = [
  { id: 'ADV001', farmName: 'Highland Dairy', farmer: 'Peter Kamau', date: '2026-03-04', category: 'Milk Production', priority: 'High', title: 'Below average milk yield', message: 'Your average milk yield of 11.5L/cow/day is below the regional average of 14.8L. Consider increasing concentrate feed from 3kg to 5kg per cow.', status: 'Open', advisorName: 'Dr. Sarah Kimani' },
  { id: 'ADV002', farmName: 'Lakeview Farm', farmer: 'David Ochieng', date: '2026-03-03', category: 'Profitability', priority: 'Medium', title: 'Selling below average price', message: 'You are selling milk at KES 42/L while the regional average is KES 46/L. Consider joining a cooperative to improve pricing.', status: 'Open', advisorName: 'Tom Otieno' },
  { id: 'ADV003', farmName: 'Green Valley Farm', farmer: 'John Mwangi', date: '2026-03-02', category: 'Health', priority: 'High', title: 'Vaccination overdue', message: 'FMD vaccination for Herd B is overdue by 3 weeks. Please schedule immediately to avoid disease risk.', status: 'Acknowledged', advisorName: 'Dr. James Mugo' },
  { id: 'ADV004', farmName: 'Sunrise Dairy', farmer: 'Mary Wanjiku', date: '2026-03-01', category: 'Breeding', priority: 'Low', title: 'Calving interval improvement', message: 'Your average calving interval of 14.2 months is close to optimal. Maintain current AI protocol.', status: 'Resolved', advisorName: 'Dr. Sarah Kimani' },
  { id: 'ADV005', farmName: 'Fertile Fields', farmer: 'Grace Njoroge', date: '2026-02-28', category: 'Feeding', priority: 'Medium', title: 'Feed cost optimization', message: 'Feed cost is 45% of total costs. Recommended threshold is 40%. Consider growing own Napier grass to reduce costs.', status: 'Open', advisorName: 'Tom Otieno' },
  { id: 'ADV006', farmName: 'Kapkures Dairy', farmer: 'Agnes Chepkoech', date: '2026-02-27', category: 'Milk Production', priority: 'Low', title: 'Excellent performance', message: 'Congratulations! Your milk yield of 19.6L/cow/day is the highest in the region. You qualify for the premium tier pricing.', status: 'Resolved', advisorName: 'Dr. Sarah Kimani' },
];

// ─── USER MANAGEMENT: USERS ───────────────────────────────────────────────────
export const usersData = [
  { id: 'U001', name: 'Admin User', email: 'admin@dairypro.com', phone: '+254 700 000 001', role: 'Admin', country: 'Kenya', level1: 'All Regions', level2: '', level3: '', lastLogin: '2026-03-05', status: 'active', createdAt: '2021-01-01' },
  { id: 'U002', name: 'Jane Supervisor', email: 'jane@dairypro.com', phone: '+254 700 000 002', role: 'Supervisor', country: 'Kenya', level1: 'Rift Valley', level2: 'Nakuru County', level3: '', lastLogin: '2026-03-04', status: 'active', createdAt: '2022-03-15' },
  { id: 'U003', name: 'Tom Field Officer', email: 'tom@dairypro.com', phone: '+254 700 000 003', role: 'Field Officer', country: 'Kenya', level1: 'Rift Valley', level2: 'Nakuru County', level3: 'Nakuru Town', lastLogin: '2026-03-05', status: 'active', createdAt: '2022-06-20' },
  { id: 'U004', name: 'Alice Extension', email: 'alice@dairypro.com', phone: '+254 700 000 004', role: 'Field Officer', country: 'Kenya', level1: 'Rift Valley', level2: 'Kericho County', level3: 'Kericho Town', lastLogin: '2026-03-03', status: 'active', createdAt: '2023-01-10' },
  { id: 'U005', name: 'Bob Advisor', email: 'bob@dairypro.com', phone: '+254 700 000 005', role: 'Supervisor', country: 'Kenya', level1: 'Nyanza', level2: 'Kisumu County', level3: '', lastLogin: '2026-02-28', status: 'inactive', createdAt: '2021-09-05' },
  { id: 'U006', name: 'Carol Data', email: 'carol@dairypro.com', phone: '+254 700 000 006', role: 'Field Officer', country: 'Kenya', level1: 'Central', level2: 'Nyeri County', level3: 'Nyeri Town', lastLogin: '2026-03-01', status: 'active', createdAt: '2023-05-22' },
  { id: 'U007', name: 'Dr. Sarah Kimani', email: 'sarah@dairypro.com', phone: '+254 700 000 007', role: 'Veterinarian', country: 'Kenya', level1: 'Rift Valley', level2: 'All Counties', level3: '', lastLogin: '2026-03-05', status: 'active', createdAt: '2022-02-14' },
  { id: 'U008', name: 'Michael Ops', email: 'michael@dairypro.com', phone: '+254 700 000 008', role: 'Field Officer', country: 'Kenya', level1: 'Rift Valley', level2: 'Uasin Gishu', level3: 'Eldoret', lastLogin: '2026-01-15', status: 'inactive', createdAt: '2021-11-30' },
];

// ─── USER MANAGEMENT: LOCATIONS ───────────────────────────────────────────────
export const countriesData = [
  { id: 'CN001', name: 'Kenya', code: 'KE', region: 'East Africa', totalFarms: 24, activeUsers: 18, status: 'active' },
  { id: 'CN002', name: 'Uganda', code: 'UG', region: 'East Africa', totalFarms: 0, activeUsers: 0, status: 'inactive' },
  { id: 'CN003', name: 'Tanzania', code: 'TZ', region: 'East Africa', totalFarms: 0, activeUsers: 0, status: 'inactive' },
];

export const level1Data = [
  { id: 'L1001', countryId: 'CN001', countryName: 'Kenya', name: 'Rift Valley', totalFarms: 18, activeUsers: 14, status: 'active' },
  { id: 'L1002', countryId: 'CN001', countryName: 'Kenya', name: 'Nyanza', totalFarms: 3, activeUsers: 2, status: 'active' },
  { id: 'L1003', countryId: 'CN001', countryName: 'Kenya', name: 'Central', totalFarms: 2, activeUsers: 1, status: 'active' },
  { id: 'L1004', countryId: 'CN001', countryName: 'Kenya', name: 'Eastern', totalFarms: 1, activeUsers: 1, status: 'active' },
];

export const level2Data = [
  { id: 'L2001', level1Id: 'L1001', level1Name: 'Rift Valley', name: 'Nakuru County', totalFarms: 10, activeUsers: 8, status: 'active' },
  { id: 'L2002', level1Id: 'L1001', level1Name: 'Rift Valley', name: 'Uasin Gishu', totalFarms: 4, activeUsers: 3, status: 'active' },
  { id: 'L2003', level1Id: 'L1001', level1Name: 'Rift Valley', name: 'Kericho County', totalFarms: 3, activeUsers: 2, status: 'active' },
  { id: 'L2004', level1Id: 'L1001', level1Name: 'Rift Valley', name: 'Narok County', totalFarms: 1, activeUsers: 1, status: 'active' },
  { id: 'L2005', level1Id: 'L1002', level1Name: 'Nyanza', name: 'Kisumu County', totalFarms: 3, activeUsers: 2, status: 'active' },
  { id: 'L2006', level1Id: 'L1003', level1Name: 'Central', name: 'Nyeri County', totalFarms: 2, activeUsers: 1, status: 'active' },
];

export const level3Data = [
  { id: 'L3001', level2Id: 'L2001', level2Name: 'Nakuru County', name: 'Nakuru Town', totalFarms: 5, activeUsers: 4, status: 'active' },
  { id: 'L3002', level2Id: 'L2001', level2Name: 'Nakuru County', name: 'Gilgil', totalFarms: 3, activeUsers: 2, status: 'active' },
  { id: 'L3003', level2Id: 'L2001', level2Name: 'Nakuru County', name: 'Naivasha', totalFarms: 2, activeUsers: 2, status: 'active' },
  { id: 'L3004', level2Id: 'L2002', level2Name: 'Uasin Gishu', name: 'Eldoret', totalFarms: 4, activeUsers: 3, status: 'active' },
  { id: 'L3005', level2Id: 'L2003', level2Name: 'Kericho County', name: 'Kericho Town', totalFarms: 3, activeUsers: 2, status: 'active' },
  { id: 'L3006', level2Id: 'L2005', level2Name: 'Kisumu County', name: 'Kisumu City', totalFarms: 3, activeUsers: 2, status: 'active' },
];
