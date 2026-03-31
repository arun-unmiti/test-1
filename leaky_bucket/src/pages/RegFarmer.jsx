import { useState, useEffect } from "react";
import { getCore } from "../services/api";
import LocationFilter from "../components/LocationFilter";
import { useFormFields } from "../hooks/useFormFields";
import { useCoreSummary } from "../hooks/useCoreSummary";

const PAGE_SIZE = 10;
const META_COLS = [
    { key: "created_on", label: "Registered On" },
    { key: "status", label: "Status" },
];

const exportCSV = (data, filename, columns) => {
    if (!data.length) return;
    const allCols = [...columns, ...META_COLS];
    const headers = allCols.map((c) => c.label);
    const rows = data.map((r) => allCols.map((c) => {
        const val = c.key === "status" ? (r[c.key] ? "Active" : "Inactive") : (r[c.key] ?? "");
        return `"${val}"`;
    }).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

function RegFarmer({ token }) {
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locFilter, setLocFilter] = useState({});

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    useEffect(() => {
        setLoading(true);
        setError(null);
        const opts = { page, size: PAGE_SIZE };
        if (search) opts.search_for = search;
        if (locFilter.adm0_id) opts.adm0_id = locFilter.adm0_id;
        if (locFilter.adm1_id) opts.adm1_id = locFilter.adm1_id;
        if (locFilter.adm2_id) opts.adm2_id = locFilter.adm2_id;
        if (locFilter.adm3_id) opts.adm3_id = locFilter.adm3_id;
        getCore(token, 1, opts)
            .then((res) => {
                setData(res.data || []);
                setTotalCount(res.count != null ? res.count : (res.data || []).length);
            })
            .catch(() => setError("Failed to load farmer data."))
            .finally(() => setLoading(false));
    }, [token, page, search, locFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const [exportLoading, setExportLoading] = useState(false);

    const handleExportAll = async () => {
        setExportLoading(true);
        try {
            const opts = {};
            if (search) opts.search_for = search;
            if (locFilter.adm0_id) opts.adm0_id = locFilter.adm0_id;
            if (locFilter.adm1_id) opts.adm1_id = locFilter.adm1_id;
            if (locFilter.adm2_id) opts.adm2_id = locFilter.adm2_id;
            if (locFilter.adm3_id) opts.adm3_id = locFilter.adm3_id;
            const res = await getCore(token, 1, opts);
            exportCSV(res.data || [], `farmers_all.csv`, columns);
        } catch { /* silent */ } finally {
            setExportLoading(false);
        }
    };

    const { columns, ready: fieldsReady } = useFormFields(token, 1);
    const { summary, summaryLoading } = useCoreSummary(token, 1, locFilter);

    return (
        <div className="container-fluid" style={{ padding: "0px 13px 0px 0px" }}>

            {/* Location filter */}
            <div className="row">
                <div className="col-sm-12">
                    <div className="card filterCard">
                        <div className="card-body">
                            <LocationFilter token={token} onChange={(f) => { setLocFilter(f); setPage(1); }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Title + Search + Export */}
            <div className="row p-3">
                <div className="col-sm-12">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div className="overviewBox">
                            <h3>Farmers</h3>
                            <p>Registered farmer profiles and contact details</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <form className="searchBox" onSubmit={handleSearch}>
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                                <button type="submit" style={{ background: 'none', border: 'none', padding: 0 }}><img src="./assets/images/search.png" alt="search" /></button>
                            </form>
                            <button className="btn btn-export" onClick={handleExportAll} disabled={exportLoading}>
                                <span className="pe-2"><img src="./assets/images/download.png" alt="" /></span>{exportLoading ? 'Exporting…' : 'Export'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="row px-3">
                <div className="col-sm-12">
                    <div className="overviewCards mt-1">
                        <div className="row">
                            <div className="col-sm-12 col-md-3 col-lg-3">
                                <div className="card one">
                                    <div className="card-body text-center">
                                        <h6>Total Farmers</h6>
                                        <h4>{summaryLoading ? "—" : (summary?.count ?? "—")}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="row px-3 mt-3">
                <div className="col-sm-12">
                    <div className="card tbl">
                        <div className="card-body">
                            <p>Farmer Records ({loading ? "…" : totalCount})</p>
                            {error ? (
                                <div className="text-danger py-3">{error}</div>
                            ) : (loading || !fieldsReady) ? (
                                <div className="text-center text-muted py-4">Loading...</div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="table tblView">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                                                    <th>Registered On</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={columns.length + 3} className="text-center text-muted py-3">No farmers found.</td>
                                                    </tr>
                                                ) : data.map((r, i) => (
                                                    <tr key={r.id}>
                                                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                                                        {columns.map((c) => (
                                                            <td key={c.key}>{r[c.key] ?? "-"}</td>
                                                        ))}
                                                        <td>{r.created_on || "-"}</td>
                                                        <td>
                                                            {r.status
                                                                ? <span className="clear">Active</span>
                                                                : <span className="badge">Inactive</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                                        <span className="records-box">
                                            Page {page} of {totalPages} &nbsp;|&nbsp; {totalCount} total records
                                        </span>
                                        <nav>
                                            <ul className="pagination mb-0">
                                                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                                    <button className="page-link" onClick={() => setPage((p) => p - 1)}>Previous</button>
                                                </li>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                                    .reduce((acc, p, idx, arr) => {
                                                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                                                        acc.push(p);
                                                        return acc;
                                                    }, [])
                                                    .map((p, idx) =>
                                                        p === "..." ? (
                                                            <li key={`ellipsis-${idx}`} className="page-item disabled">
                                                                <span className="page-link">…</span>
                                                            </li>
                                                        ) : (
                                                            <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                                                                <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                                                            </li>
                                                        )
                                                    )}
                                                <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                                                    <button className="page-link" onClick={() => setPage((p) => p + 1)}>Next</button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegFarmer;
