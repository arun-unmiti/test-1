import React from 'react';
import Filters from './Filters';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function Livestock() {

    const options = {
        chart: {
            type: "column",
            height: "300px",
        },
        title: {
            text: ""
        },
        xAxis: {
            categories: ["Cattle (Friesian)", "Goats (Toggenburg)", "Cattle (Ayrshire)", "Poultry (Layers)"]
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
                name: "Profit",
                color: "#31A355",
                data: [5, 3, 4, 7]
            },
        ]
    };

    const options2 = {
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

    const options3 = {
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
                name: "Monthly Milk Production",
                color: "#3B82F6",
                data: [24916, 37941, 29742, 29851]
            },
        ]
    };

     const options4 = {
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
                name: "Feed Cost",
                color: "#F59E0B",
                data: [5, 3, 4, 7]
            },
            {
                name: "Revenue",
                color: "#31A355",
                data: [2, 2, 3, 2]
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
                </div>

                <div className="row p-2">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="overviewBox mt-3">
                            <h3>Livestock Dashboard</h3>
                            <p>Production metrics, profitability, and health monitoring</p>
                        </div>


                        <div className="overviewCards mt-3">
                            <div className="row">
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card one mh150px">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Total Livestock</h6>
                                                    <h4>70</h4>
                                                    {/* <h4>K <sup>↑ 15%</sup></h4> */}
                                                </div>
                                                <div>
                                                    <img src="./assets/images/livestock.png" alt="Dollor" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card one mh150px">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Daily Milk Production</h6>
                                                    <h4>213L</h4>
                                                    <h4><sup>↑ 8%</sup> </h4>
                                                </div>
                                                <div>
                                                    <img src="./assets/images/milk.png" alt="Down Trend" />
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
                                                    <h6>Total Revenue</h6>
                                                    <h4>KES <br /> 170K</h4>
                                                    {/* <h4>K </h4> */}
                                                </div>
                                                <div>
                                                    <img src="./assets/images/up-trend.png" alt="Up Farmer" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <div className="card eight mh150px">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6>Mortality Rate</h6>
                                                    <h4>5.7% </h4>
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
                                    <div className="card three h100px">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <div className="text-center">
                                                    <h6>Feed Costs</h6>
                                                    <h4>KES 116K</h4>
                                                </div>
                                                {/* <div>
                                                    <img src="./assets/images/farmer.png" alt="Farmer" />
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-4 col-lg-4">
                                    <div className="card three h100px">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <div className="text-center">
                                                    <h6>Total Expenses</h6>
                                                    <h4>KES 157K</h4>
                                                </div>
                                                {/* <div>
                                                    <img src="./assets/images/building.png" alt="Farmer" />
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-4 col-lg-4">
                                    <div className="card three h100px">
                                        <div className="card-body p-0">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <div className="text-center">
                                                    <h6>Net Profit</h6>
                                                    <h4 className="text-dark">KES 113K</h4>
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
                                    <h4>Livestock Insights</h4>
                                    <ul className="mb-0 mt-3 ps-3">
                                        <li>Average milk production per dairy animal:<strong>71.0L per day</strong></li>
                                        <li>Feed costs represent <strong>73.9%</strong> of total livestock expenses</li>
                                        <li>Overall mortality rate: <strong>5.7%</strong> </li>
                                        <li>Milk production shows <strong>8% growth</strong> over the last 5 months</li>
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
                                <h4 className="chart-title"> Profitability by Animal Type </h4>
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
                                <h4 className="chart-title"> Livestock Distribution </h4>
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
                                <h4 className="chart-title"> Monthly Milk Production Trend </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options3}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card chartCard mt-3">
                            <div className="card-body">
                                <h4 className="chart-title"> Feed Cost vs Revenue </h4>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options4}
                                />
                            </div>
                        </div>
                    </div> 
                </div>


            </div>
        </>
    )
}

export default Livestock
