import React from 'react';
import Filters from './Filters';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/heatmap";

// Heatmap(Highcharts);

function CropLedger() {

    const options = {
        chart: {
            type: "column",
            height: "300px",
        },
        title: {
            text: ""
        },
        xAxis: {
            categories: ["Maize", "Beans", "Coffee", "Tomatoes"]
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
            symbolRadius: 0
        },
        series: [
            {
                name: "Revenue",
                color: "#31A355",
                data: [5, 3, 4, 7]
            },
            {
                name: "Expense",
                color: "#F3796E",
                data: [2, 2, 3, 2]
            }
        ]
    };

    const options2 = {
        chart: {
            type: "line",
            height: "300px",
        },
        title: {
            text: ""
        },
        xAxis: {
            categories: ["Maize", "Beans", "Coffee", "Tomatoes"]
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
            column: {
                borderRadius: "5%"
            }
        },
        series: [
            {
                name: "Revenue",
                color: "#31A355",
                data: [24916, 37941, 29742, 29851]
            },
            {
                name: "Expense",
                color: "#F3796E",
                data: [11744, 30000, 16005, 19771]
            }
        ]
    };

    const options3 = {
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
                    { name: "Fertilizer: ", y: 36, color: '#F3796E' },
                    { name: "Equipment: ", y: 24, color: '#6B7280' },
                    { name: "Seeds: ", y: 15, color: '#84CC16' },
                    { name: "Labor: ", y: 20, color: '#EAB308' },
                    { name: "Other", y: 15, color: '#F97316' }
                ]
            }
        ]
    };

    const options4 = {
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
                    { name: "Maize: ", y: 36, color: '#F3796E' },
                    { name: "Tomatoes: ", y: 24, color: '#6B7280' },
                    { name: "Coffee: ", y: 15, color: '#84CC16' },
                    { name: "Beans: ", y: 20, color: '#EAB308' },
                ]
            }
        ]
    };

    const options5 = {
        chart: {
            type: "column",
            height: "300px",
        },
        title: {
            text: ""
        },
        xAxis: {
            categories: ["Harvesting", "Growing", "Flowering"]
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
            symbolRadius: 0
        },
        series: [
            {
                name: "Revenue",
                color: "#3B82F6",
                data: [5, 3, 4]
            },
        ]
    };

    const options6 = {
        chart: {
            type: "line",
            height: "300px",
        },
        title: {
            text: ""
        },
        xAxis: {
            categories: ["Maize", "Beans", "Coffee", "Tomatoes"]
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
            column: {
                borderRadius: "5%"
            }
        },
        series: [
            {
                name: "Avg Farmer Price",
                color: "#3B82F6",
                data: [24916, 37941, 29742, 29851]
            },
            {
                name: "Sold Above Average Price",
                color: "#31A355",
                data: [11744, 30000, 16005, 19771]
            }
        ]
    };

    const options7 = {
        chart: {
            type: "heatmap",
            height: 300
        },

        title: {
            text: ""
        },

        xAxis: {
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ]
        },

        yAxis: {
            categories: ["Maize", "Beans", "Coffee"],
            title: null
        },

        colorAxis: {
            dataClasses: [
                { from: 1, to: 1, color: "#F3E37C", name: "Planting" },
                { from: 2, to: 2, color: "#B7E1B0", name: "Growing" },
                { from: 3, to: 3, color: "#6DB56D", name: "Flowering" },
                { from: 4, to: 4, color: "#F0A85C", name: "Harvesting" }
            ]
        },

        legend: {
            align: "left",
            layout: "horizontal",
            verticalAlign: "bottom"
        },

        tooltip: {
            formatter: function () {
                return `<b>${this.series.yAxis.categories[this.point.y]}</b> - 
                ${this.series.xAxis.categories[this.point.x]}`;
            }
        },

        series: [
            {
                borderWidth: 1,
                data: [
                    [0, 0, 1], [1, 0, 2], [2, 0, 3], [6, 0, 1], [7, 0, 2], [8, 0, 3],
                    [0, 1, 2], [1, 1, 1], [6, 1, 2], [7, 1, 1],
                    [4, 2, 4], [5, 2, 4], [8, 2, 2], [9, 2, 3], [10, 2, 3]
                ],
                dataLabels: {
                    enabled: false
                }
            }
        ],

        credits: {
            enabled: false
        }
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
                        <div className="overviewBox mt-3">
                            <h3>Crop Ledger Dashboard</h3>
                            <p>Financial overview and profitability analysis by crop</p>
                        </div>


                        <div className="overviewCards mt-3">
                            <div className="row">
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card five">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Total Revenue</h6>
                                                    <h4>KES <br />660</h4>
                                                    <h4>K <sup>↑ 15%</sup></h4>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/up-trend.png" alt="Dollor" />
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
                                                    <h6>Total Cost</h6>
                                                    <h4>KES <br /> 535K</h4>
                                                    <h4>K </h4>
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
                                                    <h6>Net Profit</h6>
                                                    <h4>KES <br /> 125</h4>
                                                    <h4>K </h4>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/up-trend.png" alt="Up Farmer" />
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
                                                    <h6>Avg Sale Price</h6>
                                                    <h4>KES <br /> 111 </h4>
                                                    <h4>K</h4>
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
                                <div className="col-sm-12 col-md-4 col-lg-4">
                                    <div className="card one">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <div className="text-center">
                                                    <h6>Total Crops</h6>
                                                    <h4>5</h4>
                                                </div>
                                                {/* <div>
                                                    <img src="./assets/images/farmer.png" alt="Farmer" />
                                                </div> */}
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
                                                    <h4>4</h4>
                                                </div>
                                                {/* <div>
                                                    <img src="./assets/images/building.png" alt="Farmer" />
                                                </div> */}
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
                                                    <h4>1</h4>
                                                </div>
                                                {/* <div>
                                                    <img src="./assets/images/crops.png" alt="Farmer" />
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="keyInsightBox mt-3">
                            <div className="card">
                                <div className="card-body p-0">
                                    <h4>Financial Insights</h4>
                                    <ul className="mb-0 mt-3 ps-3">
                                        <li>Overall profit margin across all crops:<strong>18.9%</strong></li>
                                        <li>Fertilizer costs represent <strong>37.0%</strong> of total expenses</li>
                                        <li>Labor costs represent <strong>30.1%</strong> of total expenses</li>
                                        <li>Revenue shows an upward trend with <strong>15% growth</strong>over the last 5 months</li>
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
                                <h4 className="chart-title"> Profitability by Crop Type </h4>
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
                                <h4 className="chart-title"> Monthly Revenue & Expense Trend </h4>
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
                                <h4 className="chart-title"> Expense Category Breakdown </h4>
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
                                <h4 className="chart-title"> Revenue Distribution by Crop </h4>
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
                                <h4 className="chart-title"> Expense by Crop cycle stage </h4>
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
                                <h4 className="chart-title"> Crop Price Analysis </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options6}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Profit Margin Analysis by Crop </h4>

                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-start mb-2">
                                        <div className="d-flex  align-items-center">
                                            <div className="mx-3 ms-auto"><img src="./assets/images/crops.png" alt="" /></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">Maize</div>
                                                <p  className="mb-0">Revenue: KES 315K | Cost: KES 280K</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4  className="mb-0 fw-bold">KES 35K</h4>
                                            <p className="mb-0">11.1% margin</p>
                                        </div>
                                    </li>

                                    <li className="list-group-item d-flex justify-content-between align-items-start mb-2">
                                        <div className="d-flex  align-items-center">
                                            <div className="mx-3 ms-auto"><img src="./assets/images/crops.png" alt="" /></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">Beans</div>
                                                <p  className="mb-0">Revenue: KES 95K | Cost: KES 58K</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4  className="mb-0 fw-bold">KES 37K</h4>
                                            <p className="mb-0">38.9% margin</p>
                                        </div>
                                    </li>

                                   <li className="list-group-item d-flex justify-content-between align-items-start mb-2">
                                        <div className="d-flex  align-items-center">
                                            <div className="mx-3 ms-auto"><img src="./assets/images/crops.png" alt="" /></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">Coffee</div>
                                                <p  className="mb-0">Revenue: KES 105K | Cost: KES 72K</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4  className="mb-0 fw-bold">KES 33K</h4>
                                            <p className="mb-0">31.4% margin</p>
                                        </div>
                                    </li>

                                    <li className="list-group-item d-flex justify-content-between align-items-start mb-2">
                                        <div className="d-flex  align-items-center">
                                            <div className="mx-3 ms-auto"><img src="./assets/images/crops.png" alt="" /></div>
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">Tomatoes</div>
                                                <p  className="mb-0">Revenue: KES 145K | Cost: KES 125K</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4  className="mb-0 fw-bold">KES 20K</h4>
                                            <p className="mb-0">13.8% margin</p>
                                        </div>
                                    </li>

                                </ul>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Seasonal Crop Calendar Heatmap </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options7}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default CropLedger
