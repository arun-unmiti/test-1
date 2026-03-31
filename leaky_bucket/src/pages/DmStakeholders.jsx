import React, { useState } from "react";
import Filters from './Filters';


function DmStakeholders() {
    const [activeTab, setActiveTab] = useState("stakeholders");

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
                                <h3>Stakeholders & Payments </h3>
                                <p>Manage suppliers, buyers, and payment tracking</p>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="row mt-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card tbl search">
                            <div className="card-body">
                                <p>Stakeholder Directory</p>

                                <div className="row">
                                    <div className="col-sm-12 col-md-5 col-lg-5">
                                        <div className="tabBox">
                                            <ul className="nav nav-tabs nav-fill  tblmapTab border-0 mb-0 pb-0">
                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === "stakeholders" ? "active" : ""}`}
                                                        onClick={() => setActiveTab("stakeholders")}
                                                    >
                                                        All Stakeholders
                                                    </button>
                                                </li>

                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === "suppliers" ? "active" : ""}`}
                                                        onClick={() => setActiveTab("suppliers")}
                                                    >
                                                        Suppliers
                                                    </button>
                                                </li>

                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === "buyers" ? "active" : ""}`}
                                                        onClick={() => setActiveTab("buyers")}
                                                    >
                                                        Buyers
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>



                                <div className="tab-content mt-3 bg-transparent">
                                    {activeTab === "stakeholders" && (
                                        <div className="tab-pane active">
                                            <div className="table-responsive">
                                                <table className="table tblView">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Type</th>
                                                            <th>Phone</th>
                                                            <th>Total Transactions</th>
                                                            <th>Total Amount</th>
                                                            <th>Pending Payments</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="td-title">Green Agro Supplies</td>
                                                            <td><span className="darkbadge">supplier</span></td>
                                                            <td><span className="pe-2"><img src="./assets/images/phone.png" alt="" /></span> +254700111222</td>
                                                            <td>45</td>
                                                            <td className="td-title">KES 1250K</td>
                                                            <td className="td-green">KES 95K</td>
                                                            <td><span className="badge">Outstanding</span></td>
                                                        </tr>

                                                        <tr>
                                                            <td className="td-title">Green Agro Supplies</td>
                                                            <td><span className="darkbadge">supplier</span></td>
                                                            <td><span className="pe-2"><img src="./assets/images/phone.png" alt="" /></span> +254700111222</td>
                                                            <td>45</td>
                                                            <td className="td-title">KES 1250K</td>
                                                            <td className="td-green">KES 95K</td>
                                                            <td><span className="badge">Outstanding</span></td>
                                                        </tr>

                                                        <tr>
                                                            <td className="td-title">Green Agro Supplies</td>
                                                            <td><span className="darkbadge">supplier</span></td>
                                                            <td><span className="pe-2"><img src="./assets/images/phone.png" alt="" /></span> +254700111222</td>
                                                            <td>45</td>
                                                            <td className="td-title">KES 1250K</td>
                                                            <td className="td-green">KES 95K</td>
                                                            <td><span className="badge">Outstanding</span></td>
                                                        </tr>

                                                        <tr>
                                                            <td className="td-title">Green Agro Supplies</td>
                                                            <td><span className="darkbadge">supplier</span></td>
                                                            <td><span className="pe-2"><img src="./assets/images/phone.png" alt="" /></span> +254700111222</td>
                                                            <td>45</td>
                                                            <td className="td-title">KES 1250K</td>
                                                            <td className="td-green">KES 95K</td>
                                                            <td><span className="badge">Outstanding</span></td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "suppliers" && (
                                        <div className="tab-pane active">
                                            <div className="table-responsive">
                                                <table className="table tblView">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Type</th>
                                                            <th>Phone</th>
                                                            <th>Total Transactions</th>
                                                            <th>Total Amount</th>
                                                            <th>Pending Payments</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="td-title">Green Agro Supplies</td>
                                                            <td><span className="darkbadge">supplier</span></td>
                                                            <td><span className="pe-2"><img src="./assets/images/phone.png" alt="" /></span> +254700111222</td>
                                                            <td>45</td>
                                                            <td className="td-title">KES 1250K</td>
                                                            <td className="td-green">KES 95K</td>
                                                            <td><span className="badge">Outstanding</span></td>
                                                        </tr>

                                                        <tr>
                                                            <td className="td-title">Green Agro Supplies</td>
                                                            <td><span className="darkbadge">supplier</span></td>
                                                            <td><span className="pe-2"><img src="./assets/images/phone.png" alt="" /></span> +254700111222</td>
                                                            <td>45</td>
                                                            <td className="td-title">KES 1250K</td>
                                                            <td className="td-green">KES 95K</td>
                                                            <td><span className="clear">Clear</span></td>
                                                        </tr>


                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "buyers" && (
                                        <div className="tab-pane active">
                                            <div className="tab-pane active">
                                                <div className="table-responsive">
                                                    <table className="table tblView">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Type</th>
                                                                <th>Phone</th>
                                                                <th>Total Transactions</th>
                                                                <th>Total Amount</th>
                                                                <th>Pending Payments</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="td-title">Nairobi Fresh Market</td>
                                                                <td><span className="buyerbadge">buyers</span></td>
                                                                <td><span className="pe-2"><img src="./assets/images/phone.png" alt="" /></span> +254700111222</td>
                                                                <td>45</td>
                                                                <td className="td-title">KES 1250K</td>
                                                                <td className="td-green">KES 95K</td>
                                                                <td><span className="badge">Outstanding</span></td>
                                                            </tr>

                                                            <tr>
                                                                <td className="td-title">Nairobi Fresh Market</td>
                                                                <td><span className="buyerbadge">buyers</span></td>
                                                                <td><span className="pe-2"><img src="./assets/images/phone.png" alt="" /></span> +254700111222</td>
                                                                <td>45</td>
                                                                <td className="td-title">KES 1250K</td>
                                                                <td className="td-green">KES 0</td>
                                                                <td><span className="clear">Clear</span></td>
                                                            </tr>


                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>



                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="row mt-3">
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
                </div> */}

            </div>
        </>
    )
}

export default DmStakeholders
