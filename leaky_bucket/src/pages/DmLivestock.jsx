import React, { useState } from "react";
import Filters from './Filters';


function DmLivestock() {

    const [selectedCities, setSelectedCities] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    return (
         <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 px-0">
                        <Filters />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div className="overviewBox">
                                <h3>Livestock </h3>
                                <p>Aggregate livestock production, feed costs, and profitability</p>
                            </div>
                        </div>
                    </div>
                </div>

               

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card tbl">
                            <div className="card-body">
                                <p>Livestock Details</p>
                                <div className="table-responsive">
                                    <table className="table tblView">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Breed</th>
                                                <th>Farmer</th>
                                                <th>Farm</th>
                                                <th>Count</th>
                                                <th>Milk (L/day)</th>
                                                <th>Feed Cost</th>
                                                <th>Mortality</th>
                                                <th>Revenue</th>
                                                <th>Expense</th>
                                                <th>Profit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="td-title">Cattle</td>
                                                <td>Friesian</td>
                                                <td>John Kamau</td>
                                                <td className="td-light">Green Valley Farm</td>
                                                <td>8</td>
                                                <td>120L</td>
                                                <td>KES 45K</td>
                                                <td><span className="">0</span></td>
                                                <td className="td-title">KES 95K</td>
                                                <td className="td-green">KES 95K</td>
                                                <td className="td-bold"><span className="pe-2"><img src="./assets/images/up-trend.png" alt="" /></span>KES 85K</td>
                                            </tr>

                                            <tr>
                                                <td className="td-title">Goats</td>
                                                <td>Friesian</td>
                                                <td>John Kamau</td>
                                                <td className="td-light">Green Valley Farm</td>
                                                <td>7</td>
                                                <td>28L</td>
                                                <td>KES 45K</td>
                                                <td><span className="badge">1</span></td>
                                                <td className="td-title">KES 32K</td>
                                                <td className="td-green">KES 22K</td>
                                                <td className="td-bold"><span className="pe-2"><img src="./assets/images/up-trend.png" alt="" /></span>KES 85K</td>
                                            </tr>

                                            <tr>
                                                <td className="td-title">Cattle</td>
                                                <td>Friesian</td>
                                                <td>John Kamau</td>
                                                <td className="td-light">Green Valley Farm</td>
                                                <td>5</td>
                                                <td>65L</td>
                                                <td>KES 45K</td>
                                                <td><span className="">0</span></td>
                                                <td className="td-title">KES 32K</td>
                                                <td className="td-green">KES 22K</td>
                                                <td className="td-bold"><span className="pe-2"><img src="./assets/images/up-trend.png" alt="" /></span>KES 85K</td>
                                            </tr>
                                           
                                          <tr>
                                                <td className="td-title">Poultry</td>
                                                <td>Layers</td>
                                                <td>Mary Wanjiru</td>
                                                <td className="td-light">Hope Farm</td>
                                                <td>50</td>
                                                <td>N/A</td>
                                                <td>KES 15K</td>
                                                <td><span className="badge">3</span></td>
                                                <td className="td-title">KES 25K</td>
                                                <td className="td-green">KES 18K</td>
                                                <td className="td-bold"><span className="pe-2"><img src="./assets/images/up-trend.png" alt="" /></span>KES 85K</td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="keyInsightBox livestockBox">
                            <div className="card">
                                <div className="card-body p-0">
                                    <h4>Livestock Insights</h4>
                                    <ul className="mb-0 mt-4 ps-3">
                                        <li>Average milk production per dairy animal: <strong>71.0L per day</strong></li>
                                        <li><strong>0</strong>livestock groups have feed costs exceeding 60% of revenue</li>
                                        <li>Total mortality rate: <strong>5.7%</strong></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default DmLivestock
