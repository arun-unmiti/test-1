import React from 'react';
import Filters from './Filters';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function Stakeholder() {

    const options = {
        chart: {
            type: "column",
            height: "300px",
        },
        title: {
            text: ""
        },
        xAxis: {
            categories: ["Suppliers", "Buyers"]
        },
        yAxis: {
            title: {
                text: null
            },
            lineWidth: 0
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            column: {
                borderRadius: "5%"
            }
        },
        legend: {
            symbolRadius: 0,
            enabled: false
        },
        series: [
            {
                name: "Profit",
                color: "#3B82F6",
                data: [5, 3]
            },
        ]
    };

    const options2 = {
        chart: {
            type: "column",
            height: "300px",
        },

        title: {
            text: ""
        },

        subtitle: {
            text: ""
        },

        accessibility: {
            announceNewData: {
                enabled: true
            }
        },

        xAxis: {
            type: "category"
        },

        yAxis: {
            title: {
                text: ""
            }
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: "{point.y}"
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br/>',
            pointFormat:
                '<span style="color:{point.color}">{point.name}</span>: ' +
                "<b>{point.y}</b> of total<br/>"
        },

        series: [
            {
                name: "Payment Aging Distribution",
                colorByPoint: true,
                data: [
                    { name: "0-30 days", y: 63, color: '#31A355' },
                    { name: "30-60 days", y: 19, color: '#F59E0B' },
                    { name: "61-90 days", y: 4, color: '#F97316' },
                    { name: "90+ days", y: 4, color: '#F3796E' },
                ]
            }
        ],

        credits: {
            enabled: false
        }
    };

    const options3 = {
        chart: {
            type: "bar",
            height: "300px",
        },

        title: {
            text: "",
        },

        xAxis: {
            categories: ["Nairobi Fresh <br /> Market", "Central Dairy <br /> Cooperative", "Green Agro <br /> Supplies", "FarmTech Kenya"],
            title: { text: null },
            gridLineWidth: 0
        },

        yAxis: {
            min: 0,
            max: 8,
            tickInterval: 2,
            title: { text: null },
            gridLineDashStyle: "Dash",
            gridLineColor: "#ddd"
        },

        legend: {
            enabled: false
        },

        credits: {
            enabled: false
        },

        plotOptions: {
            bar: {
                borderRadius: 4,
                pointPadding: 0.2,
                groupPadding: 0.1
            }
        },

        series: [
            {
                name: "Top 5 Stakeholders by Volume for buyers",
                color: "#31A355",
                data: [8, 7, 6, 5]
            }
        ],
    };

    const options4 = {
        chart: {
            type: "bar",
            height: "300px",
        },

        title: {
            text: "",
        },

        xAxis: {
            categories: ["Savannah <br /> Produce ", "Urban <br /> Creamery", "Eco Harvest <br /> Supplies", "AgriInnovate <br />Kenya"],
            title: { text: null },
            gridLineWidth: 0
        },

        yAxis: {
            min: 0,
            max: 8,
            tickInterval: 2,
            title: { text: null },
            gridLineDashStyle: "Dash",
            gridLineColor: "#ddd"
        },

        legend: {
            enabled: false
        },

        credits: {
            enabled: false
        },

        plotOptions: {
            bar: {
                borderRadius: 4,
                pointPadding: 0.2,
                groupPadding: 0.1
            }
        },

        series: [
            {
                name: "Top 5 Stakeholders by Volume for sellers",
                color: "#31A355",
                data: [8, 7]
            }
        ],
    };

    const options5 = {
        chart: {
            type: "pie",
            height: "300px",
        },
        title: {
            text: ""
        },
        subtitle: {
            text: ""
        },
        credits: {
            enabled: false
        },
        tooltip: {
            headerFormat: "",
            pointFormat:
                '<span style="color:{point.color}">●</span> {point.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: "%"
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                borderWidth: 2,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
                    distance: 20
                }
            }
        },
        series: [
            {
                enableMouseTracking: false,
                animation: {
                    duration: 2000
                },
                colorByPoint: true,
                data: [
                    { name: "Completed: ", y: 97, color: '#31A355' },
                    { name: "Pending: ", y: 3, color: '#F3796E' },
                ]
            }
        ]
    };

    const options6 = {
        chart: {
            type: "pie",
            height: "300px",
        },
        title: {
            text: ""
        },
        subtitle: {
            text: ""
        },
        credits: {
            enabled: false
        },
        tooltip: {
            headerFormat: "",
            pointFormat:
                '<span style="color:{point.color}">●</span> {point.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: "%"
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                borderWidth: 2,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
                    distance: 20
                }
            }
        },
        series: [
            {
                enableMouseTracking: false,
                animation: {
                    duration: 2000
                },
                colorByPoint: true,
                data: [
                    { name: "Completed: ", y: 97, color: '#31A355' },
                    { name: "Pending: ", y: 3, color: '#F3796E' },
                ]
            }
        ]
    };

    const options7 = {
        chart: {
            type: "line",
            height: "300px",
        },
        title: {
            text: ""
        },
        xAxis: {
            categories: ["Oct", "Nov", "Dec", "Jan"]
        },
        yAxis: {
            title: {
                text: null
            },
            lineWidth: 1
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            spline: {
                marker: {
                    enable: false
                }
            }
        },
        legend: {
            symbolRadius: 0,
            enabled: false
        },
        series: [
            {
                name: "Monthly Transaction Volume Trend for Buyers",
                color: "#3B82F6",
                data: [22, 23, 24, 25]
            },
        ]
    };

    const options8 = {
        chart: {
            type: "line",
            height: "300px",
        },
        title: {
            text: ""
        },
        xAxis: {
            categories: ["Oct", "Nov", "Dec", "Jan"]
        },
        yAxis: {
            title: {
                text: null
            },
            lineWidth: 1
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            spline: {
                marker: {
                    enable: false
                }
            }
        },
        legend: {
            symbolRadius: 0,
            enabled: false
        },
        series: [
            {
                name: "Monthly Transaction Volume Trend for Sellers",
                color: "#3B82F6",
                data: [22, 23, 24, 25]
            },
        ]
    };

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 px-0">
                        <Filters />
                    </div>
                </div>

                <div className="row p-2">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="overviewBox">
                            <h3>Stakeholder Dashboard</h3>
                            <p>Supplier and buyer relationships, payment tracking, and transaction analysis</p>
                        </div>

                        <div className="overviewCards mt-3">
                            <div className="row">
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card one mh150px">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Total Suppliers</h6>
                                                    <h4>2</h4>
                                                    {/* <h4>K <sup>↑ 15%</sup></h4> */}
                                                </div>
                                                <div>
                                                    <img src="./assets/images/farmer.png" alt="Dollor" />
                                                </div>
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
                                                    <h4>265</h4>
                                                    {/* <h4><sup>↑ 8%</sup> </h4> */}
                                                </div>
                                                <div>
                                                    <img src="./assets/images/up-trend.png" alt="Down Trend" />
                                                </div>
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
                                                    <h4>KES <br /> 6340K</h4>
                                                    {/* <h4>K </h4> */}
                                                </div>
                                                <div>
                                                    <img src="./assets/images/dollor.png" alt="Up Farmer" />
                                                </div>
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
                                                    <h4>KES <br /> 210K</h4>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/error.png" alt="Error" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overviewCards mt-3">
                            <div className="row">
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card one mh150px">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Total Buyers</h6>
                                                    <h4>2</h4>
                                                    {/* <h4>K <sup>↑ 15%</sup></h4> */}
                                                </div>
                                                <div>
                                                    <img src="./assets/images/farmer.png" alt="Dollor" />
                                                </div>
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
                                                    <h4>265</h4>
                                                    {/* <h4><sup>↑ 8%</sup> </h4> */}
                                                </div>
                                                <div>
                                                    <img src="./assets/images/up-trend.png" alt="Down Trend" />
                                                </div>
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
                                                    <h4>KES <br /> 6340K</h4>
                                                    {/* <h4>K </h4> */}
                                                </div>
                                                <div>
                                                    <img src="./assets/images/dollor.png" alt="Up Farmer" />
                                                </div>
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
                                                    <h4>KES <br /> 210K</h4>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/error.png" alt="Error" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="keyInsightBox mt-3">
                            <div className="card">
                                <div className="card-body p-0">
                                    <h4>Stakeholder Insights</h4>
                                    <ul className="mb-0 mt-3 ps-3">
                                        <li>Pending payments total<strong>KES 210K</strong>, representing <strong>3.3%</strong> of total transaction volume</li>
                                        <li><strong>1</strong>payment(s) overdue by 90+ days requiring immediate attention</li>
                                        <li>Transaction volume is growing at <strong>12%</strong> month-over-month </li>
                                        <li>Average transaction value per stakeholder: <strong>KES 1585K</strong> </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Supplier vs Buyer Transaction Volume </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Payment Aging Distribution </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options2}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Top 5 Stakeholders by Volume for buyers </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options3}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Top 5 Stakeholders by Volume for sellers </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options4}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Payment Status Distribution for buyers </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options5}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Payment Status Distribution for sellers </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options6}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Monthly Transaction Volume Trend for Buyers </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options7}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Monthly Transaction Volume Trend for Sellers </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options8}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                 <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Payment Aging Analysis  </h4>

                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex  align-items-center">
                                            <div className="mx-3 ms-auto"><div className="circle1"></div></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">0-30 days</div>
                                                <p  className="mb-0">3 payments</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4  className="mb-0 fw-bold">KES 85K</h4>
                                        </div>
                                    </li>

                                   <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex  align-items-center">
                                            <div className="mx-3 ms-auto"><div className="circle2"></div></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">31-60 days</div>
                                                <p  className="mb-0">2 payments</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4  className="mb-0 fw-bold">KES 65K</h4>
                                        </div>
                                    </li>

                                  <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex  align-items-center">
                                            <div className="mx-3 ms-auto"><div className="circle3"></div></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">61-90 days</div>
                                                <p  className="mb-0">1 payments</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4  className="mb-0 fw-bold">KES 35K</h4>
                                        </div>
                                    </li>

                                   <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex  align-items-center">
                                            <div className="mx-3 ms-auto"><div className="circle4"></div></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">90+ days</div>
                                                <p  className="mb-0">1 payments</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4  className="mb-0 fw-bold">KES 35K</h4>
                                        </div>
                                    </li>

                                </ul>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Stakeholder
