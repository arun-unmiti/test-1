import { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { calculateBaselineMetrics, formatCurrency, formatNumber } from '../../utils/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Calculator } from 'lucide-react';

export function PreCalculatedTable() {
  const { data } = useAppContext();
  const currency = data.farmSetup.currency;

  const metrics = useMemo(() => {
    return calculateBaselineMetrics(
      data.herdData,
      data.milkData,
      data.feedItems,
      data.costs,
      data.otherRevenue
    );
  }, [data]);

  const tableData = [
    {
      category: 'Herd Information',
      items: [
        { label: 'Total Animals', value: data.herdData.totalAnimals.toString(), unit: 'animals' },
        { label: 'Lactating Cows', value: data.herdData.lactatingCows.toString(), unit: 'cows' },
        { label: 'Heifers', value: data.herdData.heifers.toString(), unit: 'animals' },
        { label: 'Lactating %', value: metrics.lactatingPercentage.toFixed(1), unit: '%' },
      ],
    },
    {
      category: 'Milk Production',
      items: [
        { label: 'Avg Milk per Cow', value: formatNumber(metrics.avgMilkPerCow), unit: 'L/day' },
        { label: 'Total Milk per Day', value: formatNumber(metrics.totalMilkPerDay), unit: 'L' },
        { label: 'Total Milk per Month', value: formatNumber(metrics.totalMilkPerMonth), unit: 'L' },
        { label: 'Total Milk per Year', value: formatNumber(metrics.totalMilkPerYear), unit: 'L' },
        { label: 'Milk Price', value: formatCurrency(data.milkData.milkPrice, currency), unit: '/L' },
      ],
    },
    {
      category: 'Revenue Breakdown',
      items: [
        { label: 'Milk Revenue', value: formatCurrency(metrics.milkRevenue, currency), unit: '/year' },
        { label: 'Manure Sales', value: formatCurrency(data.otherRevenue.manure, currency), unit: '/year' },
        { label: 'Bull Calves', value: formatCurrency(data.otherRevenue.bullCalves, currency), unit: '/year' },
        { label: 'Heifer Sales', value: formatCurrency(data.otherRevenue.heifers, currency), unit: '/year' },
        { label: 'Cow Sales', value: formatCurrency(data.otherRevenue.cows, currency), unit: '/year' },
        { label: 'Bull Sales', value: formatCurrency(data.otherRevenue.bulls, currency), unit: '/year' },
        { label: 'TOTAL REVENUE', value: formatCurrency(metrics.totalRevenue, currency), unit: '/year', bold: true },
      ],
    },
    {
      category: 'Cost Breakdown',
      items: [
        { label: 'Feed Cost', value: formatCurrency(metrics.feedCost, currency), unit: '/year' },
        { label: 'Labor Cost', value: formatCurrency(data.costs.labor, currency), unit: '/year' },
        { label: 'Breeding Cost', value: formatCurrency(data.costs.breeding, currency), unit: '/year' },
        { label: 'Health Cost', value: formatCurrency(data.costs.health, currency), unit: '/year' },
        { label: 'TOTAL COST', value: formatCurrency(metrics.totalCost, currency), unit: '/year', bold: true },
      ],
    },
    {
      category: 'Financial Metrics',
      items: [
        { label: 'PROFIT/LOSS', value: formatCurrency(metrics.profit, currency), unit: '/year', bold: true, highlight: true },
        { label: 'Cost per Litre', value: formatCurrency(metrics.costPerLitre, currency), unit: '/L' },
        { label: 'Revenue per Litre', value: formatCurrency(metrics.totalRevenue / metrics.totalMilkPerYear, currency), unit: '/L' },
        { label: 'Profit per Litre', value: formatCurrency(metrics.profit / metrics.totalMilkPerYear, currency), unit: '/L' },
        { label: 'Profit per Cow', value: formatCurrency(metrics.profit / data.herdData.lactatingCows, currency), unit: '/year' },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Pre-Calculated Metrics</h2>
      </div>

      {tableData.map((section, idx) => (
        <Card key={idx}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{section.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Metric</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right w-[80px]">Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.items.map((item, itemIdx) => (
                  <TableRow key={itemIdx} className={item.highlight ? (metrics.profit >= 0 ? 'bg-green-50' : 'bg-red-50') : ''}>
                    <TableCell className={item.bold ? 'font-semibold' : ''}>
                      {item.label}
                    </TableCell>
                    <TableCell className={`text-right ${item.bold ? 'font-semibold' : ''} ${
                      item.highlight ? (metrics.profit >= 0 ? 'text-green-700' : 'text-red-700') : ''
                    }`}>
                      {item.value}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {item.unit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Summary Card */}
      <Card className={metrics.profit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className={`text-lg font-semibold ${metrics.profit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              Farm Status
            </h3>
            <p className={`text-3xl font-bold ${metrics.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {metrics.profit >= 0 ? 'PROFITABLE' : 'LOSS'}
            </p>
            <p className={`text-xl ${metrics.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(Math.abs(metrics.profit), currency)} per year
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
