import React from 'react';
import Filters from './Filters';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function Overview() {

    const options = {
        chart: {
            type: "column",
            height: "300px",
        },

        title: {
            text: "",
        },

        xAxis: {
            categories: ["Maize", "Coffee", "Beans", "Tomatoes", "Wheat"],
            lineColor: "#ddd",
            tickColor: "#ddd"
        },

        yAxis: {
            title: { text: null },
            gridLineDashStyle: "Dash",
            gridLineColor: "#ddd"
        },

        legend: {
            align: "center",
            verticalAlign: "bottom",
            symbolHeight: 10,
            symbolWidth: 10,
            symbolRadius: 0
        },

        credits: {
            enabled: false
        },

        plotOptions: {
            column: {
                borderRadius: 6,
                pointWidth: 30,
                pointPadding: 0.1,
                groupPadding: 0.1,
            }
        },

        series: [
            {
                name: "Profit",
                color: "#31A355",
                data: [90000, 52000, 58000, 48000, 0]
            },
            {
                name: "Loss",
                color: "#F3796E",
                data: [0, 0, 0, 0, -0]
            }
        ]
    };

    const options2 = {
        chart: {
            type: "column",
            height: "300px",
        },

        title: {
            text: "",
        },

        xAxis: {
            categories: ["Maize", "Coffee", "Beans", "Tomatoes", "Wheat"],
            lineColor: "#ddd",
            tickColor: "#ddd"
        },

        yAxis: {
            title: { text: null },
            gridLineDashStyle: "Dash",
            gridLineColor: "#ddd"
        },

        legend: {
            align: "center",
            verticalAlign: "bottom",
            symbolHeight: 12,
            symbolWidth: 12,
            symbolRadius: 0
        },

        credits: {
            enabled: false
        },

        plotOptions: {
            column: {
                borderRadius: 6,
                pointWidth: 30,
                pointPadding: 0.1,
                groupPadding: 0.1,
            }
        },

        series: [
            {
                name: "Profit",
                color: "#31A355",
                data: [0, 0, 0, 0, 0]
            },
            {
                name: "Loss",
                color: "#F3796E",
                data: [-90000, -52000, -58000, -48000, -0]

            }
        ]
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
            categories: ["Above Average", "Below Average"],
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
                name: "Farmers",
                color: "#3b6fd8",
                data: [6, 3]
            }
        ],

        subtitle: {
            text: "<b>62.5%</b> of farmers are performing above average",
            align: "left",
            verticalAlign: "bottom",
            useHTML: true,
            style: {
                fontSize: "12px"
            }
        }
    };


    const data = [
        { name: "DAP Fertilizer", value: "1200 kg" },
        { name: "CAN Fertilizer", value: "950 kg" },
        { name: "Pesticide A", value: "450 L" },
        { name: "Herbicide B", value: "380 L" },
        { name: "Hybrid Seeds", value: "320 kg" }
    ];

    const options4 = {
        chart: {
            type: "pie",
            height: "300px",
        },

        title: {
            text: null
        },

        credits: {
            enabled: false
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "{point.name}: {point.percentage:.0f}%",
                    distance: 20,
                    style: {
                        fontSize: "12px",
                        fontWeight: "500"
                    }
                }
            }
        },

        series: [
            {
                name: "Expenses",
                data: [
                    { name: "Fertilizer", y: 30, color: "#f87171" },
                    { name: "Seeds", y: 11, color: "#34d399" },
                    { name: "Transport", y: 13, color: "#22c55e" },
                    { name: "Fuel", y: 20, color: "#eab308" },
                    { name: "Labor", y: 27, color: "#f97316" }
                ]
            }
        ]
    };

    const options5 = {
        chart: {
            type: "pie",
            height: "300px",
        },

        title: {
            text: null
        },

        credits: {
            enabled: false
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            pie: {
                size: "75%",
                allowPointSelect: false,
                dataLabels: {
                    enabled: true,
                    format: "{point.name}: {point.percentage:.0f}%",
                    distance: 18,
                    style: {
                        fontSize: "12px",
                        fontWeight: "500"
                    }
                },
                borderWidth: 0
            }
        },

        tooltip: {
            pointFormat: "<b>{point.percentage:.1f}%</b>"
        },

        series: [
            {
                name: "Revenue",
                data: [
                    { name: "Crop Sales", y: 57, color: "#34a853" },
                    // { name: "Livestock", y: 30, color: "#3b82f6" },
                    { name: "Government Supp", y: 8, color: "#f59e0b" },
                    { name: "Others", y: 5, color: "#9ca3af" }
                ]
            }
        ]
    };


    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="overviewBox">
                            <h3>Overview</h3>
                            <p>Territory-wide financial health and insights</p>
                        </div>

                        <Filters />

                        <div className="overviewCards mt-3">
                            <div className="row">
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card one">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Total Farmers</h6>
                                                    <h4>8</h4>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/farmer.png" alt="Farmer" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card two">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Total Farmers</h6>
                                                    <h4>16</h4>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/building.png" alt="Farmer" />
                                                </div>
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
                                                    <h4>46</h4>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/crops.png" alt="Farmer" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card four">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Livestock Count</h6>
                                                    <h4>143</h4>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/livestock.png" alt="Farmer" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        <div className="overviewCards mt-3">
                            <div className="row">
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card five">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Total Income</h6>
                                                    <h4>KES <br /> 3.85M</h4>
                                                    <p className="mb-0">↑ <br /> 12%</p>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/dollor.png" alt="Dollor" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card six">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Total Expenses</h6>
                                                    <h4>KES <br /> 3.06M</h4>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/trend.png" alt="Down Trend" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card seven">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Net Profit/Loss</h6>
                                                    <h4>KES <br /> 0.80M</h4>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/up-trend.png" alt="Up Farmer" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card eight">
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
                                    <h4>Key Insights</h4>
                                    <ul className="mb-0 mt-3 ps-3">
                                        <li><strong>1</strong>farmers are operating at a loss and need immediate support</li>
                                        <li><strong>1</strong>farmers are at high risk based on expense-to-income ratio</li>
                                        <li><strong>Central</strong>region has the highest number of farmers (2)</li>
                                        <li>Farmers performing above average represent <strong>50.0%</strong>of total</li>
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
                                <h4 className="chart-title">  Top 5 Profit making crops </h4>
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
                                <h4 className="chart-title">  Top 5 Loss making crops </h4>

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
                                <h4 className="chart-title">  Farmers Profit vs Loss  </h4>
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
                                <h4 className="chart-title">  Most Used Farm Inputs </h4>

                                <div className="inputs-card">
                                    {data.map((item, index) => (
                                        <div className="input-row" key={index}>
                                            <div className="left">
                                                <span className="badge">{index + 1}</span>
                                                <span className="name">{item.name}</span>
                                            </div>
                                            <div className="value">{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title">  Expense Sources Distribution </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options4}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title">  Income Sources Distribution </h4>

                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options5}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default Overview
