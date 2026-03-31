import React from 'react'

function TableView() {
    return (
        <>
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <div className="card tbl">
                        <div className="card-body">
                            <p>Farm Records (4)</p>
                            <div className="table-responsive">
                                <table className="table tblView">
                                    <thead>
                                        <tr>
                                            <th>Farm ID</th>
                                            <th>Farm Name</th>
                                            <th>Farmer</th>
                                            <th>Region</th>
                                            <th>Sub-Region</th>
                                            <th>Size (acres)</th>
                                            <th>Crops</th>
                                            <th>Income</th>
                                            <th>Expense</th>
                                            <th>Profit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>f1</td>
                                            <td className="td-title">Green Valley Farm</td>
                                            <td>John Kamau</td>
                                            <td>Central</td>
                                            <td className="td-light">Kiambu</td>
                                            <td>5.5</td>
                                            <td>3</td>
                                            <td>KES 280K</td>
                                            <td className="td-green">KES 190K</td>
                                            <td className="td-bold">KES 90K</td>
                                        </tr>

                                        <tr>
                                            <td>f2</td>
                                            <td>Sunset Farm</td>
                                            <td>John Kamau</td>
                                            <td>Central</td>
                                            <td className="td-light">Kiambu</td>
                                            <td>3.2</td>
                                            <td>2</td>
                                            <td>KES 280K</td>
                                            <td className="td-green">KES 190K</td>
                                            <td className="td-bold td-green">KES 90K</td>
                                        </tr>

                                        <tr>
                                            <td>f3</td>
                                            <td>Green Valley Farm</td>
                                            <td>John Kamau</td>
                                            <td>Central</td>
                                            <td className="td-light">Kiambu</td>
                                            <td>5.5</td>
                                            <td>3</td>
                                            <td>KES 280K</td>
                                            <td className="td-green">KES 190K</td>
                                            <td className="td-bold">KES 90K</td>
                                        </tr>

                                        <tr>
                                            <td>f4</td>
                                            <td>Green Valley Farm</td>
                                            <td>John Kamau</td>
                                            <td>Central</td>
                                            <td className="td-light">Kiambu</td>
                                            <td>5.5</td>
                                            <td>3</td>
                                            <td>KES 280K</td>
                                            <td className="td-green">KES 190K</td>
                                            <td className="td-bold">KES 90K</td>
                                        </tr>

                                        <tr>
                                            <td>f5</td>
                                            <td>Green Valley Farm</td>
                                            <td>John Kamau</td>
                                            <td>Central</td>
                                            <td className="td-light">Kiambu</td>
                                            <td>5.5</td>
                                            <td>3</td>
                                            <td>KES 280K</td>
                                            <td className="td-green">KES 190K</td>
                                            <td className="td-bold">KES 90K</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TableView
