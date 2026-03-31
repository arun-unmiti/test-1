import { useState, useEffect } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getCoreDashboard } from '../services/api';
import LocationFilter from '../components/LocationFilter';
import { useAreaUnit } from '../hooks/useAreaUnit';

const PIE_COLORS = ['#31A355','#3b6fd8','#f59e0b','#f87171','#9ca3af','#34d399','#f97316','#22c55e','#eab308','#6366f1'];

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
    title: { text: '' },
};

function Overview({ token }) {
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locFilter, setLocFilter] = useState({});
    const currency = locFilter.currency || 'KES';
    const areaUnit = useAreaUnit(token);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        getCoreDashboard(token, 'overview', locFilter)
            .then((res) => setDashData(res.data || null))
            .catch(() => setDashData(null))
            .finally(() => setLoading(false));
    }, [token, JSON.stringify(locFilter)]);

    const d = dashData || {};

    // ── Chart: Top 5 Profit crops ──────────────────────────────────────
    const profitCrops = d.top5_profit_crops || [];
    const optionsProfit = {
        ...baseChartOpts,
        chart: { type: 'column', height: '300px' },
        xAxis: { categories: profitCrops.map(c => c.crop), lineColor: '#ddd', tickColor: '#ddd' },
        yAxis: { title: { text: null }, gridLineDashStyle: 'Dash', gridLineColor: '#ddd' },
        legend: { align: 'center', verticalAlign: 'bottom', symbolHeight: 10, symbolWidth: 10, symbolRadius: 0 },
        plotOptions: { column: { borderRadius: 6, pointWidth: 30, pointPadding: 0.1, groupPadding: 0.1 } },
        series: [{ name: 'Profit', color: '#31A355', data: profitCrops.map(c => c.profit) }],
    };

    // ── Chart: Top 5 Loss crops ────────────────────────────────────────
    const lossCrops = d.top5_loss_crops || [];
    const optionsLoss = {
        ...baseChartOpts,
        chart: { type: 'column', height: '300px' },
        xAxis: { categories: lossCrops.map(c => c.crop), lineColor: '#ddd', tickColor: '#ddd' },
        yAxis: { title: { text: null }, gridLineDashStyle: 'Dash', gridLineColor: '#ddd' },
        legend: { align: 'center', verticalAlign: 'bottom', symbolHeight: 12, symbolWidth: 12, symbolRadius: 0 },
        plotOptions: { column: { borderRadius: 6, pointWidth: 30, pointPadding: 0.1, groupPadding: 0.1 } },
        series: [{ name: 'Loss', color: '#F3796E', data: lossCrops.map(c => -c.loss) }],
    };

    // ── Chart: Farmers Profit vs Loss ──────────────────────────────────
    const avgPnl = d.avg_farmer_profit_loss || {};
    const aboveAvg = avgPnl.farmers_above_avg || 0;
    const belowAvg = avgPnl.farmers_below_avg || 0;
    const total = aboveAvg + belowAvg;
    const abovePct = total > 0 ? ((aboveAvg / total) * 100).toFixed(1) : '0.0';
    const optionsAvg = {
        ...baseChartOpts,
        chart: { type: 'bar', height: '300px' },
        xAxis: { categories: ['Above Average', 'Below Average'], title: { text: null }, gridLineWidth: 0 },
        yAxis: { min: 0, title: { text: null }, gridLineDashStyle: 'Dash', gridLineColor: '#ddd' },
        legend: { enabled: false },
        plotOptions: { bar: { borderRadius: 4, pointPadding: 0.2, groupPadding: 0.1 } },
        series: [{ name: 'Farmers', color: '#3b6fd8', data: [aboveAvg, belowAvg] }],
        subtitle: {
            text: `<b>${abovePct}%</b> of farmers are performing above average`,
            align: 'left', verticalAlign: 'bottom', useHTML: true, style: { fontSize: '12px' },
        },
    };

    // ── Chart: Expense Sources pie ─────────────────────────────────────
    const expSources = d.expense_sources || [];
    const optionsExpPie = {
        ...baseChartOpts,
        chart: { type: 'pie', height: '300px' },
        legend: { enabled: false },
        plotOptions: {
            pie: {
                allowPointSelect: true, cursor: 'pointer',
                dataLabels: { enabled: true, format: '{point.name}: {point.percentage:.0f}%', distance: 20, style: { fontSize: '12px', fontWeight: '500' } },
            },
        },
        series: [{
            name: 'Expenses',
            data: expSources.map((e, i) => ({ name: e.source, y: e.amount, color: PIE_COLORS[i % PIE_COLORS.length] })),
        }],
    };

    // ── Chart: Income Sources pie ──────────────────────────────────────
    const incSources = d.income_sources || [];
    const optionsIncPie = {
        ...baseChartOpts,
        chart: { type: 'pie', height: '300px' },
        legend: { enabled: false },
        plotOptions: {
            pie: {
                size: '75%', allowPointSelect: false, borderWidth: 0,
                dataLabels: { enabled: true, format: '{point.name}: {point.percentage:.0f}%', distance: 18, style: { fontSize: '12px', fontWeight: '500' } },
            },
        },
        tooltip: { pointFormat: '<b>{point.percentage:.1f}%</b>' },
        series: [{
            name: 'Revenue',
            data: incSources.map((s, i) => ({ name: s.source, y: s.total_amount, color: PIE_COLORS[i % PIE_COLORS.length] })),
        }],
    };

    const netPL = d.net_profit_loss || {};
    const netCardClass = netPL.type === 'loss' ? 'card six' : 'card seven';

    const farmersAtLoss = belowAvg;
    const farmersAtRisk = d.top5_loss_crops?.length || 0;

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="overviewBox">
                            <h3>Overview</h3>
                            <p>Territory-wide financial health and insights</p>
                        </div>

                        {/* Location filter */}
                        <div className="card filterCard mt-2">
                            <div className="card-body">
                                <LocationFilter token={token} onChange={(f) => setLocFilter(f)} />
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center text-muted py-5">Loading dashboard...</div>
                        ) : (
                            <>
                                {/* ── Row 1: Core counts ── */}
                                <div className="overviewCards mt-3">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card one">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Total Farmers</h6>
                                                            <h4>{d.total_farmers ?? '—'}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/farmer.png" alt="Farmer" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card three">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Crops Registered</h6>
                                                            <h4>{d.total_crops_registered ?? '—'}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/crops.png" alt="Crops Registered" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card three">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Active Crops</h6>
                                                            <h4>{d.active_crops ?? '—'}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/crops.png" alt="Crops" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card two">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Total Farms</h6>
                                                            <h4>{d.total_farms ?? '—'}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/building.png" alt="Farms" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card four">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Total Land <span style={{ fontSize: 12, fontWeight: 400 }}>({areaUnit})</span></h6>
                                                            <h4>{d.covered_area ?? '—'}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/building.png" alt="Land" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card one">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Active Farmers</h6>
                                                            <h4>{d.active_farmers ?? '—'}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/farmer.png" alt="Active Farmers" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* ── Row 2: Financial summary ── */}
                                <div className="overviewCards mt-3">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card five">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Total Income ({currency})</h6>
                                                            <h4>{formatKES(d.total_income)}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/up-trend.png" alt="Income" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card six">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Total Expenses ({currency})</h6>
                                                            <h4>{formatKES(d.total_expenses)}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/trend.png" alt="Expenses" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className={netCardClass}>
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Net {netPL.type === 'loss' ? 'Loss' : 'Profit'} ({currency})</h6>
                                                            <h4>{formatKES(netPL.amount)}</h4>
                                                        </div>
                                                        <div><img src={`./assets/images/${netPL.type === 'loss' ? 'trend' : 'up-trend'}.png`} alt="Net" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card eight">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Avg Farmer P&L ({currency})</h6>
                                                            <h4>{formatKES(avgPnl.average)}</h4>
                                                        </div>
                                                        <div><img src={`./assets/images/${avgPnl.type === 'loss' ? 'trend' : 'up-trend'}.png`} alt="Avg" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Key Insights ── */}
                                <div className="keyInsightBox mt-3">
                                    <div className="card">
                                        <div className="card-body p-0">
                                            <h4>Key Insights</h4>
                                            <ul className="mb-0 mt-3 ps-3">
                                                <li><strong>{farmersAtLoss}</strong> farmers are operating below average and may need support</li>
                                                <li><strong>{farmersAtRisk}</strong> crops are recording losses</li>
                                                <li>Farmers performing above average represent <strong>{abovePct}%</strong> of total</li>
                                                <li>Average farmer {avgPnl.type || 'profit/loss'}: <strong>{currency} {formatKES(avgPnl.average)}</strong></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Charts Row 1 ── */}
                                <div className="row mt-3">
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                        <div className="card chartCard">
                                            <div className="card-body">
                                                <h4 className="chart-title">Top 5 Profit Making Crops</h4>
                                                {profitCrops.length > 0
                                                    ? <HighchartsReact highcharts={Highcharts} options={optionsProfit} />
                                                    : <p className="text-muted text-center py-4">No data</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                        <div className="card chartCard">
                                            <div className="card-body">
                                                <h4 className="chart-title">Top 5 Loss Making Crops</h4>
                                                {lossCrops.length > 0
                                                    ? <HighchartsReact highcharts={Highcharts} options={optionsLoss} />
                                                    : <p className="text-muted text-center py-4">No data</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Charts Row 2 ── */}
                                <div className="row mt-3">
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                        <div className="card chartCard">
                                            <div className="card-body">
                                                <h4 className="chart-title">Farmers Profit vs Loss</h4>
                                                <HighchartsReact highcharts={Highcharts} options={optionsAvg} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                        <div className="card chartCard">
                                            <div className="card-body">
                                                <h4 className="chart-title">Most Used Farm Inputs</h4>
                                                <div className="inputs-card">
                                                    {(d.farm_inputs || []).length > 0
                                                        ? (d.farm_inputs || []).map((item, index) => (
                                                            <div className="input-row" key={index}>
                                                                <div className="left">
                                                                    <span className="badge">{index + 1}</span>
                                                                    <span className="name">{item.input}</span>
                                                                </div>
                                                                <div className="value">{item.count} uses</div>
                                                            </div>
                                                        ))
                                                        : <p className="text-muted text-center py-4">No data</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Charts Row 3 ── */}
                                <div className="row mt-3">
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                        <div className="card chartCard">
                                            <div className="card-body">
                                                <h4 className="chart-title">Expense Sources Distribution</h4>
                                                {expSources.length > 0
                                                    ? <HighchartsReact highcharts={Highcharts} options={optionsExpPie} />
                                                    : <p className="text-muted text-center py-4">No data</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                        <div className="card chartCard">
                                            <div className="card-body">
                                                <h4 className="chart-title">Income Sources Distribution</h4>
                                                {incSources.length > 0
                                                    ? <HighchartsReact highcharts={Highcharts} options={optionsIncPie} />
                                                    : <p className="text-muted text-center py-4">No data</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Overview;
