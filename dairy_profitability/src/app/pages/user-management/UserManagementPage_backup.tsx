import { useState, useEffect } from 'react';
import {
  Search, Plus, Edit2, Trash2, MoreVertical, KeyRound,
  X, UserCheck, UserX, Users, MapPin, Globe, ChevronRight, AlertCircle,
} from 'lucide-react';
import { usersData, countriesData, level1Data, level2Data, level3Data } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { getUserRoles, register } from '../../services/api';

interface ApiRole {
  id: number;
  name: string;
}

type Tab = 'users' | 'locations';
type LocationTab = 'country' | 'level1' | 'level2' | 'level3';
type UserStatus = 'all' | 'active' | 'inactive';

const ROLES = ['All Roles', 'Admin', 'Supervisor', 'Field Officer', 'Veterinarian'];

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
      status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
    }`}>
      {status === 'active' ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    Admin: 'bg-red-100 text-red-700',
    Supervisor: 'bg-blue-100 text-blue-700',
    'Field Officer': 'bg-green-100 text-green-700',
    Veterinarian: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${styles[role] ?? 'bg-gray-100 text-gray-600'}`}>
      {role}
    </span>
  );
}

interface UserModalProps {
  user?: typeof usersData[0] | null;
  onClose: () => void;
  mode: 'create' | 'edit' | 'reset';
  token: string | null;
  roles: ApiRole[];
}

