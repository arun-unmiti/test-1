import { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  Building2, Users, Beef, Droplets, ShoppingCart, Dna, TrendingUp, TrendingDown,
  DollarSign, ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react';
import {
  summaryStats, monthlyMilkProduction, milkPriceStats,
  monthlySalesByCategory, salesPriceStats, incomeBreakdown,
  costBreakdown, monthlyFeedingCost, monthlyProfitLoss,
} from '../../data/mockData';

const fmt = (n: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat('en').format(n);

interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
}

function StatCard({ title, value, sub, icon, color, trend, trendLabel }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'text-green-700 bg-green-50' :
            trend === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : trend === 'down' ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {trendLabel}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{title}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const CHART_COLORS = ['#16a34a', '#3b82f6', '#f97316', '#8b5cf6', '#ef4444', '#14b8a6'];

const CustomTooltip = ({ active, payload, label, currency = false }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-medium text-gray-700 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-600">{p.name}:</span>
            <span className="font-medium">{currency ? fmt(p.value) : fmtNum(p.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function OverviewPage() {
  const { totalFarms, totalHerds, totalAnimals, totalMilkProductionLitersPerDay,
    totalSalesMonthly, totalBreedingCostMonthly, totalIncomeMonthly, totalCostMonthly, profitLossMonthly } = summaryStats;

  const avgFarmerProfit = useMemo(() =>
    monthlyProfitLoss.reduce((s, d) => s + d.actual, 0) / monthlyProfitLoss.length, []);
  const baselineProfit = useMemo(() =>
    monthlyProfitLoss.reduce((s, d) => s + d.baseline, 0) / monthlyProfitLoss.length, []);

  return (
    <div className="p-6 space-y-8 max-w-screen-2xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-gray-900 mb-1">Overview</h1>
        <p className="text-gray-500 text-sm">Aggregated performance across all registered farms — March 2026</p>
      </div>

      {/* ── SECTION 1: Info Cards ─────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          <StatCard title="Total Farms" value={fmtNum(totalFarms)} sub="Registered farms"
            icon={<Building2 className="h-5 w-5 text-green-700" />} color="bg-green-50"
            trend="up" trendLabel="+2 this month" />
          <StatCard title="Total Herds" value={fmtNum(totalHerds)} sub="Across all farms"
            icon={<Users className="h-5 w-5 text-blue-600" />} color="bg-blue-50"
            trend="up" trendLabel="+5 this month" />
          <StatCard title="Total Animals" value={fmtNum(totalAnimals)} sub="All livestock"
            icon={<Beef className="h-5 w-5 text-amber-600" />} color="bg-amber-50"
            trend="up" trendLabel="+18 this month" />
          <StatCard title="Milk Production" value={`${fmtNum(totalMilkProductionLitersPerDay)} L`} sub="Per day (all farms)"
            icon={<Droplets className="h-5 w-5 text-cyan-600" />} color="bg-cyan-50"
            trend="up" trendLabel="+3.2% vs last month" />
          <StatCard title="Total Sales" value={fmt(totalSalesMonthly)} sub="Revenue this month"
            icon={<ShoppingCart className="h-5 w-5 text-purple-600" />} color="bg-purple-50"
            trend="up" trendLabel="+8.4% vs last month" />
          <StatCard title="Breeding & Other" value={fmt(totalBreedingCostMonthly)} sub="Non-feed operating costs"
            icon={<Dna className="h-5 w-5 text-pink-600" />} color="bg-pink-50"
            trend="neutral" trendLabel="Stable" />
          <StatCard title="Total Income" value={fmt(totalIncomeMonthly)} sub="All revenue streams"
            icon={<TrendingUp className="h-5 w-5 text-green-700" />} color="bg-green-50"
            trend="up" trendLabel="+6.1% MoM" />
          <StatCard title="Total Cost" value={fmt(totalCostMonthly)} sub="Operational expenses"
            icon={<DollarSign className="h-5 w-5 text-orange-600" />} color="bg-orange-50"
            trend="up" trendLabel="+2.8% MoM" />
          <div className="col-span-2 sm:col-span-1 xl:col-span-2 bg-white rounded-xl border border-green-200 p-5 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-green-600">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full text-green-700 bg-green-100">
                <ArrowUpRight className="h-3 w-3" /> +12.5% vs baseline
              </span>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold text-green-800">{fmt(profitLossMonthly)}</p>
              <p className="text-xs text-green-700 mt-1 font-medium">Total Profit — March 2026</p>
              <p className="text-xs text-green-600 mt-0.5">Across {totalFarms} active farms</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Milk Production ────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-800">Milk Production</h2>
            <p className="text-gray-500 text-sm">12-month trend across all farms (litres)</p>
          </div>
          <div className="flex gap-3">
            <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${
              milkPriceStats.farmersAboveAvg > milkPriceStats.farmersBelowAvg
                ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}>
              <ArrowUpRight className="h-3 w-3" />
              {milkPriceStats.farmersAboveAvg} farmers above avg price (KES {milkPriceStats.regionalAvgPrice}/L)
            </div>
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium bg-red-50 text-red-600">
              <ArrowDownRight className="h-3 w-3" />
              {milkPriceStats.farmersBelowAvg} farmers below avg price
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyMilkProduction}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="production" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4 }} name="Actual Production (L)" />
              <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
              <Line type="monotone" dataKey="avgFarmer" stroke="#f97316" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Avg Farmer" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── SECTION 3: Sales ──────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-800">Sales by Category</h2>
            <p className="text-gray-500 text-sm">Monthly revenue breakdown by type (KES)</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium bg-green-50 text-green-700">
              <ArrowUpRight className="h-3 w-3" />
              {salesPriceStats.farmersAboveAvg} farmers above avg KES {salesPriceStats.avgSellingPrice}/L
            </div>
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium bg-amber-50 text-amber-700">
              <ArrowDownRight className="h-3 w-3" />
              {salesPriceStats.farmersBelowAvg} farmers below avg
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlySalesByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip currency />} />
              <Legend />
              <Bar dataKey="milk" stackId="a" fill="#16a34a" name="Milk Sales" radius={[0,0,0,0]} />
              <Bar dataKey="animals" stackId="a" fill="#3b82f6" name="Animal Sales" />
              <Bar dataKey="manure" stackId="a" fill="#f97316" name="Manure" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── SECTION 4: Income Breakdown ───────────────────────────────── */}
      <section>
        <h2 className="text-gray-800 mb-1">Income Breakdown</h2>
        <p className="text-gray-500 text-sm mb-4">Revenue sources — current month</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={incomeBreakdown} cx="50%" cy="50%" outerRadius={100} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                >
                  {incomeBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmt(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-gray-700 mb-4 text-sm font-semibold">Income Sources Detail</h3>
            <div className="space-y-3">
              {incomeBreakdown.map((item) => {
                const total = incomeBreakdown.reduce((s, d) => s + d.value, 0);
                const pct = ((item.value / total) * 100).toFixed(1);
                return (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{pct}%</span>
                        <span className="font-medium text-gray-800">{fmt(item.value)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: item.color }} />
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-gray-100 flex justify-between text-sm">
                <span className="font-semibold text-gray-700">Total Income</span>
                <span className="font-bold text-green-700">{fmt(incomeBreakdown.reduce((s, d) => s + d.value, 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Cost ───────────────────────────────────────────── */}
      <section>
        <h2 className="text-gray-800 mb-1">Cost Analysis</h2>
        <p className="text-gray-500 text-sm mb-4">Cost breakdown and feeding cost trend</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Cost Breakdown Pie */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-gray-700 mb-4 text-sm font-semibold">Cost Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={costBreakdown} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {costBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmt(Number(v))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Feeding Cost Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-gray-700 mb-4 text-sm font-semibold">Feeding Cost Trend (12 months, KES)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyFeedingCost}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip currency />} />
                <Legend />
                <Bar dataKey="concentrate" stackId="a" fill="#f97316" name="Concentrate" />
                <Bar dataKey="forage" stackId="a" fill="#16a34a" name="Forage" />
                <Bar dataKey="minerals" stackId="a" fill="#3b82f6" name="Minerals" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: Profit/Loss ────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-800">Profit / Loss Trend</h2>
            <p className="text-gray-500 text-sm">Actual vs baseline — 12-month performance (KES)</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Avg Farmer Profit</p>
              <p className="font-bold text-green-700 text-sm">{fmt(avgFarmerProfit)}/mo</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Baseline Profit</p>
              <p className="font-bold text-blue-600 text-sm">{fmt(baselineProfit)}/mo</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Outperformance</p>
              <p className="font-bold text-emerald-600 text-sm">+{(((avgFarmerProfit - baselineProfit) / baselineProfit) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyProfitLoss}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip currency />} />
              <Legend />
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="actual" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4 }} name="Avg Farmer Profit" />
              <Line type="monotone" dataKey="baseline" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Baseline Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
