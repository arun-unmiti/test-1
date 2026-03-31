import { useState } from 'react';
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  MapPin, Phone, Beef, Droplets, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, ChevronDown, Building2,
} from 'lucide-react';
import { farmerProfiles } from '../../data/mockData';

const fmt = (n: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat('en').format(n);

// Regional averages
const regionalAvg = {
  milkPerCowPerDay: 14.8,
  milkPrice: 48.5,
  monthlyProfit: 39600,
  lactatingPct: 71,
  animalsPerFarm: 35,
};

const comparisonData = farmerProfiles.map(f => ({
  name: f.name.split(' ')[0],
  milkYield: f.milkPerCowPerDay,
  price: f.milkPrice,
  profit: f.monthlyProfit / 1000,
}));

const avgLine = {
  milkYield: regionalAvg.milkPerCowPerDay,
  price: regionalAvg.milkPrice,
  profit: regionalAvg.monthlyProfit / 1000,
};

export function FarmerProfilePage() {
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmerProfiles[0].id);
  const farmer = farmerProfiles.find(f => f.id === selectedFarmerId)!;

  const aboveMilkPrice = farmer.milkPrice >= farmer.regionalAvgPrice;
  const lactatingPct = Math.round((farmer.lactatingCows / farmer.animals) * 100);

  const radarData = [
    { metric: 'Milk Yield', farmer: Math.round((farmer.milkPerCowPerDay / 25) * 100), avg: Math.round((regionalAvg.milkPerCowPerDay / 25) * 100) },
    { metric: 'Milk Price', farmer: Math.round((farmer.milkPrice / 70) * 100), avg: Math.round((regionalAvg.milkPrice / 70) * 100) },
    { metric: 'Profitability', farmer: Math.round((farmer.monthlyProfit / 100000) * 100), avg: Math.round((regionalAvg.monthlyProfit / 100000) * 100) },
    { metric: 'Herd Size', farmer: Math.round((farmer.animals / 120) * 100), avg: Math.round((regionalAvg.animalsPerFarm / 120) * 100) },
    { metric: 'Lactating %', farmer: lactatingPct, avg: regionalAvg.lactatingPct },
  ];

  return (
    <div className="p-6 space-y-8 max-w-screen-2xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Farmer Profile</h1>
          <p className="text-gray-500 text-sm">Individual performance comparison within the region</p>
        </div>

        {/* Farmer Selector */}
        <div className="relative">
          <select
            value={selectedFarmerId}
            onChange={e => setSelectedFarmerId(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          >
            {farmerProfiles.map(f => (
              <option key={f.id} value={f.id}>{f.name} – {f.farm}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Farmer Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {farmer.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-gray-900">{farmer.name}</h2>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                <Building2 className="h-4 w-4" /> {farmer.farm}
              </p>
              <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                <Phone className="h-3 w-3" /> {farmer.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:ml-auto">
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              <MapPin className="h-3.5 w-3.5 text-green-600" />
              <span>{farmer.level3}, {farmer.level2}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium rounded-lg px-3 py-2 ${
              aboveMilkPrice ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}>
              {aboveMilkPrice ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              KES {farmer.milkPrice}/L vs avg KES {farmer.regionalAvgPrice}/L
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{farmer.animals}</p>
            <p className="text-xs text-gray-500 mt-1">Total Animals</p>
            <p className="text-xs text-gray-400">{farmer.herds} herds</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-700">{farmer.milkPerCowPerDay} L</p>
            <p className="text-xs text-gray-500 mt-1">Milk / Cow / Day</p>
            <p className={`text-xs mt-0.5 ${farmer.milkPerCowPerDay >= regionalAvg.milkPerCowPerDay ? 'text-green-600' : 'text-red-500'}`}>
              Avg: {regionalAvg.milkPerCowPerDay} L
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{fmt(farmer.monthlyIncome)}</p>
            <p className="text-xs text-gray-500 mt-1">Monthly Income</p>
            <p className="text-xs text-gray-400">Cost: {fmt(farmer.monthlyCost)}</p>
          </div>
          <div className={`text-center rounded-xl px-4 py-2 ${farmer.monthlyProfit > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-center gap-1">
              {farmer.monthlyProfit > 0 ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
              <p className={`text-2xl font-bold ${farmer.monthlyProfit > 0 ? 'text-green-700' : 'text-red-600'}`}>
                {fmt(farmer.monthlyProfit)}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">Monthly Profit</p>
            <p className={`text-xs mt-0.5 ${farmer.monthlyProfit > regionalAvg.monthlyProfit ? 'text-green-600' : 'text-amber-600'}`}>
              Avg: {fmt(regionalAvg.monthlyProfit)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar: Farmer vs Regional Avg */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-gray-700 mb-4 text-sm font-semibold">Performance vs Regional Average</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <Radar name={farmer.name.split(' ')[0]} dataKey="farmer" stroke="#16a34a" fill="#16a34a" fillOpacity={0.25} strokeWidth={2} />
              <Radar name="Regional Avg" dataKey="avg" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} strokeDasharray="5 3" />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar: Milk Yield Comparison */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-gray-700 mb-4 text-sm font-semibold">Milk Yield — All Farmers vs Average (L/cow/day)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparisonData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 25]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
              <Tooltip formatter={(v) => [`${v} L/cow/day`, 'Yield']} />
              <Bar dataKey="milkYield" fill="#16a34a" radius={[0, 4, 4, 0]} name="Milk Yield">
                {comparisonData.map((entry, i) => (
                  <rect key={i} fill={entry.name === farmer.name.split(' ')[0] ? '#059669' : '#86efac'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2">
            Regional avg: <strong>{regionalAvg.milkPerCowPerDay} L/cow/day</strong> (dashed line)
          </p>
        </div>
      </div>

      {/* All Farmers Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-gray-700 text-sm font-semibold">All Farmers — Regional Comparison</h3>
          <p className="text-gray-400 text-xs mt-0.5">Comparing average prices and key metrics across farmers in the region</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="text-left px-5 py-3 font-medium">Farmer</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-right px-4 py-3 font-medium">Animals</th>
                <th className="text-right px-4 py-3 font-medium">Milk/Cow/Day</th>
                <th className="text-right px-4 py-3 font-medium">Price/L</th>
                <th className="text-right px-4 py-3 font-medium">Monthly Income</th>
                <th className="text-right px-4 py-3 font-medium">Monthly Profit</th>
                <th className="text-center px-4 py-3 font-medium">vs Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {farmerProfiles.map((f, idx) => {
                const isSelected = f.id === farmer.id;
                const aboveAvg = f.milkPrice >= f.regionalAvgPrice;
                return (
                  <tr
                    key={f.id}
                    onClick={() => setSelectedFarmerId(f.id)}
                    className={`border-t border-gray-100 cursor-pointer transition-colors ${
                      isSelected ? 'bg-green-50' : idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {f.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-medium ${isSelected ? 'text-green-700' : 'text-gray-800'}`}>{f.name}</p>
                          <p className="text-xs text-gray-400">{f.farm}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{f.level3}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{f.animals}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${f.milkPerCowPerDay >= regionalAvg.milkPerCowPerDay ? 'text-green-700' : 'text-red-500'}`}>
                        {f.milkPerCowPerDay} L
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">KES {f.milkPrice}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{fmt(f.monthlyIncome)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${f.monthlyProfit > 0 ? 'text-green-700' : 'text-red-500'}`}>
                        {fmt(f.monthlyProfit)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                        aboveAvg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {aboveAvg ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {aboveAvg ? 'Above' : 'Below'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-blue-50">
                <td className="px-5 py-3 font-semibold text-blue-700 text-xs">Regional Average</td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 text-right font-semibold text-blue-700">{regionalAvg.animalsPerFarm}</td>
                <td className="px-4 py-3 text-right font-semibold text-blue-700">{regionalAvg.milkPerCowPerDay} L</td>
                <td className="px-4 py-3 text-right font-semibold text-blue-700">KES {regionalAvg.milkPrice}</td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 text-right font-semibold text-blue-700">{fmt(regionalAvg.monthlyProfit)}</td>
                <td className="px-4 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
