import React, { useState } from "react";
import { MultiSelect } from 'primereact/multiselect';
// import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import TableView from "./TableView";
import MapView from "./MapView";

function DmFarms() {

    const [activeTab, setActiveTab] = useState("table");
    const [selectedCities, setSelectedCities] = useState(null);
    const [date, setDate] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];


    return (
        <>
            <div className="container-fluid" style={{ padding: '0px 13px 0px 0px' }}>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card filterCard">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12 col-md-2 col-lg-2">
                                        <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                            placeholder="All Countries" maxSelectedLabels={3} className="w-100" />
                                    </div>
                                    <div className="col-sm-12 col-md-2 col-lg-2">
                                        <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                            placeholder="All Regions" maxSelectedLabels={3} className="w-100" />
                                    </div>
                                    <div className="col-sm-12 col-md-2 col-lg-2">
                                        <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                            placeholder="All Sub-Regions" maxSelectedLabels={3} className="w-100" />
                                    </div>
                                    <div className="col-sm-12 col-md-2 col-lg-2">
                                        <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                            placeholder="This Month" maxSelectedLabels={3} className="w-100" />

                                    </div>
                                    <div className="col-sm-12 col-md-2 col-lg-2">
                                        <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                            placeholder="All Crops" maxSelectedLabels={3} className="w-100" />
                                    </div>
                                    {/* <div className="col-sm-12 col-md-2 col-lg-2">
                                        <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                            placeholder="All Livestock" maxSelectedLabels={3} className="w-100" />
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row p-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div className="overviewBox">
                                <h3>Farms </h3>
                                <p>Complete farm records and geographic information</p>
                            </div>
                            <div className="d-flex">
                                <div className=" searchBox">
                                    <input
                                        type="search"
                                        className="form-control"
                                        placeholder="Search"
                                    />
                                    <span><img src="./assets/images/search.png" /></span>
                                </div>
                                <div><button className="btn btn-export pe-3"><span className="pe-2"><img src="./assets/images/download.png" alt="" /></span>Export</button></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row px-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card search">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12 col-md-9 col-lg-9">
                                        <InputText type="text" className="w-100 h46px mt-1" placeholder="Search by farm or farmer name..." />
                                        <span className="searchIcon1"><img src="./assets/images/search.png" alt="Search" /></span>
                                    </div>
                                    <div className="col-sm-12 col-md-3 col-lg-3">
                                        <div className="tabBox">
                                            <ul className="nav nav-tabs nav-fill tblmapTab border-0 mb-0 pb-0">
                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === "table" ? "active" : ""}`}
                                                        onClick={() => setActiveTab("table")}
                                                    >
                                                        <span className="pe-2"><img src="./assets/images/table.png" alt="" /></span>  Table
                                                    </button>
                                                </li>

                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === "map" ? "active" : ""}`}
                                                        onClick={() => setActiveTab("map")}
                                                    >
                                                        <span className="pe-2"><img src="./assets/images/map.png" alt="" /></span> Map
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row px-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div class="overviewCards mt-3">
                            <div class="row">
                                <div class="col-sm-12 col-md-3 col-lg-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-center align-items-center">
                                                <div class="text-center">
                                                    <h6>Total Farms</h6>
                                                    <h4 className="text-dark">4</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-3 col-lg-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-center align-items-center">
                                                <div class="text-center">
                                                    <h6>Total Size</h6>
                                                    <h4 className="text-dark">20.7 acres5</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-3 col-lg-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-center align-items-center">
                                                <div class="text-center">
                                                    <h6>Total Income</h6>
                                                    <h4 className="text-dark">KES 1080K</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-3 col-lg-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-center align-items-center">
                                                <div class="text-center">
                                                    <h6>Net Profit</h6>
                                                    <h4 className="text-dark">KES 190K</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row px-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="tab-content mt-3 bg-transparent"> 
                            {activeTab === "table" && (
                                <div className="tab-pane active">
                                   <TableView />
                                </div>
                            )}

                            {activeTab === "map" && (
                                <div className="tab-pane active">
                                    <MapView />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>




        </>
    )
}

export default DmFarms
