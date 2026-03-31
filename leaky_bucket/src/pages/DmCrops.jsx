import React, { useState } from "react";
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from "primereact/inputtext";
import Filters from './Filters';


function DmCrops() {

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
                                <h3>Crops </h3>
                                <p>Detect crop-level inefficiencies and performance</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card search">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12 col-md-9 col-lg-9">
                                        <InputText type="text" className="w-100 h46px mt-1" placeholder="Search by farm or farmer name..." />
                                        <span className="searchIcon1"><img src="./assets/images/search.png" alt="Search" /></span>
                                    </div>
                                    <div className="col-sm-12 col-md-3 col-lg-3">
                                        <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                            placeholder="All Crops" maxSelectedLabels={3} className="w-100 mt-1 h46px" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div class="overviewCards mt-3">
                            <div class="row">
                                <div class="col-sm-12 col-md-3 col-lg-3">
                                    <div class="card search">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-center align-items-center">
                                                <div class="text-center">
                                                    <h6>Total Crops</h6>
                                                    <h4 className="text-dark">5</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-3 col-lg-3">
                                    <div class="card search">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-center align-items-center">
                                                <div class="text-center">
                                                    <h6>Total Revenue</h6>
                                                    <h4 className="text-dark">KES 660K</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-3 col-lg-3">
                                    <div class="card search">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-center align-items-center">
                                                <div class="text-center">
                                                    <h6>Total Expense</h6>
                                                    <h4 className="text-green">KES 535K</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-3 col-lg-3">
                                    <div class="card search">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-center align-items-center">
                                                <div class="text-center">
                                                    <h6>Net Profit</h6>
                                                    <h4 className="text-dark">KES 125K</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card tbl">
                            <div className="card-body">
                                <p>Crop Performance Analysis</p>
                                <div className="table-responsive">
                                    <table className="table tblView">
                                        <thead>
                                            <tr>
                                                <th>Crop</th>
                                                <th>Farmer</th>
                                                <th>Farm</th>
                                                <th>Land Size (acres)</th>
                                                <th>Avg Price</th>
                                                <th>Revenue</th>
                                                <th>Expense</th>
                                                <th>Profit</th>
                                                <th>Yield/Acre</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="td-title">Maize</td>
                                                <td>John Kamau</td>
                                                <td className="td-light">Green Valley Farm</td>
                                                <td>2.5</td>
                                                <td>KES 45</td>
                                                <td>KES 180K</td>
                                                <td className="td-green">KES 95K</td>
                                                <td className="td-bold"><span className="pe-2"><img src="./assets/images/up-trend.png" alt="" /></span>KES 85K</td>
                                                <td>1600 kg</td>
                                            </tr>

                                            <tr>
                                                <td className="td-title">Beans</td>
                                                <td>John Kamau</td>
                                                <td className="td-light">Green Valley Farm</td>
                                                <td>1.5</td>
                                                <td>KES 45</td>
                                                <td>KES 180K</td>
                                                <td className="td-green">KES 95K</td>
                                                <td className="td-bold"><span className="pe-2"><img src="./assets/images/up-trend.png" alt="" /></span>KES 85K</td>
                                                <td>750 kg</td>
                                            </tr>

                                            <tr>
                                                <td className="td-title">Coffee</td>
                                                <td>John Kamau</td>
                                                <td className="td-light">Green Valley Farm</td>
                                                <td>2.5</td>
                                                <td>KES 45</td>
                                                <td>KES 180K</td>
                                                <td className="td-green">KES 95K</td>
                                                <td className="td-bold"><span className="pe-2"><img src="./assets/images/up-trend.png" alt="" /></span>KES 85K</td>
                                                <td>220 kg</td>
                                            </tr>

                                            <tr>
                                                <td className="td-title">Maize</td>
                                                <td>John Kamau</td>
                                                <td className="td-light">Green Valley Farm</td>
                                                <td>2.5</td>
                                                <td>KES 45</td>
                                                <td>KES 180K</td>
                                                <td className="td-green">KES 95K</td>
                                                <td className="td-bold"><span className="pe-2"><img src="./assets/images/up-trend.png" alt="" /></span>KES 85K</td>
                                                <td>1600 kg</td>
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
                        <div className="keyInsightBox">
                            <div className="card">
                                <div className="card-body p-0">
                                    <h4>Key Insights</h4>
                                    <ul className="mb-0 mt-4 ps-3">
                                        <li><strong>1</strong>crops are showing losses and need intervention</li>
                                        <li><strong>1</strong>crops have fertilizer costs exceeding 40% of revenue</li>
                                        <li>Average yield per acre across all crops: <strong>1134 kg</strong></li>
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

export default DmCrops
