// src/pages/UserManagement.js
import { useState, useEffect, useCallback } from "react";
import { InputText } from "primereact/inputtext";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { getUserMgmt, createUserMgmt, updateUserMgmt, deleteUserMgmt, getUserRoles, getLocationAdm } from '../services/api';
import LocationFilter from '../components/LocationFilter';

/**
 * Cascading location picker for modals.
 * Props:
 *   token        - auth token
 *   initial      - { adm0_id, adm1_id, adm2_id, adm3_id } to pre-fill (use key prop to remount)
 *   onChange     - called with { adm0_id, adm1_id, adm2_id, adm3_id }
 */
function ModalLocationPicker({ token, initial = {}, onChange }) {
    const [countries,  setCountries]  = useState([]);
    const [regions,    setRegions]    = useState([]);
    const [subRegions, setSubRegions] = useState([]);
    const [districts,  setDistricts]  = useState([]);
    const [adm0, setAdm0] = useState(initial.adm0_id ? String(initial.adm0_id) : '');
    const [adm1, setAdm1] = useState(initial.adm1_id ? String(initial.adm1_id) : '');
    const [adm2, setAdm2] = useState(initial.adm2_id ? String(initial.adm2_id) : '');
    const [adm3, setAdm3] = useState(initial.adm3_id ? String(initial.adm3_id) : '');

    const emit = (a0, a1, a2, a3) =>
        onChange({ adm0_id: a0 || null, adm1_id: a1 || null, adm2_id: a2 || null, adm3_id: a3 || null });

    // Load countries on mount
    useEffect(() => {
        getLocationAdm(token, 0, null).then((r) => setCountries(r.data?.units || [])).catch(() => {});
    }, [token]);

    // Pre-fill cascade chains
    useEffect(() => {
        if (adm0) getLocationAdm(token, 1, adm0).then((r) => setRegions(r.data?.units || [])).catch(() => {});
    }, [token, adm0]);
    useEffect(() => {
        if (adm1) getLocationAdm(token, 2, adm1).then((r) => setSubRegions(r.data?.units || [])).catch(() => {});
    }, [token, adm1]);
    useEffect(() => {
        if (adm2) getLocationAdm(token, 3, adm2).then((r) => setDistricts(r.data?.units || [])).catch(() => {});
    }, [token, adm2]);

    const handleAdm0 = (e) => {
        const v = e.target.value;
        setAdm0(v); setAdm1(''); setAdm2(''); setAdm3('');
        setRegions([]); setSubRegions([]); setDistricts([]);
        emit(v, null, null, null);
        if (v) getLocationAdm(token, 1, v).then((r) => setRegions(r.data?.units || [])).catch(() => {});
    };
    const handleAdm1 = (e) => {
        const v = e.target.value;
        setAdm1(v); setAdm2(''); setAdm3('');
        setSubRegions([]); setDistricts([]);
        emit(adm0, v, null, null);
        if (v) getLocationAdm(token, 2, v).then((r) => setSubRegions(r.data?.units || [])).catch(() => {});
    };
    const handleAdm2 = (e) => {
        const v = e.target.value;
        setAdm2(v); setAdm3('');
        setDistricts([]);
        emit(adm0, adm1, v, null);
        if (v) getLocationAdm(token, 3, v).then((r) => setDistricts(r.data?.units || [])).catch(() => {});
    };
    const handleAdm3 = (e) => {
        const v = e.target.value;
        setAdm3(v);
        emit(adm0, adm1, adm2, v);
    };

    return (
        <div className="row g-2">
            <div className="col-sm-6">
                <label>Country</label>
                <select className="form-select mt-1" value={adm0} onChange={handleAdm0}>
                    <option value="">Select Country</option>
                    {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div className="col-sm-6">
                <label>Region</label>
                <select className="form-select mt-1" value={adm1} onChange={handleAdm1} disabled={!adm0}>
                    <option value="">Select Region</option>
                    {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
            </div>
            <div className="col-sm-6">
                <label>Sub-Region</label>
                <select className="form-select mt-1" value={adm2} onChange={handleAdm2} disabled={!adm1}>
                    <option value="">Select Sub-Region</option>
                    {subRegions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            <div className="col-sm-6">
                <label>District</label>
                <select className="form-select mt-1" value={adm3} onChange={handleAdm3} disabled={!adm2}>
                    <option value="">Select District</option>
                    {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
            </div>
        </div>
    );
}

const PAGE_SIZES = [5, 10, 25, 50];

const exportCSV = (data, filename) => {
    if (!data.length) return;
    const headers = ['#', 'Name', 'Email', 'Phone', 'Role', 'Last Login', 'Registered On', 'Status', 'Is Farmer'];
    const rows = data.map((u, i) =>
        [i + 1, u.farmer?.name || '', u.email, u.phone || '', u.role, u.last_login || '', u.registered_on || '', u.status, u.is_farmer ? 'Yes' : 'No']
            .map((v) => `"${v ?? ''}"`)
            .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
};

function UserManagement({ token }) {

    // ── Data ──────────────────────────────────────────────────
    const [users, setUsers]           = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);

    // ── Pagination / tab / search ─────────────────────────────
    const [activeTab, setActiveTab]     = useState('active');   // 'active' | 'deleted'
    const [page, setPage]               = useState(1);
    const [pageSize, setPageSize]       = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch]           = useState('');

    // ── Filters (client-side role + location filter) ─────────
    const [filterRole, setFilterRole]   = useState('');
    const [filterLoc, setFilterLoc]     = useState({});
    const [locFilterKey, setLocFilterKey] = useState(0); // increment to remount/reset LocationFilter

    // ── Lookups ───────────────────────────────────────────────
    const [roles, setRoles] = useState([]);

    // ── Modals ────────────────────────────────────────────────
    const [showAdd, setShowAdd]       = useState(false);
    const [showEdit, setShowEdit]     = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showReset, setShowReset]   = useState(false);

    // ── Selected user for actions ─────────────────────────────
    const [selectedUser, setSelectedUser] = useState(null);

    // ── Add form ──────────────────────────────────────────────
    const [addEmail, setAddEmail]   = useState('');
    const [addPhone, setAddPhone]   = useState('');
    const [addRoleId, setAddRoleId] = useState('');

    const [addLoc, setAddLoc]       = useState({});
    const [addMsg, setAddMsg]       = useState({ type: '', text: '' });
    const [addLoading, setAddLoading] = useState(false);

    // ── Edit form ─────────────────────────────────────────────
    const [editEmail, setEditEmail]   = useState('');
    const [editPhone, setEditPhone]   = useState('');
    const [editRoleId, setEditRoleId] = useState('');
    const [editName, setEditName]     = useState('');
    const [editLoc, setEditLoc]       = useState({});
    const [editMsg, setEditMsg]       = useState({ type: '', text: '' });
    const [editLoading, setEditLoading] = useState(false);

    // ── Delete / Reset / Reactivate state ─────────────────────
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMsg, setActionMsg]         = useState({ type: '', text: '' });

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    // ── Load lookups once ─────────────────────────────────────
    useEffect(() => {
        getUserRoles()
            .then((d) => setRoles((d.data || []).map((r) => ({ label: r.role, value: r.id }))))
            .catch(() => {});
    }, [token]);

    // ── Fetch users ───────────────────────────────────────────
    const fetchUsers = useCallback(() => {
        setLoading(true);
        setError(null);
        const opts = { page, size: pageSize, status: activeTab === 'active' ? 'active' : 'inactive' };
        if (search) opts.search_for = search;
        getUserMgmt(token, opts)
            .then((res) => {
                setUsers(res.data || []);
                setTotalCount(res.count != null ? res.count : (res.data || []).length);
            })
            .catch(() => setError('Failed to load users.'))
            .finally(() => setLoading(false));
    }, [token, page, pageSize, activeTab, search]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
        setSearch('');
        setSearchInput('');
        setFilterRole('');
        setFilterLoc({});
        setLocFilterKey((k) => k + 1);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    // Client-side role + location filter on top of paginated results
    const displayUsers = users.filter((u) => {
        if (filterRole && u.role_id !== parseInt(filterRole)) return false;
        const ua0 = u.farmer?.adm0_id ?? u.adm0_id;
        const ua1 = u.farmer?.adm1_id ?? u.adm1_id;
        const ua2 = u.farmer?.adm2_id ?? u.adm2_id;
        const ua3 = u.farmer?.adm3_id ?? u.adm3_id;
        if (filterLoc.adm0_id && ua0 !== parseInt(filterLoc.adm0_id)) return false;
        if (filterLoc.adm1_id && ua1 !== parseInt(filterLoc.adm1_id)) return false;
        if (filterLoc.adm2_id && ua2 !== parseInt(filterLoc.adm2_id)) return false;
        if (filterLoc.adm3_id && ua3 !== parseInt(filterLoc.adm3_id)) return false;
        return true;
    });

    // ── Add user ──────────────────────────────────────────────
    const handleAddUser = async () => {
        setAddMsg({ type: '', text: '' });
        if (!addEmail || !addRoleId) {
            setAddMsg({ type: 'danger', text: 'Email and role are required.' });
            return;
        }
        setAddLoading(true);
        try {
            const payload = {
                email: addEmail,
                phone: addPhone || null,
                role_id: parseInt(addRoleId),
            };
            if (addLoc.adm0_id) payload.adm0_id = addLoc.adm0_id;
            if (addLoc.adm1_id) payload.adm1_id = addLoc.adm1_id;
            if (addLoc.adm2_id) payload.adm2_id = addLoc.adm2_id;
            if (addLoc.adm3_id) payload.adm3_id = addLoc.adm3_id;
            const res = await createUserMgmt(token, payload);
            setAddMsg({ type: 'success', text: res.message || 'User created successfully.' });
            setAddEmail(''); setAddPhone(''); setAddRoleId(''); setAddLoc({});
            fetchUsers();
        } catch (err) {
            setAddMsg({ type: 'danger', text: err?.message || 'Failed to create user.' });
        } finally {
            setAddLoading(false);
        }
    };

    // ── Open edit modal ───────────────────────────────────────
    const openEdit = (user) => {
        setSelectedUser(user);
        setEditEmail(user.email);
        setEditPhone(user.phone || '');
        setEditRoleId(String(user.role_id));
        setEditName(user.farmer?.name || '');
        setEditLoc({
            adm0_id: user.farmer?.adm0_id || user.adm0_id || null,
            adm1_id: user.farmer?.adm1_id || user.adm1_id || null,
            adm2_id: user.farmer?.adm2_id || user.adm2_id || null,
            adm3_id: user.farmer?.adm3_id || user.adm3_id || null,
        });
        setEditMsg({ type: '', text: '' });
        setShowEdit(true);
    };

    const handleEditUser = async () => {
        setEditMsg({ type: '', text: '' });
        if (!editEmail || !editRoleId) {
            setEditMsg({ type: 'danger', text: 'Email and role are required.' });
            return;
        }
        setEditLoading(true);
        try {
            const payload = {
                purpose: 'update_details',
                user_id: selectedUser.user_id,
                email: editEmail,
                phone: editPhone || null,
                role_id: parseInt(editRoleId),
            };
            if (editName)        payload.name    = editName;
            if (editLoc.adm0_id) payload.adm0_id = editLoc.adm0_id;
            if (editLoc.adm1_id) payload.adm1_id = editLoc.adm1_id;
            if (editLoc.adm2_id) payload.adm2_id = editLoc.adm2_id;
            if (editLoc.adm3_id) payload.adm3_id = editLoc.adm3_id;
            const res = await updateUserMgmt(token, payload);
            setEditMsg({ type: 'success', text: res.message || 'User updated.' });
            fetchUsers();
        } catch (err) {
            setEditMsg({ type: 'danger', text: err?.message || 'Failed to update user.' });
        } finally {
            setEditLoading(false);
        }
    };

    // ── Delete ────────────────────────────────────────────────
    const openDelete = (user) => { setSelectedUser(user); setActionMsg({ type: '', text: '' }); setShowDelete(true); };
    const handleDelete = async () => {
        setActionLoading(true);
        setActionMsg({ type: '', text: '' });
        try {
            const res = await deleteUserMgmt(token, selectedUser.user_id);
            setActionMsg({ type: 'success', text: res.message || 'User deleted.' });
            fetchUsers();
            setTimeout(() => setShowDelete(false), 1500);
        } catch (err) {
            setActionMsg({ type: 'danger', text: err?.message || 'Failed to delete user.' });
        } finally {
            setActionLoading(false);
        }
    };

    // ── Reset password ────────────────────────────────────────
    const openReset = (user) => { setSelectedUser(user); setActionMsg({ type: '', text: '' }); setShowReset(true); };
    const handleReset = async () => {
        setActionLoading(true);
        setActionMsg({ type: '', text: '' });
        try {
            const res = await updateUserMgmt(token, { purpose: 'reset_password', user_id: selectedUser.user_id });
            setActionMsg({ type: 'success', text: res.message || 'Password reset. Email sent.' });
        } catch (err) {
            setActionMsg({ type: 'danger', text: err?.message || 'Failed to reset password.' });
        } finally {
            setActionLoading(false);
        }
    };

    // ── Reactivate (inline) ───────────────────────────────────
    const [reactivatingId, setReactivatingId] = useState(null);
    const handleReactivate = async (user) => {
        setReactivatingId(user.user_id);
        try {
            await updateUserMgmt(token, { purpose: 'reactivate', user_id: user.user_id });
            fetchUsers();
        } catch {
            /* silent — show in table area if needed */
        } finally {
            setReactivatingId(null);
        }
    };

    // ── Pagination helper ─────────────────────────────────────
    const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
            acc.push(p);
            return acc;
        }, []);

    return (
        <>
            <div className="container-fluid" style={{ padding: '0px 13px 0px 0px' }}>

                {/* Title + Add */}
                <div className="row p-3">
                    <div className="col-sm-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div className="overviewBox">
                                <h3>User Management</h3>
                                <p>Manage admin users and permissions</p>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <button className="btn btn-export" onClick={() => exportCSV(displayUsers, `users_${activeTab}_page${page}.csv`)}>
                                    <span className="pe-2"><img src="./assets/images/download.png" alt="" /></span>Export
                                </button>
                                <button className="btn btn-addnew" onClick={() => { setAddMsg({ type: '', text: '' }); setAddEmail(''); setAddPhone(''); setAddRoleId(''); setAddLoc({}); setShowAdd(true); }}>
                                    <img src="./assets/images/user.png" alt="" className="me-1" /> Add User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="row px-3 mb-3">
                    <div className="col-sm-12">
                        <div className="card filterCard">
                            <div className="card-body">
                                <div className="row g-2 align-items-end">
                                    <div className="col-sm-12 col-md-4 col-lg-4">
                                        <label className="form-label mb-1">Role</label>
                                        <select className="form-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                                            <option value="">All Roles</option>
                                            {roles.map((r) => (
                                                <option key={r.value} value={r.value}>{r.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-sm-12 col-md-5 col-lg-5">
                                        <label className="form-label mb-1">Search</label>
                                        <form className="searchBox" onSubmit={handleSearch}>
                                            <input
                                                type="search"
                                                className="form-control"
                                                placeholder="Search by email or farmer name..."
                                                value={searchInput}
                                                onChange={(e) => setSearchInput(e.target.value)}
                                            />
                                            <span><img src="./assets/images/search.png" alt="search" /></span>
                                        </form>
                                    </div>
                                    <div className="col-sm-12 col-md-3 col-lg-3 d-flex gap-2">
                                        <button className="btn btn-addnew w-100" onClick={handleSearch}>Search</button>
                                        <button className="btn btn-export w-100" onClick={() => { setFilterRole(''); setSearchInput(''); setSearch(''); setFilterLoc({}); setLocFilterKey((k) => k + 1); setPage(1); }}>Reset</button>
                                    </div>
                                </div>
                                <div className="row g-2 mt-2">
                                    <div className="col-12">
                                        <label className="form-label mb-1">Location</label>
                                        <LocationFilter
                                            key={locFilterKey}
                                            token={token}
                                            onChange={(loc) => { setFilterLoc(loc); setPage(1); }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table card */}
                <div className="row px-3">
                    <div className="col-sm-12">
                        <div className="card tbl search">
                            <div className="card-body">

                                {/* Top bar: title + page size */}
                                <div className="d-flex justify-content-between align-items-center flex-wrap py-3">
                                    <div>
                                        <p className="mb-0">Users</p>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 pagination">
                                        <span>Records per page:</span>
                                        <select
                                            value={pageSize}
                                            onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(1); }}
                                            className="form-select form-select-sm border-0"
                                            style={{ width: 70 }}
                                        >
                                            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <span>
                                            {loading ? '…' : `${Math.min((page - 1) * pageSize + 1, totalCount) || 0}–${Math.min(page * pageSize, totalCount)} of ${totalCount}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Nav tabs */}
                                    <div className="col-sm-12 col-md-3 col-lg-3">
                                        <div className="tabBox">
                                            <ul className="nav nav-tabs nav-fill tblmapTab border-0 mb-0 pb-0">
                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                                                        onClick={() => handleTabChange('active')}
                                                    >Active</button>
                                                </li>
                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === 'deleted' ? 'active' : ''}`}
                                                        onClick={() => handleTabChange('deleted')}
                                                    >Deleted</button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Tab content */}
                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                        <div className="tab-content mt-3 bg-transparent">
                                            <div className="tab-pane active">
                                                {error ? (
                                                    <div className="text-danger py-3">{error}</div>
                                                ) : loading ? (
                                                    <div className="text-center text-muted py-4">Loading...</div>
                                                ) : (
                                                    <>
                                                        <div className="table-responsive">
                                                            <table className="table userTbl mt-3">
                                                                <thead>
                                                                    <tr>
                                                                        <th>S.No</th>
                                                                        <th>Avatar</th>
                                                                        <th>Name</th>
                                                                        <th>Email</th>
                                                                        <th>Phone</th>
                                                                        <th>Role</th>
                                                                        <th>Last Login</th>
                                                                        <th>Registered On</th>
                                                                        <th>Status</th>
                                                                        <th>Options</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {displayUsers.length === 0 ? (
                                                                        <tr>
                                                                            <td colSpan={10} className="text-center text-muted py-4">
                                                                                No {activeTab} users found.
                                                                            </td>
                                                                        </tr>
                                                                    ) : displayUsers.map((u, i) => (
                                                                        <tr key={u.user_id}>
                                                                            <td>{(page - 1) * pageSize + i + 1}</td>
                                                                            <td>
                                                                                <img
                                                                                    src={u.profile_image}
                                                                                    alt=""
                                                                                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                                                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                                                />
                                                                            </td>
                                                                            <td className="td-title">
                                                                                {u.farmer?.name || '-'}
                                                                                {u.is_farmer && <span className="buyerbadge ms-1" style={{ fontSize: '10px' }}>Farmer</span>}
                                                                            </td>
                                                                            <td>{u.email}</td>
                                                                            <td>{u.phone || '-'}</td>
                                                                            <td><span className="buyerbadge">{u.role}</span></td>
                                                                            <td className="td-light">{u.last_login || '-'}</td>
                                                                            <td className="td-light">{u.registered_on || '-'}</td>
                                                                            <td>
                                                                                {u.status
                                                                                    ? <span className="buyerbadge">Active</span>
                                                                                    : <span className="darkbadge">Deleted</span>}
                                                                            </td>
                                                                            <td>
                                                                                <div className="d-flex align-items-center">
                                                                                {activeTab === 'active' ? (
                                                                                    <>
                                                                                        <button className="btn" title="Edit" onClick={() => openEdit(u)}>
                                                                                            <img src="./assets/images/edit.png" alt="Edit" />
                                                                                        </button>
                                                                                        <button className="btn" title="Delete" onClick={() => openDelete(u)}>
                                                                                            <img src="./assets/images/trash.png" alt="Delete" />
                                                                                        </button>
                                                                                        <button className="btn" title="Reset Password" onClick={() => openReset(u)}>
                                                                                            <img src="./assets/images/reset.png" alt="Reset" />
                                                                                        </button>
                                                                                    </>
                                                                                ) : (
                                                                                    <button
                                                                                        className="btn btn-sm btn-addnew"
                                                                                        onClick={() => handleReactivate(u)}
                                                                                        disabled={reactivatingId === u.user_id}
                                                                                    >
                                                                                        {reactivatingId === u.user_id ? 'Reactivating…' : 'Reactivate'}
                                                                                    </button>
                                                                                )}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        {/* Pagination */}
                                                        <nav aria-label="Page navigation">
                                                            <ul className="pagination justify-content-end border-0 mt-3">
                                                                <li className={`page-item border-0 me-2 ${page === 1 ? 'disabled' : ''}`}>
                                                                    <button className="page-link" onClick={() => setPage((p) => p - 1)}>Previous</button>
                                                                </li>
                                                                {paginationItems.map((p, idx) =>
                                                                    p === '...' ? (
                                                                        <li key={`e-${idx}`} className="page-item disabled border-0">
                                                                            <span className="page-link">…</span>
                                                                        </li>
                                                                    ) : (
                                                                        <li key={p} className={`page-item border-0 ${page === p ? 'active' : ''}`}>
                                                                            <button className="page-link border-0" onClick={() => setPage(p)}>{p}</button>
                                                                        </li>
                                                                    )
                                                                )}
                                                                <li className={`page-item border-0 ${page >= totalPages ? 'disabled' : ''}`}>
                                                                    <button className="page-link" onClick={() => setPage((p) => p + 1)}>Next</button>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* ── Add User Modal ──────────────────────────────────── */}
            <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                <Modal.Header closeButton className="border-0">
                    <div className="modalHead mt-2">
                        <h3>Add User</h3>
                        <p className="mb-0">A temporary password will be emailed to the new user automatically.</p>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row modalUser">
                            {addMsg.text && (
                                <div className="col-12 mb-2">
                                    <div className={`alert alert-${addMsg.type} py-2 small`}>{addMsg.text}</div>
                                </div>
                            )}
                            <div className="col-12 mb-2">
                                <label>Email *</label>
                                <InputText type="text" className="w-100 mt-1 p-com" placeholder="Enter Email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} />
                            </div>
                            <div className="col-12 mb-2">
                                <label>Phone</label>
                                <InputText type="text" className="w-100 mt-1 p-com" placeholder="Enter Phone Number" value={addPhone} onChange={(e) => setAddPhone(e.target.value)} />
                            </div>
                            <div className="col-12 mb-2">
                                <label>Role *</label>
                                <select className="form-select mt-1" value={addRoleId} onChange={(e) => setAddRoleId(e.target.value)}>
                                    <option value="">Select Role</option>
                                    {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                                </select>
                            </div>
                            <div className="col-12 mt-2 mb-1">
                                <hr className="my-1" />
                                <small className="text-muted">Location (optional)</small>
                            </div>
                            <div className="col-12 mb-2">
                                <ModalLocationPicker
                                    key={showAdd ? 'add-open' : 'add-closed'}
                                    token={token}
                                    onChange={setAddLoc}
                                />
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <button className="btn btn-cancel" onClick={() => setShowAdd(false)}>Close</button>
                    <button className="btn btn-addnew" onClick={handleAddUser} disabled={addLoading}>
                        {addLoading ? 'Adding…' : 'Add User'}
                    </button>
                </Modal.Footer>
            </Modal>


            {/* ── Edit User Modal ─────────────────────────────────── */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton className="border-0">
                    <div className="modalHead mt-2">
                        <h3>Edit User</h3>
                        {selectedUser && <p className="mb-0 text-muted small">{selectedUser.email}</p>}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row modalUser">
                            {editMsg.text && (
                                <div className="col-12 mb-2">
                                    <div className={`alert alert-${editMsg.type} py-2 small`}>{editMsg.text}</div>
                                </div>
                            )}
                            <div className="col-12 mb-2">
                                <label>Email *</label>
                                <InputText type="text" className="w-100 mt-1 p-com" placeholder="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                            </div>
                            <div className="col-12 mb-2">
                                <label>Phone</label>
                                <InputText type="text" className="w-100 mt-1 p-com" placeholder="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                            </div>
                            <div className="col-12 mb-2">
                                <label>Role *</label>
                                <select className="form-select mt-1" value={editRoleId} onChange={(e) => setEditRoleId(e.target.value)}>
                                    <option value="">Select Role</option>
                                    {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                                </select>
                            </div>
                            <div className="col-12 mt-2 mb-1">
                                <hr className="my-1" />
                                <small className="text-muted">Farmer Profile (optional)</small>
                            </div>
                            <div className="col-12 mb-2">
                                <label>Name</label>
                                <InputText type="text" className="w-100 mt-1 p-com" placeholder="Farmer full name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            </div>
                            <div className="col-12 mb-2">
                                <ModalLocationPicker
                                    key={selectedUser?.user_id}
                                    token={token}
                                    initial={editLoc}
                                    onChange={setEditLoc}
                                />
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <button className="btn btn-cancel" onClick={() => setShowEdit(false)}>Close</button>
                    <button className="btn btn-addnew" onClick={handleEditUser} disabled={editLoading}>
                        {editLoading ? 'Saving…' : 'Update User'}
                    </button>
                </Modal.Footer>
            </Modal>


            {/* ── Delete Modal ────────────────────────────────────── */}
            <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <div className="modalHead mt-2">
                        <h3 className="mb-0">Delete User</h3>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="modalHead">
                        {actionMsg.text && (
                            <div className={`alert alert-${actionMsg.type} py-2 small mb-2`}>{actionMsg.text}</div>
                        )}
                        <p className="mb-0">
                            Are you sure you want to delete <strong>{selectedUser?.email}</strong>?
                            The account will be deactivated but data will be preserved. You can reactivate from the Deleted tab.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <button className="btn btn-cancel" onClick={() => setShowDelete(false)}>Cancel</button>
                    <button className="btn btn-delete" onClick={handleDelete} disabled={actionLoading}>
                        {actionLoading ? 'Deleting…' : 'Delete User'}
                    </button>
                </Modal.Footer>
            </Modal>


            {/* ── Reset Password Modal ────────────────────────────── */}
            <Modal show={showReset} onHide={() => setShowReset(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <div className="modalHead mt-2">
                        <h3>Reset Password</h3>
                        <p className="mb-0">A new password will be generated and sent to the user's email.</p>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="modalHead">
                        {actionMsg.text && (
                            <div className={`alert alert-${actionMsg.type} py-2 small mb-2`}>{actionMsg.text}</div>
                        )}
                        <p className="mb-1"><strong>User:</strong> {selectedUser?.email}</p>
                        <p className="mb-0 text-muted small">The user will receive an email with the new password.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <button className="btn btn-cancel" onClick={() => setShowReset(false)}>Cancel</button>
                    <button className="btn btn-addnew" onClick={handleReset} disabled={actionLoading}>
                        {actionLoading ? 'Sending…' : 'Reset Password'}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UserManagement;
