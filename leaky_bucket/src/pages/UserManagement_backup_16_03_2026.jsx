import React, { useState } from "react";
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from "primereact/inputtext";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


function UserManagement(props) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [showEdit, setShowEdit] = useState(false);
    const handleEditClose = () => setShowEdit(false);
    const handleEditShow = () => setShowEdit(true);

    const [showDelete, setShowDelete] = useState(false);
    const handleDeleteClose = () => setShowDelete(false);
    const handleDeleteShow = () => setShowDelete(true);

    const [showReset, setShowReset] = useState(false);
    const handleResetClose = () => setShowReset(false);
    const handleResetShow = () => setShowReset(true);




    const [activeTab, setActiveTab] = useState("table");
    const [selectedCities, setSelectedCities] = useState(null);
    const [selectedCities1, setSelectedCities1] = useState(null);

    const [perPage, setPerPage] = useState(5);
    const totalRecords = 5;

    const [date, setDate] = useState(null);
    const cities = [
        { name: 'New York', name1: 'New York', code: 'NY', firstName: 'Lal', lastName: 'Paul', email: 'email1@gmail.com', phone: '9876543210', role: 'Country Admin' },
        { name: 'Rome', name1: 'Rome', code: 'RM', firstName: 'First', lastName: 'Last', email: 'email2@gmail.com', phone: '9876543210', role: 'Super Admin' },
        { name: 'London', name1: 'London', code: 'LDN', firstName: 'First1', lastName: 'Last1', email: 'email3@gmail.com', phone: '6776543210', role: 'Admin' },
        { name: 'Istanbul', name1: 'Istanbul', code: 'IST', firstName: 'First2', lastName: 'Last2', email: 'email4@gmail.com', phone: '6776543210', role: 'Super ' },
        { name: 'Paris', name1: 'Paris', code: 'PRS', firstName: 'First3', lastName: 'Last3', email: 'email5@gmail.com', phone: '6776543210', role: 'Super ' }
    ];

    const cities1 = [
        { name: 'New York', name1: 'New York', code: 'NY', firstName: 'Lal', lastName: 'Paul', email: 'email1@gmail.com', phone: '9876543210', role: 'Country Admin' },
        { name: 'Rome', name1: 'Rome', code: 'RM', firstName: 'First', lastName: 'Last', email: 'email2@gmail.com', phone: '9876543210', role: 'Super Admin' },
        { name: 'London', name1: 'London', code: 'LDN', firstName: 'First1', lastName: 'Last1', email: 'email3@gmail.com', phone: '6776543210', role: 'Admin' },
        { name: 'Istanbul', name1: 'Istanbul', code: 'IST', firstName: 'First2', lastName: 'Last2', email: 'email4@gmail.com', phone: '6776543210', role: 'Super ' },
        { name: 'Paris', name1: 'Paris', code: 'PRS', firstName: 'First3', lastName: 'Last3', email: 'email5@gmail.com', phone: '6776543210', role: 'Super ' }
    ];


    return (
        <>
            <div className="container-fluid">
                <div className="row p-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div className="overviewBox">
                                <h3>User Management</h3>
                                <p>Manage admin users and permissions</p>
                            </div>
                            <div>
                                <button className="btn btn-addnew" onClick={handleShow}><img src="./assets/images/user.png" /> Add Users</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card tbl search">
                            <div className="card-body">
                                <p>Filters</p>

                                <div className="row">
                                    <div className="col-sm-12 col-md-4 col-lg-4">
                                        <label>Country</label>
                                        <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                            placeholder="All Countries" maxSelectedLabels={3} className="w-100" />
                                    </div>
                                    <div className="col-sm-12 col-md-4 col-lg-4">
                                        <label>Role</label>
                                        <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                            placeholder="All Roles" maxSelectedLabels={3} className="w-100" />
                                    </div>
                                    <div className="col-sm-12 col-md-4 col-lg-4">
                                        <label>Search</label>
                                        <InputText type="text" className="w-100" placeholder="Search by name or email or phone..." />
                                        <span className="searchIcon"><img src="./assets/images/search.png" alt="Search" /></span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


                <div className="row mt-3">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card tbl search">
                            <div className="card-body">

                                <div className="d-flex justify-content-between align-items-center flex-wrap py-3">
                                    <div className="">
                                        <p>Users</p>
                                    </div>
                                    <div classsName="d-flex">
                                        <div className="row">
                                            <div className="col-sm-12 col-md-12 col-lg-12 d-flex">
                                                <div><button className="btn btn-reset"><span><img src="./assets/images/reset.png" alt="" /></span> Reset</button></div>
                                                <div className="d-flex align-items-center gap-2 pagination">

                                                    <span>Records per page:</span>

                                                    <select
                                                        value={perPage}
                                                        onChange={(e) => setPerPage(e.target.value)}
                                                        className="form-select form-select-sm border-0"
                                                        style={{ width: "70px" }}
                                                    >
                                                        <option value={5}>5</option>
                                                        <option value={10}>10</option>
                                                        <option value={25}>25</option>
                                                        <option value={50}>50</option>
                                                    </select>

                                                    <span>
                                                        1-{Math.min(perPage, totalRecords)} of {totalRecords}
                                                    </span>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-12 col-md-3 col-lg-3">
                                        <div className="tabBox">
                                            <ul className="nav nav-tabs nav-fill  tblmapTab border-0 mb-0 pb-0">
                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === "table" ? "active" : ""}`}
                                                        onClick={() => setActiveTab("table")}
                                                    >
                                                        Active
                                                    </button>
                                                </li>

                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === "map" ? "active" : ""}`}
                                                        onClick={() => setActiveTab("map")}
                                                    >
                                                        Deleted
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                        <div className="tab-content mt-3 bg-transparent">
                                            {activeTab === "table" && (
                                                <div className="tab-pane active">
                                                    <div className="table-responsive">
                                                        <table className="table userTbl mt-3">
                                                            <thead>
                                                                <tr>
                                                                    <th>S.No</th>
                                                                    <th>Country</th>
                                                                    <th>First Name</th>
                                                                    <th>Last Name</th>
                                                                    <th>Email</th>
                                                                    <th>Phone</th>
                                                                    <th>Role</th>
                                                                    <th>Status</th>
                                                                    <th>Options</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>Malawi</td>
                                                                    <td>Malawi</td>
                                                                    <td>Admin</td>
                                                                    <td>admin.mw@agridom.com</td>
                                                                    <td>7655879453</td>
                                                                    <td><span className="buyerbadge">Country admin</span></td>
                                                                    <td><span className="buyerbadge">Active</span></td>
                                                                    <td className="d-flex">
                                                                        <button className="btn" onClick={handleEditShow}><img src="./assets/images/edit.png" alt="" /></button>
                                                                        <button className="btn" onClick={handleDeleteShow}><img src="./assets/images/trash.png" alt="" /></button>
                                                                        <button className="btn" onClick={handleResetShow}><img src="./assets/images/reset.png" alt="" /></button>
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td>2</td>
                                                                    <td>Malawi</td>
                                                                    <td>Malawi</td>
                                                                    <td>Admin</td>
                                                                    <td>admin.mw@agridom.com</td>
                                                                    <td>7655879453</td>
                                                                    <td><span className="buyerbadge">Country admin</span></td>
                                                                    <td><span className="buyerbadge">Active</span></td>
                                                                    <td className="d-flex">
                                                                        <button className="btn" onClick={handleEditShow}><img src="./assets/images/edit.png" alt="" /></button>
                                                                        <button className="btn" onClick={handleDeleteShow}><img src="./assets/images/trash.png" alt="" /></button>
                                                                        <button className="btn" onClick={handleResetShow}><img src="./assets/images/reset.png" alt="" /></button>
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td>3</td>
                                                                    <td>Malawi</td>
                                                                    <td>Malawi</td>
                                                                    <td>Admin</td>
                                                                    <td>admin.mw@agridom.com</td>
                                                                    <td>7655879453</td>
                                                                    <td><span className="buyerbadge">Country admin</span></td>
                                                                    <td><span className="buyerbadge">Active</span></td>
                                                                    <td className="d-flex">
                                                                        <button className="btn" onClick={handleEditShow}><img src="./assets/images/edit.png" alt="" /></button>
                                                                        <button className="btn" onClick={handleDeleteShow}><img src="./assets/images/trash.png" alt="" /></button>
                                                                        <button className="btn" onClick={handleResetShow}><img src="./assets/images/reset.png" alt="" /></button>
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td>4</td>
                                                                    <td>All</td>
                                                                    <td>Malawi</td>
                                                                    <td>Admin</td>
                                                                    <td>admin.mw@agridom.com</td>
                                                                    <td>7655879453</td>
                                                                    <td><span className="darkbadge">Country admin</span></td>
                                                                    <td><span className="buyerbadge">Active</span></td>
                                                                    <td className="d-flex">
                                                                        <button className="btn" onClick={handleEditShow}><img src="./assets/images/edit.png" alt="" /></button>
                                                                        <button className="btn" onClick={handleDeleteShow}><img src="./assets/images/trash.png" alt="" /></button>
                                                                        <button className="btn" onClick={handleResetShow}><img src="./assets/images/reset.png" alt="" /></button>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>


                                                    <nav aria-label="Page navigation">
                                                        <ul className="pagination justify-content-end border-0 mt-3">

                                                            <li className="page-item disabled border-0 me-2">
                                                                <span className="page-link">Previous</span>
                                                            </li>

                                                            <li className="page-item active border-0">
                                                                <a className="page-link border-0" href="#">1</a>
                                                            </li>



                                                            <li className="page-item border-0">
                                                                <a className="page-link border-0" href="#">Next</a>
                                                            </li>

                                                        </ul>
                                                    </nav>

                                                </div>
                                            )}

                                            {activeTab === "map" && (
                                                <div className="tab-pane active">
                                                    <div className="overviewBox">
                                                        <p>Deleted files adding soon..</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>





            </div>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="border-0">
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <div className="modalHead mt-2">
                                <h3>Add Users </h3>
                                <p className="mb-0">Create a new admin user account. Fill in all the required information.</p>
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row modalUser">
                            <div className="col-sm-12 col-md-12 col-lg-12 mb-1">
                                <label>Country *</label>
                                <MultiSelect value={selectedCities1} onChange={(e) => setSelectedCities1(e.value)} options={cities1} optionLabel="name1"
                                    placeholder="Country" maxSelectedLabels={3} className="w-100" />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <label>First Name *</label>
                                <MultiSelect value={selectedCities1} onChange={(e) => setSelectedCities1(e.value)} options={cities1} optionLabel="name"
                                    placeholder="First Name" maxSelectedLabels={3} className="w-100" />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <label>Last Name *</label>
                                <MultiSelect value={selectedCities1} onChange={(e) => setSelectedCities1(e.value)} options={cities1} optionLabel="name"
                                    placeholder="Last Name" maxSelectedLabels={3} className="w-100" />
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                                <label>Email *</label>
                                <InputText type="text" className="w-100  mt-1 p-com" placeholder="Enter Email" />
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                                <label>Phone *</label>
                                <InputText type="text" className="w-100  mt-1 p-com" placeholder="Enter Phone Number" />
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                                <label>Role *</label>
                                <MultiSelect value={selectedCities1} onChange={(e) => setSelectedCities1(e.value)} options={cities1} optionLabel="name"
                                    placeholder="Select Role" maxSelectedLabels={3} className="w-100" />
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <button className="btn btn-cancel" onClick={handleClose}>
                        Close
                    </button>
                    <button className="btn btn-addnew" onClick={handleClose}>
                        Add User
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEdit} onHide={handleEditClose}>


                <Modal.Header closeButton className="border-0">
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <div className="modalHead mt-2">
                                <h3>Edit User </h3>
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row modalUser">
                            <div className="col-sm-12 col-md-12 col-lg-12 mb-1">
                                <label>Country *</label>
                                <MultiSelect value={selectedCities1} onChange={(e) => setSelectedCities1(e.value)} options={cities1} optionLabel="name1"
                                    placeholder="Country" maxSelectedLabels={3} className="w-100" />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <label>First Name *</label>
                                <InputText type="text" className="w-100  mt-1 p-com" placeholder="First Name" />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mb-1">
                                <label>Last Name *</label>
                                <InputText type="text" className="w-100  mt-1 p-com" placeholder="Last Name" />
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                                <label>Email *</label>
                                <InputText type="text" className="w-100  mt-1 p-com" placeholder="Enter Email" />
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                                <label>Phone *</label>
                                <InputText type="text" className="w-100  mt-1 p-com" placeholder="Enter Phone Number" />
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                                <label>Role *</label>
                                <MultiSelect value={selectedCities1} onChange={(e) => setSelectedCities1(e.value)} options={cities1} optionLabel="name"
                                    placeholder="Select Role" maxSelectedLabels={3} className="w-100" />
                            </div>
                        </div>
                    </Form>
                </Modal.Body>

                <Modal.Footer className="border-0">
                    <button className="btn btn-cancel" onClick={handleEditClose}>
                        Close
                    </button>

                    <button className="btn btn-addnew">
                        Update User
                    </button>
                </Modal.Footer>
            </Modal>


            <Modal show={showDelete} onHide={handleDeleteClose} centered>
                <Modal.Header closeButton className="border-0">
                    <div className="modalHead mt-2">
                        <h3 className="mb-0">Delete User</h3>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    <div className="modalHead">
                        <p className="mb-0">
                            Are you sure you want to delete <strong>Malawi Admin?</strong> This action will deactivate the user account but data will be preserved. You can reactivate the user later from the Deleted tab.
                        </p>
                    </div>
                </Modal.Body>

                <Modal.Footer className="border-0">
                    <button className="btn btn-cancel" onClick={handleDeleteClose}>
                        Cancel
                    </button>

                    <button className="btn btn-delete">
                        Delete User
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={showReset} onHide={handleResetClose} size="md" centered>
                <Modal.Header closeButton className="border-0">
                    <div className="modalHead mt-2">
                        <h3>Reset Password</h3>
                        <p className="mb-0">
                            Send a password reset link to the user's email address.
                        </p>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <div className="row modalUser">

                            <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                                <label>User: Malawi Admin</label>

                            </div>

                            <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                                <label>Email: <span>admin.mw@agridom.com</span></label>

                            </div>

                        </div>
                    </Form>
                </Modal.Body>

                <Modal.Footer className="border-0">
                    <button className="btn btn-cancel" onClick={handleResetClose}>
                        Cancel
                    </button>

                    <button className="btn btn-addnew">
                        Send Reset Link
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UserManagement
