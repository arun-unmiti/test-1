import { useState, useEffect } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/heatmap";
import { getCoreDashboard } from '../services/api';
import LocationFilter from '../components/LocationFilter';

const PIE_COLORS = ['#31A355', '#3b6fd8', '#f59e0b', '#f87171', '#9ca3af', '#34d399', '#f97316', '#22c55e', '#eab308', '#6366f1'];

const formatKES = (val) => {
    const n = parseFloat(val);
    if (isNaN(n) || val == null) return '—';
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    if (abs >= 1_000_000) return sign + (abs / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    if (abs >= 1_000) return sign + (abs / 1_000).toFixed(1).replace(/\.?0+$/, '') + 'K';
    return n.toLocaleString();
};

const baseChartOpts = { 
    credits: { enabled: false }, 
    title: { text: '' } 
};

function CropLedger({ token }) {
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locFilter, setLocFilter] = useState({});
    const currency = locFilter.currency || 'KES';

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        getCoreDashboard(token, 'crop', locFilter)
            .then((res) => setDashData(res.data || null))
            .catch(() => setDashData(null))
            .finally(() => setLoading(false));
    }, [token, JSON.stringify(locFilter)]);

    const d = dashData || {};
    const netPL = d.net_profit_loss || {};
    const netCardClass = netPL.type === 'loss' ? 'card six' : 'card seven';

    const profitableCrops = d.profitable_crops || [];
    const lossCrops       = d.loss_crops       || [];

    // ── Chart 1: Profitability by Crop Type ─────────────────────────────
    const incByCrop = d.income_by_crop || [];
    const expByCrop = d.expense_by_crop || [];
    const cropNames = incByCrop.map(c => c.crop);
    const optionsProfitability = {
        ...baseChartOpts,
        chart: { type: 'column', height: '300px' },
        xAxis: { categories: cropNames, lineColor: '#ddd', tickColor: '#ddd' },
        yAxis: { title: { text: null }, lineWidth: 0 },
        legend: { symbolRadius: 0 },
        plotOptions: { column: { borderRadius: '5%' } },
        series: [
            { name: 'Revenue', color: '#31A355', data: incByCrop.map(c => c.income || 0) },
            { name: 'Expense', color: '#F3796E', data: expByCrop.map(c => c.expense || 0) },
        ],
    };

    // ── Chart 2: Monthly Revenue & Expense Trend ────────────────────────
    const monthlyTrend = d.monthly_trend || [];
    const monthMap = {};
    monthlyTrend.forEach(row => {
        if (!monthMap[row.month]) monthMap[row.month] = { income: 0, expense: 0 };
        monthMap[row.month].income += row.income || 0;
        monthMap[row.month].expense += row.expense || 0;
    });
    const months = Object.keys(monthMap).sort();
    const optionsMonthly = {
        ...baseChartOpts,
        chart: { type: 'line', height: '300px' },
        xAxis: { categories: months, lineColor: '#ddd', tickColor: '#ddd' },
        yAxis: { title: { text: null }, lineWidth: 1 },
        series: [
            { name: 'Revenue', color: '#31A355', data: months.map(m => monthMap[m].income) },
            { name: 'Expense', color: '#F3796E', data: months.map(m => monthMap[m].expense) },
        ],
    };

    // ── Chart 3: Expense Category Breakdown (Pie) ───────────────────────
    const expByStage = d.expense_by_stage || [];
    const stageMap = {};
    expByStage.forEach(row => {
        stageMap[row.stage] = (stageMap[row.stage] || 0) + (row.expense || 0);
    });
    const stageEntries = Object.entries(stageMap).sort((a, b) => b[1] - a[1]);
    const optionsExpPie = {
        ...baseChartOpts,
        chart: { type: 'pie', height: '300px' },
        tooltip: { headerFormat: '', pointFormat: '<span style="color:{point.color}">●</span> {point.name}: <b>{point.percentage:.1f}%</b>' },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                borderWidth: 2,
                cursor: 'pointer',
                dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}%', distance: 20 }
            }
        },
        series: [{
            colorByPoint: true,
            data: stageEntries.map(([stage, amt], i) => ({
                name: stage,
                y: amt,
                color: PIE_COLORS[i % PIE_COLORS.length]
            })),
        }],
    };

    // ── Chart 4: Revenue Distribution by Crop (Pie) ─────────────────────
    const optionsRevPie = {
        ...baseChartOpts,
        chart: { type: 'pie', height: '300px' },
        tooltip: { headerFormat: '', pointFormat: '<span style="color:{point.color}">●</span> {point.name}: <b>{point.percentage:.1f}%</b>' },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                borderWidth: 2,
                cursor: 'pointer',
                dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}%', distance: 20 }
            }
        },
        series: [{
            colorByPoint: true,
            data: incByCrop.map((c, i) => ({
                name: c.crop,
                y: c.income || 0,
                color: PIE_COLORS[i % PIE_COLORS.length]
            })),
        }],
    };

    // ── Chart 5: Expense by Crop Cycle Stage ────────────────────────────
    const stageNames = stageEntries.map(([s]) => s);
    const optionsStage = {
        ...baseChartOpts,
        chart: { type: 'column', height: '300px' },
        xAxis: { 
            categories: stageNames, 
            lineColor: '#ddd', 
            tickColor: '#ddd',
            labels: { rotation: -30, style: { fontSize: '11px' } }
        },
        yAxis: { title: { text: null }, lineWidth: 0 },
        legend: { symbolRadius: 0 },
        plotOptions: { column: { borderRadius: '5%' } },
        series: [{ name: 'Expense', color: '#3B82F6', data: stageEntries.map(([, v]) => v) }],
    };

    // ── Chart 6: Crop Price Analysis (Fallback) ─────────────────────────
    const optionsCropPrice = {
        ...baseChartOpts,
        chart: { type: 'line', height: '300px' },
        xAxis: { categories: cropNames.length > 0 ? cropNames : ['Maize', 'Beans', 'Coffee', 'Tomatoes'] },
        yAxis: { title: { text: null }, lineWidth: 1 },
        series: [
            { name: 'Avg Farmer Price', color: '#3B82F6', data: cropNames.length > 0 ? cropNames.map(() => null) : [24916, 37941, 29742, 29851] },
            { name: 'Sold Above Average Price', color: '#31A355', data: cropNames.length > 0 ? cropNames.map(() => null) : [11744, 30000, 16005, 19771] },
        ],
    };

    // ── Chart 7: Seasonal Crop Calendar Heatmap ─────────────────────────
    const heatmapData = d.seasonal_heatmap || [];
    const hmCrops = [...new Set(heatmapData.map(r => r.crop))].sort();
    const hmStages = [...new Set(heatmapData.map(r => r.stage))].sort();
    const maxExp = Math.max(1, ...heatmapData.map(r => r.net_expense || 0));
    const hmPoints = heatmapData.map(r => [
        hmStages.indexOf(r.stage),
        hmCrops.indexOf(r.crop),
        Math.round(((r.net_expense || 0) / maxExp) * 4) || 1,
    ]);

    const optionsHeatmap = {
        ...baseChartOpts,
        chart: { type: 'heatmap', height: Math.max(300, hmCrops.length * 45 + 100) },
        xAxis: { categories: hmStages.length > 0 ? hmStages : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] },
        yAxis: { categories: hmCrops.length > 0 ? hmCrops : ["Maize","Beans","Coffee"], title: null },
        colorAxis: {
            dataClasses: [
                { from: 1, to: 1, color: '#F3E37C', name: 'Low' },
                { from: 2, to: 2, color: '#B7E1B0', name: 'Medium' },
                { from: 3, to: 3, color: '#6DB56D', name: 'High' },
                { from: 4, to: 4, color: '#F0A85C', name: 'Very High' },
            ],
        },
        legend: { align: 'left', layout: 'horizontal', verticalAlign: 'bottom' },
        tooltip: {
            formatter: function () {
                return `<b>${this.series.yAxis.categories[this.point.y]}</b> — ${this.series.xAxis.categories[this.point.x]}`;
            },
        },
        series: [{
            borderWidth: 1,
            data: hmPoints.length > 0 ? hmPoints : [],
            dataLabels: { enabled: false },
        }],
    };

    // ── Insights Calculation ────────────────────────────────────────────
    const validMargins = (d.profit_margin_by_crop || []).filter(r => r.margin_pct != null);
    const avgMargin = validMargins.length 
        ? (validMargins.reduce((s, r) => s + r.margin_pct, 0) / validMargins.length).toFixed(1) 
        : null;

    const topExpStage = stageEntries[0]?.[0];
    const totalExp = stageEntries.reduce((s, [, v]) => s + v, 0);
    const topStagePct = totalExp > 0 && stageEntries[0] 
        ? ((stageEntries[0][1] / totalExp) * 100).toFixed(1) 
        : null;

    return (
        <div className="container-fluid">
            {/* Location Filter */}
            <div className="row">
                <div className="col-sm-12">
                    <div className="card filterCard mt-2">
                        <div className="card-body">
                            <LocationFilter token={token} onChange={(f) => setLocFilter(f)} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row p-2">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <div className="overviewBox mt-3">
                        <h3>Crop Ledger Dashboard</h3>
                        <p>Financial overview and profitability analysis by crop</p>
                    </div>

                    {/* Financial Summary Cards */}
                    <div className="overviewCards mt-3">
                        <div className="row">
                            <div className="col-sm-12 col-md-3 col-lg-3">
                                <div className="card five">
                                    <div className="card-body p-0">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6>Total Revenue ({currency})</h6>
                                                <h4>{loading ? '—' : formatKES(d.total_income)}</h4>
                                            </div>
                                            <div><img src="./assets/images/up-trend.png" alt="Revenue" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-3">
                                <div className="card six">
                                    <div className="card-body p-0">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6>Total Cost ({currency})</h6>
                                                <h4>{loading ? '—' : formatKES(d.total_expenses)}</h4>
                                            </div>
                                            <div><img src="./assets/images/trend.png" alt="Cost" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-3">
                                <div className={loading ? 'card seven' : netCardClass}>
                                    <div className="card-body p-0">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6>Net {netPL.type === 'loss' ? 'Loss' : 'Profit'} ({currency})</h6>
                                                <h4>{loading ? '—' : formatKES(netPL.amount)}</h4>
                                            </div>
                                            <div><img src={`./assets/images/${netPL.type === 'loss' ? 'trend' : 'up-trend'}.png`} alt="Net" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-3">
                                <div className="card six">
                                    <div className="card-body p-0">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6>Avg Sale Price</h6>
                                                <h4>N/A</h4>
                                            </div>
                                            <div><img src="./assets/images/error.png" alt="Avg Price" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Crop Count Cards */}
                    <div className="overviewCards mt-3">
                        <div className="row">
                            <div className="col-sm-12 col-md-4 col-lg-4">
                                <div className="card one">
                                    <div className="card-body p-0">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div className="text-center">
                                                <h6>Active Crops</h6>
                                                <h4>{loading ? '—' : (d.active_crops ?? '—')}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4">
                                <div className="card two">
                                    <div className="card-body p-0">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div className="text-center">
                                                <h6>Profitable Crops</h6>
                                                <h4>{loading ? '—' : profitableCrops.length}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4">
                                <div className="card three">
                                    <div className="card-body p-0">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div className="text-center">
                                                <h6>Loss-Making Crops</h6>
                                                <h4>{loading ? '—' : lossCrops.length}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Insights */}
                    <div className="keyInsightBox mt-3">
                        <div className="card">
                            <div className="card-body p-0">
                                <h4>Financial Insights</h4>
                                <ul className="mb-0 mt-3 ps-3">
                                    <li>Overall profit margin: <strong>{loading ? '—' : avgMargin != null ? `${avgMargin}%` : 'N/A'}</strong></li>
                                    <li>Highest expense stage: <strong>{loading ? '—' : topExpStage ? `${topExpStage} (${topStagePct}%)` : 'N/A'}</strong></li>
                                    <li><strong>{loading ? '—' : lossCrops.length}</strong> loss-making crops — <strong>{loading ? '—' : profitableCrops.length}</strong> profitable crops</li>
                                    <li>Revenue trend available for <strong>{loading ? '—' : months.length}</strong> months</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            {!loading && (
                <>
                    {/* Row 1 */}
                    <div className="row mt-3">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Profitability by Crop Type</h4>
                                    {cropNames.length > 0 ? (
                                        <HighchartsReact highcharts={Highcharts} options={optionsProfitability} />
                                    ) : (
                                        <p className="text-muted text-center py-4">No data available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Monthly Revenue & Expense Trend</h4>
                                    {months.length > 0 ? (
                                        <HighchartsReact highcharts={Highcharts} options={optionsMonthly} />
                                    ) : (
                                        <p className="text-muted text-center py-4">No data available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="row mt-3">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Expense Category Breakdown</h4>
                                    {stageEntries.length > 0 ? (
                                        <HighchartsReact highcharts={Highcharts} options={optionsExpPie} />
                                    ) : (
                                        <p className="text-muted text-center py-4">No data available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Revenue Distribution by Crop</h4>
                                    {incByCrop.length > 0 ? (
                                        <HighchartsReact highcharts={Highcharts} options={optionsRevPie} />
                                    ) : (
                                        <p className="text-muted text-center py-4">No data available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="row mt-3">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Expense by Crop Cycle Stage</h4>
                                    {stageNames.length > 0 ? (
                                        <HighchartsReact highcharts={Highcharts} options={optionsStage} />
                                    ) : (
                                        <p className="text-muted text-center py-4">No data available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Crop Price Analysis</h4>
                                    <HighchartsReact highcharts={Highcharts} options={optionsCropPrice} />
                                    <p className="text-muted small text-center mt-2">
                                        Average sale price data not available yet
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profit Margin Analysis List */}
                    <div className="row mt-3">
                        <div className="col-sm-12">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Profit Margin Analysis by Crop</h4>
                                    {(d.profit_margin_by_crop || []).length > 0 ? (
                                        <ul className="list-group">
                                            {(d.profit_margin_by_crop || []).map((row) => {
                                                const net = (row.income || 0) - (row.expense || 0);
                                                return (
                                                    <li key={row.crop} className="list-group-item d-flex justify-content-between align-items-start mb-2">
                                                        <div className="d-flex align-items-center">
                                                            <div className="mx-3"><img src="./assets/images/crops.png" alt="" /></div>
                                                            <div className="ms-2 me-auto">
                                                                <div className="fw-bold">{row.crop}</div>
                                                                <p className="mb-0">
                                                                    Revenue: {currency} {formatKES(row.income)} | 
                                                                    Cost: {currency} {formatKES(row.expense)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-end">
                                                            <h4 className="mb-0 fw-bold">{currency} {formatKES(Math.abs(net))}</h4>
                                                            <p className="mb-0">
                                                                {row.margin_pct != null ? `${row.margin_pct}% margin` : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="text-muted text-center py-4">No profit margin data available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Heatmap */}
                    <div className="row mt-3">
                        <div className="col-sm-12">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Seasonal Crop Calendar Heatmap</h4>
                                    <HighchartsReact highcharts={Highcharts} options={optionsHeatmap} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {loading && (
                <div className="text-center text-muted py-5">Loading Crop Ledger Dashboard...</div>
            )}
        </div>
    );
}

export default CropLedger;