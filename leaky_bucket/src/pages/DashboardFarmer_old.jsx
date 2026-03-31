import React from 'react';
import Filters from './Filters';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function DashboardFarmer() {

    const options = {
        chart: {
            type: "column",
            height: "300px",
        },

        title: {
            text: "",
        },

        xAxis: {
            categories: ["Crop 1", "Crop 2", "Crop 3", "Crop 4"],
            lineColor: "#ddd",
            tickColor: "#ddd"
        },

        yAxis: {
            title: { text: "Number of Farmers" },
            gridLineDashStyle: "Dash",
            gridLineColor: "#ddd"
        },

        legend: {
            align: "center",
            verticalAlign: "bottom",
            symbolHeight: 10,
            symbolWidth: 10,
            symbolRadius: 0,
            enabled: false
        },

        credits: {
            enabled: false
        },

        plotOptions: {
            column: {
                borderRadius: 0,
                // pointWidth: 35,
                pointPadding: 0.1,
                groupPadding: 0.1,
            }
        },

        series: [
            {
                name: "Number of Crops",
                color: "#3B82F6",
                data: [90000, 90000, 90000, 90000]
            }
        ]
    };

    const options2 = {
        chart: {
            type: 'pie',
            height: "300px",
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits: {
            enabled: false
        },

        plotOptions: {
            pie: {
                innerSize: '0%',
                depth: 45,
                yAxis: {
                    title: {
                        text: "Percentage"
                    }
                }
            }
        },
        series: [{
            name: 'Farmers by performance',
            data: [
                { name: '(0-50%)', y: 10, color: '#8FCB9B' },  // Profit: Green
                { name: '(50-100%)', y: 20, color: '#74DA91' },
                { name: '(100-200)', y: 30, color: '#4BCC6B' },
                { name: '>(200%)', y: 15, color: '#3D9E5C' },
                { name: '(0-50%)', y: 10, color: '#F77576' }, // Loss: Red
                { name: '(50-100%)', y: 15, color: '#F75D5D' },
                { name: '(100-200)', y: 5, color: '#F43C3C' },
                { name: '>(200%)', y: 5, color: '#D52A2A' }
            ]
        }]
    };


    const options3 = {
        chart: {
            type: 'column',
            height: "300px",
        },
        title: {
            text: '' // Add your title here if needed
        },
        xAxis: {
            categories: ['Central', 'Nyanza', 'Eastern', 'Rift Valley']
        },
        credits: {
            enabled: false
        },
        legend: {
            align: "center",
            verticalAlign: "bottom",
            symbolHeight: 10,
            symbolWidth: 10,
            symbolRadius: 0
        },
        yAxis: {
            title: { text: null },
            gridLineDashStyle: "Dash",
            gridLineColor: "#ddd"
        },
        plotOptions: {
            column: {
                borderRadius: 5 // borderRadius is a number without units
            }
        },
        series: [
            {
                name: 'Income',
                color: "#31A355",
                data: [5, 3, 4, 7]
            },
            {
                name: 'Expense',
                color: "#F3796E",
                data: [2, 2, 3, 2]
            }
        ]
    };



    const options4 = {
        chart: {
            type: "bar",
            height: "300px",
        },
        title: {
            text: ""
        },
        xAxis: {
            categories: [
                "Joseph",
                "Kipchoge",
                "Peter Ochieng",
                "John Kamau",
                "Agnes Chebet",
                "Sarah Akinyi"
            ],
            title: {
                text: null
            },
            gridLineWidth: 1,
            lineWidth: 0
        },
        yAxis: {
            min: 0,
            title: {
                text: "",
                align: "high"
            },
            labels: {
                overflow: "justify"
            },
            gridLineWidth: 0
        },
        tooltip: {
            valueSuffix: " millions"
        },
        plotOptions: {
            bar: {
                borderRadius: "5%",
                dataLabels: {
                    enabled: true
                },
                groupPadding: 0.1
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        series: [
            {
                name: "Profitable Farmers",
                color: '#31A355',
                data: [851, 814, 757, 700, 650, 602]
            }
        ]
    };

    const options5 = {
        chart: {
            type: "bar",
            height: "300px",
        },
        title: {
            text: ""
        },
        xAxis: {
            categories: [
                "Joseph",
                "Kipchoge",
                "Peter Ochieng",
                "John Kamau",
                "Agnes Chebet",
                "Sarah Akinyi"
            ],
            title: {
                text: null
            },
            gridLineWidth: 1,
            lineWidth: 0
        },
        yAxis: {
            min: 0,
            title: {
                text: "",
                align: "high"
            },
            labels: {
                overflow: "justify"
            },
            gridLineWidth: 0
        },
        tooltip: {
            valueSuffix: " millions"
        },
        plotOptions: {
            bar: {
                borderRadius: "5%",
                dataLabels: {
                    enabled: true
                },
                groupPadding: 0.1
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        series: [
            {
                name: "Profitable Farmers",
                color: '#F3796E',
                data: [851, 814, 757, 700, 650, 602]
            }
        ]
    };


    return (
        <>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 px-0">
                        <Filters />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="overviewBox mt-3">
                            <h3>Farmer Dashboard</h3>
                            <p>Overview of farmer performance, profitability, and risk analysis</p>
                        </div>
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
                                    <div className="card six">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>At-Risk Farmers</h6>
                                                    <h4>1</h4>
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
                                <h4 className="chart-title"> Farmers by Number of Crops </h4>
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
                                <h4 className="chart-title">  Farmers by performance </h4>

                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options2}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title">  Income vs Expense by Region </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options3}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title">  Top 10 Profitable Farmers </h4>
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
                                <h4 className="chart-title">  Farmers with Losses (Need Intervention) </h4>

                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options5}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title">  Average Performance Benchmark </h4>
                                <div className="pbenchMark d-flex justify-content-between mt-4">
                                    <div>
                                        <h4 className="mb-0">Average Income per Farmer</h4>
                                    </div>
                                    <div>
                                        <h3>KES 481K</h3>
                                    </div>
                                </div>

                                 <div className="pbenchMark green d-flex justify-content-between mt-3">
                                    <div>
                                        <h4 className="mb-0">Average Expense per Farmer</h4>
                                    </div>
                                    <div>
                                        <h3>KES 481K</h3>
                                    </div>
                                </div>
                                <hr />

                                <div className="pbenchMark blue d-flex justify-content-between mt-3">
                                    <div>
                                        <h4 className="mb-0">Farmers Above Average</h4>
                                    </div>
                                    <div>
                                        <h3>4 / 8</h3>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="card chartCard">
                            <div className="card-body">
                                <h4 className="chart-title"> Quick Actions</h4>

                                <div className="benchMark d-flex justify-content-between px-3 mt-3">
                                    <div>
                                        <h4 className="mb-0">View At-Risk Farmers</h4>
                                    </div>
                                    <div>
                                        <span><img src="./assets/images/error-white.png" alt="" /></span>
                                    </div>
                                </div>

                                <div className="benchMark green d-flex justify-content-between px-3 mt-3">
                                    <div>
                                        <h4 className="mb-0">View Top Performer</h4>
                                    </div>
                                    <div>
                                        <span><img src="./assets/images/trend-up.png" alt="" /></span>
                                    </div>
                                </div>

                                <div className="benchMark white d-flex justify-content-between px-3 mt-3">
                                    <div>
                                        <h4 className="mb-0">View All Farmers Data</h4>
                                    </div>
                                    <div>
                                        <span><img src="./assets/images/eye.png" alt="" /></span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default DashboardFarmer