function UserModal({ user, onClose, mode, token, roles }: UserModalProps) {
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [role, setRole] = useState(user?.role ?? (roles[0]?.name ?? 'Field Officer'));
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const titles = { create: 'Create User', edit: 'Edit User', reset: 'Reset Password' };

  const handleCreate = async () => {
    if (!token) return;
    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }
    const matchedRole = roles.find(
      r => r.name.toLowerCase().replace(/[\s_]/g, '') === role.toLowerCase().replace(/[\s_]/g, '')
    );
    if (!matchedRole) {
      setError('Please select a valid role.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await register(token, { name, email, password, role_id: matchedRole.id });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-800">{titles[mode]}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>

        {mode === 'reset' ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
              A password reset link will be sent to <strong>{user?.email}</strong>. The user will receive an email with instructions.
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={onClose} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors">Send Reset Link</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
                <input placeholder="+254 7XX XXX XXX"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {roles.length > 0
                    ? roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)
                    : ROLES.slice(1).map(r => <option key={r}>{r}</option>)
                  }
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Location Scope</label>
              <div className="grid grid-cols-2 gap-3">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Kenya</option>
                </select>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>All Regions</option>
                  <option>Rift Valley</option>
                  <option>Nyanza</option>
                  <option>Central</option>
                </select>
              </div>
            </div>
            {mode === 'create' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Set password"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 text-red-700 text-xs">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button
                onClick={mode === 'create' ? handleCreate : onClose}
                disabled={submitting}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating…' : mode === 'create' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserActionsMenu({ user, onEdit, onDelete, onReset }: {
  user: typeof usersData[0];
  onEdit: () => void;
  onDelete: () => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 z-20 w-40 py-1">
            <button onClick={() => { onEdit(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <Edit2 className="h-3.5 w-3.5 text-blue-500" /> Edit User
            </button>
            <button onClick={() => { onReset(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <KeyRound className="h-3.5 w-3.5 text-amber-500" /> Reset Password
            </button>
            <hr className="my-1 border-gray-100" />
            <button onClick={() => { onDelete(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" /> Delete User
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function UserManagementPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [locationTab, setLocationTab] = useState<LocationTab>('country');
  const [statusFilter, setStatusFilter] = useState<UserStatus>('all');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | 'reset'; user?: typeof usersData[0] } | null>(null);
  const [apiRoles, setApiRoles] = useState<ApiRole[]>([]);

  useEffect(() => {
    let isMounted = true;
    getUserRoles(token ?? undefined)
      .then((data) => {
        if (!isMounted) return;
        const list: ApiRole[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setApiRoles(list);
      })
      .catch(() => {/* silently ignore, fall back to hardcoded ROLES */});
    return () => { isMounted = false; };
  }, [token]);

  const filteredUsers = usersData.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchRole = roleFilter === 'All Roles' || u.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  const activeCount = usersData.filter(u => u.status === 'active').length;
  const inactiveCount = usersData.filter(u => u.status === 'inactive').length;

  const locationTabs: { id: LocationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'country', label: 'Country', icon: <Globe className="h-4 w-4" /> },
    { id: 'level1', label: 'Level 1', icon: <MapPin className="h-4 w-4" /> },
    { id: 'level2', label: 'Level 2', icon: <MapPin className="h-4 w-4" /> },
    { id: 'level3', label: 'Level 3', icon: <MapPin className="h-4 w-4" /> },
  ];

  const renderLocationTable = () => {
    const data = {
      country: countriesData,
      level1: level1Data,
      level2: level2Data,
      level3: level3Data,
    }[locationTab];

    const headers: Record<LocationTab, string[]> = {
      country: ['Code', 'Name', 'Region', 'Total Farms', 'Active Users', 'Status', 'Actions'],
      level1: ['Name', 'Country', 'Total Farms', 'Active Users', 'Status', 'Actions'],
      level2: ['Name', 'Level 1', 'Total Farms', 'Active Users', 'Status', 'Actions'],
      level3: ['Name', 'Level 2', 'Total Farms', 'Active Users', 'Status', 'Actions'],
    };

    return (
      <table className="w-full">
        <thead>
          <tr>
            {headers[locationTab].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 bg-gray-50 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data as any[]).map((item, i) => (
            <tr key={item.id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
              {locationTab === 'country' && (
                <>
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">{item.code}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.region}</td>
                </>
              )}
              {locationTab === 'level1' && (
                <>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.countryName}</td>
                </>
              )}
              {locationTab === 'level2' && (
                <>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.level1Name}</td>
                </>
              )}
              {locationTab === 'level3' && (
                <>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.level2Name}</td>
                </>
              )}
              <td className="px-4 py-3 text-sm text-center font-medium text-gray-700">{item.totalFarms}</td>
              <td className="px-4 py-3 text-sm text-center font-medium text-blue-600">{item.activeUsers}</td>
              <td className="px-4 py-3">
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>{item.status}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">User Management</h1>
          <p className="text-gray-500 text-sm">Manage users, roles, and location assignments</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" /> Create User
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'users' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Users className="h-4 w-4" /> Users
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'users' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
            {usersData.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'locations' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <MapPin className="h-4 w-4" /> Locations
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div
              onClick={() => setStatusFilter('all')}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${statusFilter === 'all' ? 'border-green-400 shadow-md' : 'border-gray-200'}`}
            >
              <p className="text-2xl font-bold text-gray-800">{usersData.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total Users</p>
            </div>
            <div
              onClick={() => setStatusFilter('active')}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${statusFilter === 'active' ? 'border-green-400 shadow-md' : 'border-gray-200'}`}
            >
              <p className="text-2xl font-bold text-green-700">{activeCount}</p>
              <p className="text-xs text-gray-500 mt-1">Active</p>
            </div>
            <div
              onClick={() => setStatusFilter('inactive')}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${statusFilter === 'inactive' ? 'border-red-400 shadow-md' : 'border-gray-200'}`}
            >
              <p className="text-2xl font-bold text-gray-400">{inactiveCount}</p>
              <p className="text-xs text-gray-500 mt-1">Inactive</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {['User', 'Email', 'Phone', 'Role', 'Location Scope', 'Last Login', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 bg-gray-50 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => (
                    <tr key={user.id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-400">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                      <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-600 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3 text-gray-400" />
                            <span>{user.country}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span>{user.level1}{user.level2 ? `, ${user.level2}` : ''}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{user.lastLogin}</td>
                      <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                      <td className="px-4 py-3">
                        <UserActionsMenu
                          user={user}
                          onEdit={() => setModal({ mode: 'edit', user })}
                          onDelete={() => {}}
                          onReset={() => setModal({ mode: 'reset', user })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
              Showing {filteredUsers.length} of {usersData.length} users
            </div>
          </div>
        </>
      ) : (
        /* Locations Tab */
        <div className="space-y-5">
          <div className="flex gap-1 overflow-x-auto">
            {locationTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setLocationTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                  locationTab === tab.id
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {locationTab === tab.id && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 capitalize">{locationTab === 'country' ? 'Countries' : `${locationTab} Areas`}</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add Location
              </button>
            </div>
            <div className="overflow-x-auto">
              {renderLocationTable()}
            </div>
          </div>
        </div>
      )}

      {modal && (
        <UserModal mode={modal.mode} user={modal.user} onClose={() => setModal(null)} token={token} roles={apiRoles} />
      )}
    </div>
  );
}
