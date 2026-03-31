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

const NoData = () => (
    <div className="d-flex justify-content-center align-items-center py-4 text-muted" style={{ minHeight: 200, fontSize: 13 }}>
        No data available from API
    </div>
);

function Stakeholder({ token }) {
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locFilter, setLocFilter] = useState({});
    const currency = locFilter.currency || 'KES';

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        getCoreDashboard(token, 'stakeholder', locFilter)
            .then((res) => setDashData(res.data || null))
            .catch(() => setDashData(null))
            .finally(() => setLoading(false));
    }, [token, JSON.stringify(locFilter)]);

    const d = dashData || {};

    // ── Chart 1: Supplier vs Buyer Transaction Volume ───────────────────
    const options = {
        chart: { type: 'column', height: '300px' },
        title: { text: '' },
        xAxis: { categories: ['Suppliers', 'Buyers'] },
        yAxis: { title: { text: null }, lineWidth: 0 },
        credits: { enabled: false },
        plotOptions: { column: { borderRadius: '5%' } },
        legend: { symbolRadius: 0, enabled: false },
        series: [{ name: 'Volume', color: '#3B82F6', data: [d.supplier_txn_volume || 0, d.buyer_txn_volume || 0] }],
    };

    // ── Chart 2: Payment Aging Distribution — NO API DATA ───────────────
    // kept static as payment aging data is not available from the dashboard API

    // ── Chart 3: Top 5 Buyers by Volume ─────────────────────────────────
    const topBuyers = d.top_5_buyers_by_volume || [];
    const options3 = {
        chart: { type: 'bar', height: '300px' },
        title: { text: '' },
        xAxis: { categories: topBuyers.map(b => b.buyer), title: { text: null }, gridLineWidth: 0 },
        yAxis: { min: 0, title: { text: null }, gridLineDashStyle: 'Dash', gridLineColor: '#ddd' },
        legend: { enabled: false },
        credits: { enabled: false },
        plotOptions: { bar: { borderRadius: 4, pointPadding: 0.2, groupPadding: 0.1 } },
        series: [{ name: 'Top 5 Stakeholders by Volume for buyers', color: '#31A355', data: topBuyers.map(b => b.volume) }],
    };

    // ── Chart 4: Top 5 Suppliers by Volume ──────────────────────────────
    const topSuppliers = d.top_5_suppliers_by_volume || [];
    const options4 = {
        chart: { type: 'bar', height: '300px' },
        title: { text: '' },
        xAxis: { categories: topSuppliers.map(s => s.supplier), title: { text: null }, gridLineWidth: 0 },
        yAxis: { min: 0, title: { text: null }, gridLineDashStyle: 'Dash', gridLineColor: '#ddd' },
        legend: { enabled: false },
        credits: { enabled: false },
        plotOptions: { bar: { borderRadius: 4, pointPadding: 0.2, groupPadding: 0.1 } },
        series: [{ name: 'Top 5 Stakeholders by Volume for sellers', color: '#31A355', data: topSuppliers.map(s => s.volume) }],
    };

    // ── Chart 5 & 6: Payment Status Distribution — NO API DATA ──────────
    // kept static as payment status (completed/pending) is not returned by dashboard API

    // ── Chart 7: Monthly Buyer Trend ─────────────────────────────────────
    const buyerTrend = d.buyer_monthly_trend || [];
    const options7 = {
        chart: { type: 'line', height: '300px' },
        title: { text: '' },
        xAxis: { categories: buyerTrend.map(t => t.month) },
        yAxis: { title: { text: null }, lineWidth: 1 },
        credits: { enabled: false },
        plotOptions: { spline: { marker: { enable: false } } },
        legend: { symbolRadius: 0, enabled: false },
        series: [{ name: 'Monthly Transaction Volume Trend for Buyers', color: '#3B82F6', data: buyerTrend.map(t => t.volume) }],
    };

    // ── Chart 8: Monthly Supplier Trend ──────────────────────────────────
    const supplierTrend = d.supplier_monthly_trend || [];
    const options8 = {
        chart: { type: 'line', height: '300px' },
        title: { text: '' },
        xAxis: { categories: supplierTrend.map(t => t.month) },
        yAxis: { title: { text: null }, lineWidth: 1 },
        credits: { enabled: false },
        plotOptions: { spline: { marker: { enable: false } } },
        legend: { symbolRadius: 0, enabled: false },
        series: [{ name: 'Monthly Transaction Volume Trend for Sellers', color: '#3B82F6', data: supplierTrend.map(t => t.volume) }],
    };

    // ── Insights computed from API ────────────────────────────────────────
    const totalStakeholders = (d.total_suppliers || 0) + (d.total_buyers || 0);
    const totalVolume = (d.supplier_txn_volume || 0) + (d.buyer_txn_volume || 0);
    const avgTxnValue = totalStakeholders > 0 ? (totalVolume / totalStakeholders) : null;

    return (
        <>
            <div className="container-fluid">
                {/* ── Location filter ── */}
                <div className="card filterCard">
                    <div className="card-body">
                        <LocationFilter token={token} onChange={(f) => setLocFilter(f)} />
                    </div>
                </div>

                <div className="row p-2">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="overviewBox">
                            <h3>Stakeholder Dashboard</h3>
                            <p>Supplier and buyer relationships, payment tracking, and transaction analysis</p>
                        </div>

                        {loading ? (
                            <div className="text-center text-muted py-5">Loading dashboard...</div>
                        ) : (
                            <>
                                {/* ── Supplier KPI Row ── */}
                                <div className="overviewCards mt-3">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card one mh150px">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Total Suppliers</h6>
                                                            <h4>{d.total_suppliers ?? '—'}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/farmer.png" alt="Suppliers" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card five mh150px">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Total Transactions</h6>
                                                            <h4>{d.supplier_total_txns ?? '—'}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/up-trend.png" alt="Transactions" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card five mh150px">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Transaction Volume</h6>
                                                            <h4>{currency} <br />{formatKES(d.supplier_txn_volume)}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/dollor.png" alt="Volume" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card six mh150px">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Pending Payments</h6>
                                                            <h4>N/A</h4>
                                                        </div>
                                                        <div><img src="./assets/images/error.png" alt="Pending" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Buyer KPI Row ── */}
                                <div className="overviewCards mt-3">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card one mh150px">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Total Buyers</h6>
                                                            <h4>{d.total_buyers ?? '—'}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/farmer.png" alt="Buyers" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card five mh150px">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Total Transactions</h6>
                                                            <h4>{d.buyer_total_txns ?? '—'}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/up-trend.png" alt="Transactions" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card five mh150px">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Transaction Volume</h6>
                                                            <h4>{currency} <br />{formatKES(d.buyer_txn_volume)}</h4>
                                                        </div>
                                                        <div><img src="./assets/images/dollor.png" alt="Volume" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-3 col-lg-3">
                                            <div className="card six mh150px">
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>Pending Payments</h6>
                                                            <h4>N/A</h4>
                                                        </div>
                                                        <div><img src="./assets/images/error.png" alt="Pending" /></div>
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
                                            <h4>Stakeholder Insights</h4>
                                            <ul className="mb-0 mt-3 ps-3">
                                                <li>Pending payments total: <strong>N/A</strong> — payment status data not available from API</li>
                                                <li>Payments overdue by 90+ days: <strong>N/A</strong></li>
                                                <li>Transaction volume growth rate: <strong>N/A</strong></li>
                                                <li>Average transaction value per stakeholder:{' '}
                                                    <strong>{avgTxnValue != null ? `${currency} ${formatKES(avgTxnValue)}` : 'N/A'}</strong>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* ── Row 1 Charts: Supplier vs Buyer Volume + Payment Aging ── */}
                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Supplier vs Buyer Transaction Volume </h4>
                                {!loading && (
                                    <HighchartsReact highcharts={Highcharts} options={options} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Payment Aging Distribution </h4>
                                <NoData />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Row 2 Charts: Top 5 Buyers + Top 5 Suppliers ── */}
                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Top 5 Stakeholders by Volume for buyers </h4>
                                {!loading && topBuyers.length > 0 ? (
                                    <HighchartsReact highcharts={Highcharts} options={options3} />
                                ) : (
                                    !loading && <NoData />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Top 5 Stakeholders by Volume for sellers </h4>
                                {!loading && topSuppliers.length > 0 ? (
                                    <HighchartsReact highcharts={Highcharts} options={options4} />
                                ) : (
                                    !loading && <NoData />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Row 3 Charts: Payment Status Distribution — no API data ── */}
                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Payment Status Distribution for buyers </h4>
                                <NoData />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Payment Status Distribution for sellers </h4>
                                <NoData />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Row 4 Charts: Monthly Trends ── */}
                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Monthly Transaction Volume Trend for Buyers </h4>
                                {!loading && buyerTrend.length > 0 ? (
                                    <HighchartsReact highcharts={Highcharts} options={options7} />
                                ) : (
                                    !loading && <NoData />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Monthly Transaction Volume Trend for Sellers </h4>
                                {!loading && supplierTrend.length > 0 ? (
                                    <HighchartsReact highcharts={Highcharts} options={options8} />
                                ) : (
                                    !loading && <NoData />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Payment Aging Analysis — no API data, kept as static UI ── */}
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Payment Aging Analysis </h4>
                                <p className="text-muted" style={{ fontSize: 12 }}>Payment aging data not available from API</p>

                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center">
                                            <div className="mx-3 ms-auto"><div className="circle1"></div></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">0-30 days</div>
                                                <p className="mb-0">N/A payments</p>
                                            </div>
                                        </div>
                                        <div><h4 className="mb-0 fw-bold">N/A</h4></div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center">
                                            <div className="mx-3 ms-auto"><div className="circle2"></div></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">31-60 days</div>
                                                <p className="mb-0">N/A payments</p>
                                            </div>
                                        </div>
                                        <div><h4 className="mb-0 fw-bold">N/A</h4></div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center">
                                            <div className="mx-3 ms-auto"><div className="circle3"></div></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">61-90 days</div>
                                                <p className="mb-0">N/A payments</p>
                                            </div>
                                        </div>
                                        <div><h4 className="mb-0 fw-bold">N/A</h4></div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center">
                                            <div className="mx-3 ms-auto"><div className="circle4"></div></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">90+ days</div>
                                                <p className="mb-0">N/A payments</p>
                                            </div>
                                        </div>
                                        <div><h4 className="mb-0 fw-bold">N/A</h4></div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Stakeholder;
