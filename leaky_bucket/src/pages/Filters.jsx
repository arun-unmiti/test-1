import React, { useState } from "react";
import { MultiSelect } from 'primereact/multiselect';
// import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";


function Filters() {
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
            <div className="card filterCard">
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-12 col-md-8 col-lg-8">
                            <div className="row">
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                        placeholder="All Countries" maxSelectedLabels={3} className="w-100" />
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                        placeholder="All Regions" maxSelectedLabels={3} className="w-100" />
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                        placeholder="All Sub-Regions" maxSelectedLabels={3} className="w-100" />
                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                        placeholder="This Month" maxSelectedLabels={3} className="w-100" />
                                    {/* <Calendar
                                value={date}
                                onChange={(e) => setDate(e.value)}
                                dateFormat="dd/mm/yy"
                                showIcon
                                placeholder="This Month"
                            /> */}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-3 col-lg-3">
                                    <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                        placeholder="All Crops" maxSelectedLabels={3} className="w-100" />
                                </div>
                                {/* <div className="col-sm-12 col-md-3 col-lg-3">
                                    <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name"
                                        placeholder="All Livestock" maxSelectedLabels={3} className="w-100" />
                                </div> */}
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4 col-lg-4">
                            <InputText type="text" className="w-100" placeholder="Search farmer name, phone, ID..." />
                            <span className="searchIcon"><img src="./assets/images/search.png" alt="Search" /></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Filters
