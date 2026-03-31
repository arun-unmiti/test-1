import { useState, useEffect } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getCoreDashboard } from '../services/api';
import LocationFilter from '../components/LocationFilter';

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

function DashboardFarmer({ token }) {
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locFilter, setLocFilter] = useState({});
    const currency = locFilter.currency || 'KES';

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        getCoreDashboard(token, 'farmer', locFilter)
            .then((res) => setDashData(res.data || null))
            .catch(() => setDashData(null))
            .finally(() => setLoading(false));
    }, [token, JSON.stringify(locFilter)]);

    const d = dashData || {};
    const netPL = d.net_profit_loss || {};
    const netCardClass = netPL.type === 'loss' ? 'card six' : 'card seven';
    const atRiskFarmers = (d.top10_loss_farmers || []).length;

    // ── Chart 1: Farmers by Number of Crops ────────────────────────────
    const farmersByCrops = d.farmers_by_crops || [];
    const optionsCrops = {
        ...baseChartOpts,
        chart: { type: 'column', height: '300px' },
        xAxis: { categories: farmersByCrops.map(c => c.crop), lineColor: '#ddd', tickColor: '#ddd' },
        yAxis: { title: { text: 'Number of Farmers' }, gridLineDashStyle: 'Dash', gridLineColor: '#ddd' },
        legend: { enabled: false },
        plotOptions: { column: { borderRadius: 0, pointPadding: 0.1, groupPadding: 0.1 } },
        series: [{ name: 'Farmers', color: '#3B82F6', data: farmersByCrops.map(c => c.farmer_count) }],
    };

    // ── Chart 2: Farmers by Performance (Column - Profit vs Loss) ──────
    const perfProfit = d.farmers_by_performance_profit || [];
    const perfLoss = d.farmers_by_performance_loss || [];
    const perfCategories = perfProfit.map(p => p.range);
    const optionsPerf = {
        ...baseChartOpts,
        chart: { type: 'column', height: '300px' },
        xAxis: { categories: perfCategories, lineColor: '#ddd', tickColor: '#ddd' },
        yAxis: { title: { text: 'Farmers' }, gridLineDashStyle: 'Dash', gridLineColor: '#ddd' },
        legend: { align: 'center', verticalAlign: 'bottom', symbolHeight: 10, symbolWidth: 10, symbolRadius: 0 },
        plotOptions: { column: { borderRadius: 4, pointPadding: 0.1, groupPadding: 0.1 } },
        series: [
            { name: 'Profit', color: '#31A355', data: perfProfit.map(p => p.farmer_count) },
            { name: 'Loss', color: '#F3796E', data: perfLoss.map(p => p.farmer_count) },
        ],
    };

    // ── Chart 3: Income vs Expense by Region ───────────────────────────
    const regionData = d.income_vs_expense_by_region || [];
    const optionsRegion = {
        ...baseChartOpts,
        chart: { type: 'column', height: '300px' },
        xAxis: { categories: regionData.map(r => r.region), lineColor: '#ddd', tickColor: '#ddd' },
        yAxis: { title: { text: null }, gridLineDashStyle: 'Dash', gridLineColor: '#ddd' },
        legend: { align: 'center', verticalAlign: 'bottom', symbolHeight: 10, symbolWidth: 10, symbolRadius: 0 },
        plotOptions: { column: { borderRadius: 5, pointPadding: 0.1, groupPadding: 0.1 } },
        series: [
            { name: 'Income', color: '#31A355', data: regionData.map(r => r.income) },
            { name: 'Expense', color: '#F3796E', data: regionData.map(r => r.expense) },
        ],
    };

    // ── Chart 4: Top 10 Profitable Farmers (Now matching Losses style) ──
    const topProfit = d.top10_profitable_farmers || [];
    const optionsTopProfit = {
        ...baseChartOpts,
        chart: { type: 'bar', height: '300px' },
        xAxis: { categories: topProfit.map(f => f.farmer), title: { text: null }, gridLineWidth: 1, lineWidth: 0 },
        yAxis: { min: 0, title: { text: null }, gridLineWidth: 0 },
        legend: { enabled: false },
        plotOptions: { bar: { borderRadius: '5%', dataLabels: { enabled: false }, groupPadding: 0.1 } },
        series: [{ name: 'Profit', color: '#31A355', data: topProfit.map(f => f.profit) }],
    };

    // ── Chart 5: Farmers with Losses (Need Intervention) ───────────────
    const topLoss = d.top10_loss_farmers || [];
    const optionsTopLoss = {
        ...baseChartOpts,
        chart: { type: 'bar', height: '300px' },
        xAxis: { categories: topLoss.map(f => f.farmer), title: { text: null }, gridLineWidth: 1, lineWidth: 0 },
        yAxis: { min: 0, title: { text: null }, gridLineWidth: 0 },
        legend: { enabled: false },
        plotOptions: { bar: { borderRadius: '5%', dataLabels: { enabled: false }, groupPadding: 0.1 } },
        series: [{ name: 'Loss', color: '#F3796E', data: topLoss.map(f => f.loss) }],
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">

                    <div className="overviewBox mt-3">
                        <h3>Farmer Dashboard</h3>
                        <p>Overview of farmer performance, profitability, and risk analysis</p>
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
                            {/* Core counts + Financial summary + Key Insights */}
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
                                </div>
                            </div>

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
                                        <div className="card six">
                                            <div className="card-body p-0">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6>At-Risk Farmers</h6>
                                                        <h4>{atRiskFarmers}</h4>
                                                    </div>
                                                    <div><img src="./assets/images/error.png" alt="At Risk" /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Insights */}
                            <div className="keyInsightBox mt-3">
                                <div className="card">
                                    <div className="card-body p-0">
                                        <h4>Key Insights</h4>
                                        <ul className="mb-0 mt-3 ps-3">
                                            <li><strong>{atRiskFarmers}</strong> farmers are operating at a loss and need immediate support</li>
                                            <li><strong>{atRiskFarmers}</strong> farmers are at high risk based on expense-to-income ratio</li>
                                            <li>Average income per farmer: <strong>{currency} {formatKES(d.avg_income_per_farmer)}</strong></li>
                                            <li>Average expense per farmer: <strong>{currency} {formatKES(d.avg_expense_per_farmer)}</strong></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {!loading && (
                <>
                    {/* Charts Row 1 */}
                    <div className="row mt-3">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Farmers by Number of Crops</h4>
                                    {farmersByCrops.length > 0
                                        ? <HighchartsReact highcharts={Highcharts} options={optionsCrops} />
                                        : <p className="text-muted text-center py-4">No data available</p>}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Farmers by Performance</h4>
                                    {(perfProfit.length > 0 || perfLoss.length > 0)
                                        ? <HighchartsReact highcharts={Highcharts} options={optionsPerf} />
                                        : <p className="text-muted text-center py-4">No data available</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="row mt-3">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Income vs Expense by Region</h4>
                                    {regionData.length > 0
                                        ? <HighchartsReact highcharts={Highcharts} options={optionsRegion} />
                                        : <p className="text-muted text-center py-4">No data available</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 3 - Both Top charts now in same style */}
                    <div className="row mt-3">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Top 10 Profitable Farmers</h4>
                                    {topProfit.length > 0
                                        ? <HighchartsReact highcharts={Highcharts} options={optionsTopProfit} />
                                        : <p className="text-muted text-center py-4">No data available</p>}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Farmers with Losses (Need Intervention)</h4>
                                    {topLoss.length > 0
                                        ? <HighchartsReact highcharts={Highcharts} options={optionsTopLoss} />
                                        : <p className="text-muted text-center py-4">No data available</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Benchmark + Quick Actions */}
                    <div className="row mt-3">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Average Performance Benchmark</h4>
                                    <div className="pbenchMark d-flex justify-content-between mt-4">
                                        <div><h4 className="mb-0">Average Income per Farmer</h4></div>
                                        <div><h3>{currency} {formatKES(d.avg_income_per_farmer)}</h3></div>
                                    </div>
                                    <div className="pbenchMark green d-flex justify-content-between mt-3">
                                        <div><h4 className="mb-0">Average Expense per Farmer</h4></div>
                                        <div><h3>{currency} {formatKES(d.avg_expense_per_farmer)}</h3></div>
                                    </div>
                                    <hr />
                                    <div className="pbenchMark blue d-flex justify-content-between mt-3">
                                        <div><h4 className="mb-0">Farmers Above Average</h4></div>
                                        <div><h3>N/A</h3></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="card chartCard">
                                <div className="card-body">
                                    <h4 className="chart-title">Quick Actions</h4>
                                    <div className="benchMark d-flex justify-content-between px-3 mt-3">
                                        <div><h4 className="mb-0">View At-Risk Farmers</h4></div>
                                        <div><span><img src="./assets/images/error-white.png" alt="" /></span></div>
                                    </div>
                                    <div className="benchMark green d-flex justify-content-between px-3 mt-3">
                                        <div><h4 className="mb-0">View Top Performer</h4></div>
                                        <div><span><img src="./assets/images/trend-up.png" alt="" /></span></div>
                                    </div>
                                    <div className="benchMark white d-flex justify-content-between px-3 mt-3">
                                        <div><h4 className="mb-0">View All Farmers Data</h4></div>
                                        <div><span><img src="./assets/images/eye.png" alt="" /></span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default DashboardFarmer;
