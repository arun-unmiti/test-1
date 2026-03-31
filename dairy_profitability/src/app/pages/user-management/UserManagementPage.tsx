import { useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  Search, Plus, Edit2, Trash2, MoreVertical, KeyRound,
  X, UserCheck, UserX, Users, MapPin, Globe, ChevronRight,
  AlertCircle, RefreshCw, Copy, Check, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getUserRoles, getUsers, createUserMgmt, editUser as apiEditUser,
  deleteUser as apiDeleteUser, adminResetPassword as apiAdminResetPassword,
  reactivateUser as apiReactivateUser,
  getCountries, getLocations, getLocationStats,
} from '../../services/api';

interface ApiRole {
  id: number;
  role: string;
}

interface ApiUser {
  user_id: number;
  name: string;
  email: string;
  phone: string | null;
  role_id: number | null;
  role: string | null;
  profile_image: string;
  previous_login: string | null;
  last_login: string | null;
  registered_on: string | null;
  status: 'Active' | 'Deleted';
  country?: string | null;
  adm0_id?: number | null;
  adm1_name?: string | null;
  adm2_name?: string | null;
  primary_location?: {
    location_id: number;
    location_name: string;
    location_level: number;
    assignment_type: string;
  } | null;
}

type Tab = 'users' | 'locations';
type LocationTab = 'country' | 'level1' | 'level2' | 'level3';
type StatusFilter = 'all' | 'active' | 'inactive';

// ─── Status & Role Badges ────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'Active';
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
      isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
    }`}>
      {isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

function RoleBadge({ role }: { role: string | null }) {
  const styles: Record<string, string> = {
    Admin: 'bg-red-100 text-red-700',
    Supervisor: 'bg-blue-100 text-blue-700',
    'Field Officer': 'bg-green-100 text-green-700',
    Veterinarian: 'bg-purple-100 text-purple-700',
    Farmer: 'bg-yellow-100 text-yellow-700',
    Viewer: 'bg-gray-100 text-gray-600',
  };
  const label = role ?? 'Unknown';
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${styles[label] ?? 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
}

// ─── User Create / Edit / Reset Modal ────────────────────────────────────────

interface UserModalProps {
  user?: ApiUser | null;
  onClose: () => void;
  onSuccess: (generatedPassword?: string, userEmail?: string) => void;
  mode: 'create' | 'edit' | 'reset';
  token: string | null;
  roles: ApiRole[];
}

function UserModal({ user, onClose, onSuccess, mode, token, roles }: UserModalProps) {
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [roleId, setRoleId] = useState<number>(user?.role_id ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Location state
  const [adm0Id, setAdm0Id] = useState<number>(user?.adm0_id ?? 0);
  const [locationId, setLocationId] = useState<number>(user?.primary_location?.location_id ?? 0);
  const [selectedLevel1Id, setSelectedLevel1Id] = useState<number>(0);
  const [countries, setCountries] = useState<{ id: number; name: string; iso_code_2?: string }[]>([]);
  const [level1Locs, setLevel1Locs] = useState<{ id: number; name: string }[]>([]);
  const [level2Locs, setLevel2Locs] = useState<{ id: number; name: string }[]>([]);
  const [loadingLocs, setLoadingLocs] = useState(false);

  // When roles finish loading and no role is selected yet, pick the first one
  useEffect(() => {
    if (roleId === 0 && roles.length > 0) {
      setRoleId(user?.role_id ?? roles[0].id);
    }
  }, [roles]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load countries on mount
  useEffect(() => {
    if (!token) return;
    getCountries(token)
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setCountries(list);
      })
      .catch(() => {});
  }, [token]);

  // Cascade level1 when country changes
  useEffect(() => {
    if (!token || !adm0Id) {
      setLevel1Locs([]);
      setLevel2Locs([]);
      setSelectedLevel1Id(0);
      setLocationId(0);
      return;
    }
    setLoadingLocs(true);
    getLocations(token, { adm0_id: adm0Id })
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        // Filter to level 1 only
        const l1 = list.filter((l: any) => l.level === 1 || !l.level);
        setLevel1Locs(l1);
        setLevel2Locs([]);
        setSelectedLevel1Id(0);
      })
      .catch(() => {})
      .finally(() => setLoadingLocs(false));
  }, [adm0Id, token]);

  // Cascade level2 when level1 changes
  useEffect(() => {
    if (!token || !selectedLevel1Id) {
      setLevel2Locs([]);
      return;
    }
    setLoadingLocs(true);
    getLocations(token, { parent_id: selectedLevel1Id })
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setLevel2Locs(list);
      })
      .catch(() => {})
      .finally(() => setLoadingLocs(false));
  }, [selectedLevel1Id, token]);

  const titles = { create: 'Create User', edit: 'Edit User', reset: 'Reset Password' };

  const handleSubmit = async () => {
    if (!token) return;
    setError('');

    if (mode !== 'reset') {
      if (!name.trim() || !email.trim()) {
        setError('Name and email are required.');
        return;
      }
      if (!roleId) {
        setError('Please select a role.');
        return;
      }
      if (!adm0Id) {
        setError('Please select a country.');
        return;
      }
    }

    setSubmitting(true);
    try {
      // Strip non-digit characters from phone before sending
      const cleanPhone = phone.replace(/\D/g, '') || undefined;

      if (mode === 'create') {
        const data = await createUserMgmt(token, {
          name: name.trim(),
          email: email.trim(),
          phone: cleanPhone,
          role_id: roleId,
          adm0_id: adm0Id || undefined,
          location_id: locationId || undefined,
        });
        onSuccess(data?.generated_password, email.trim());
      } else if (mode === 'edit') {
        await apiEditUser(token, {
          user_id: user!.user_id,
          name: name.trim(),
          email: email.trim(),
          phone: cleanPhone,
          role_id: roleId,
          adm0_id: adm0Id || undefined,
          location_id: locationId || undefined,
        });
        onSuccess();
      } else if (mode === 'reset') {
        await apiAdminResetPassword(token, user!.user_id);
        onSuccess();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-800">{titles[mode]}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {mode === 'reset' ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
              This will reset the password for <strong>{user?.email}</strong> to a temporary
              password. The user will receive an email with the new password.
            </div>
            {error && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 text-red-700 text-xs">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
              >
                {submitting ? 'Resetting…' : 'Reset Password'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address *</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Role *</label>
                <select
                  value={roleId || ''}
                  onChange={e => setRoleId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {roleId === 0 && <option value="">Select a role…</option>}
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.role}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location section */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Country *</label>
                <select
                  value={adm0Id || ''}
                  onChange={e => setAdm0Id(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a country…</option>
                  {countries.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {level1Locs.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Level 1 Area {loadingLocs && <span className="text-gray-400">(loading…)</span>}
                  </label>
                  <select
                    value={selectedLevel1Id || locationId || ''}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setSelectedLevel1Id(val);
                      setLocationId(val);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select area…</option>
                    {level1Locs.map((l: any) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {level2Locs.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Level 2 Area {loadingLocs && <span className="text-gray-400">(loading…)</span>}
                  </label>
                  <select
                    value={locationId || ''}
                    onChange={e => setLocationId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select sub-area…</option>
                    {level2Locs.map((l: any) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {mode === 'create' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
                A secure password will be auto-generated for this user. You'll see it after creation so you can share it securely.
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 text-red-700 text-xs">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? (mode === 'create' ? 'Creating…' : 'Saving…')
                  : (mode === 'create' ? 'Create User' : 'Save Changes')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Generated Password Dialog ───────────────────────────────────────────────

function GeneratedPasswordDialog({
  email, password, onClose,
}: {
  email: string;
  password: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <h3 className="text-gray-800 font-semibold mb-1">User Created Successfully</h3>
        {email && (
          <p className="text-sm text-gray-500 mb-4">
            Account for <strong>{email}</strong> has been created.
          </p>
        )}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p className="text-xs text-amber-700 font-medium mb-2">
            Generated Password — share this securely with the user:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-white border border-amber-300 rounded-lg px-3 py-2 text-gray-800">
              {visible ? password : '••••••••••'}
            </code>
            <button
              onClick={() => setVisible(!visible)}
              className="p-2 rounded-lg hover:bg-amber-100 text-amber-600"
              title={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={copy}
              className="p-2 rounded-lg hover:bg-amber-100 text-amber-600"
              title="Copy password"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Delete Confirm Dialog ───────────────────────────────────────────────────

function DeleteConfirmDialog({
  user, onConfirm, onCancel, loading,
}: {
  user: ApiUser;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold">Delete User</h3>
            <p className="text-sm text-gray-500">This can be undone by reactivating the user.</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-5">
          Are you sure you want to deactivate <strong>{user.name}</strong> ({user.email})?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium disabled:opacity-60"
          >
            {loading ? 'Deleting…' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── User Actions Menu ───────────────────────────────────────────────────────

function UserActionsMenu({
  user, onEdit, onDelete, onReset, onReactivate,
}: {
  user: ApiUser;
  onEdit: () => void;
  onDelete: () => void;
  onReset: () => void;
  onReactivate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isActive = user.status === 'Active';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 z-20 w-44 py-1">
            {isActive ? (
              <>
                <button
                  onClick={() => { onEdit(); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit2 className="h-3.5 w-3.5 text-blue-500" /> Edit User
                </button>
                <button
                  onClick={() => { onReset(); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <KeyRound className="h-3.5 w-3.5 text-amber-500" /> Reset Password
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => { onDelete(); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete User
                </button>
              </>
            ) : (
              <button
                onClick={() => { onReactivate(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reactivate
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function UserManagementPage() {
  const { token } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [locationTab, setLocationTab] = useState<LocationTab>('country');

  // Users data state
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [apiRoles, setApiRoles] = useState<ApiRole[]>([]);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [search, setSearch] = useState('');

  // Dialog state
  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | 'reset'; user?: ApiUser } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [generatedPwd, setGeneratedPwd] = useState<{ email: string; password: string } | null>(null);
  const [actionBanner, setActionBanner] = useState<string | null>(null);

  // Location stats state
  const [locationStats, setLocationStats] = useState<{
    country: any[];
    level1: any[];
    level2: any[];
    level3: any[];
  } | null>(null);
  const [locationStatsLoading, setLocationStatsLoading] = useState(false);
  const [locationStatsError, setLocationStatsError] = useState<string | null>(null);

  const showBanner = (msg: string) => {
    setActionBanner(msg);
    setTimeout(() => setActionBanner(null), 4000);
  };

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getUsers(token);
      const list: ApiUser[] = Array.isArray(data?.data) ? data.data : [];
      setUsers(list);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    getUserRoles(token ?? undefined)
      .then(data => {
        const list: ApiRole[] = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setApiRoles(list);
      })
      .catch(() => {});
  }, [token]);

  // Fetch location stats when Locations tab is active
  useEffect(() => {
    if (activeTab !== 'locations' || !token) return;
    if (locationStats) return; // already loaded
    setLocationStatsLoading(true);
    setLocationStatsError(null);
    getLocationStats(token)
      .then(data => {
        if (data?.success === 1 && data?.data) {
          setLocationStats(data.data);
        } else {
          setLocationStatsError('Failed to load location data.');
        }
      })
      .catch((err: unknown) => {
        setLocationStatsError(err instanceof Error ? err.message : 'Failed to load location data.');
      })
      .finally(() => setLocationStatsLoading(false));
  }, [activeTab, token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived counts (from full list, not filtered)
  const totalCount = users.length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const inactiveCount = users.filter(u => u.status === 'Deleted').length;

  // Client-side filtering
  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !search
      || u.name?.toLowerCase().includes(q)
      || u.email?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === 'all'
      || (statusFilter === 'active' ? u.status === 'Active' : u.status === 'Deleted');
    const matchRole = roleFilter === 'All Roles' || u.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  // ── Action handlers ──────────────────────────────────────────────────────

  const handleModalSuccess = (generatedPassword?: string, userEmail?: string) => {
    setModal(null);
    fetchUsers();
    if (generatedPassword) {
      setGeneratedPwd({ email: userEmail ?? '', password: generatedPassword });
    } else {
      showBanner('Changes saved successfully.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setDeleteLoading(true);
    try {
      await apiDeleteUser(token, deleteTarget.user_id);
      setDeleteTarget(null);
      fetchUsers();
      showBanner(`User ${deleteTarget.email} has been deactivated.`);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Failed to delete user');
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReactivate = async (userId: number) => {
    if (!token) return;
    try {
      await apiReactivateUser(token, userId);
      fetchUsers();
      showBanner('User reactivated successfully.');
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Failed to reactivate user');
    }
  };

  // ── Location tab ─────────────────────────────────────────────────────────

  const locationTabs: { id: LocationTab; label: string; icon: ReactNode }[] = [
    { id: 'country', label: 'Country', icon: <Globe className="h-4 w-4" /> },
    { id: 'level1', label: 'Level 1', icon: <MapPin className="h-4 w-4" /> },
    { id: 'level2', label: 'Level 2', icon: <MapPin className="h-4 w-4" /> },
    { id: 'level3', label: 'Level 3', icon: <MapPin className="h-4 w-4" /> },
  ];

  const renderLocationTable = () => {
    const data: any[] = locationStats
      ? (locationStats[locationTab] ?? [])
      : [];

    const headers: Record<LocationTab, string[]> = {
      country: ['Code', 'Name', 'Total Farms', 'Active Users', 'Status', 'Actions'],
      level1: ['Name', 'Country', 'Total Farms', 'Active Users', 'Status', 'Actions'],
      level2: ['Name', 'Level 1', 'Total Farms', 'Active Users', 'Status', 'Actions'],
      level3: ['Name', 'Level 2', 'Total Farms', 'Active Users', 'Status', 'Actions'],
    };

    if (locationStatsLoading) {
      return (
        <div className="px-4 py-10 text-center text-sm text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading location data…
          </div>
        </div>
      );
    }

    if (locationStatsError) {
      return (
        <div className="px-4 py-6 text-center text-sm text-red-500">
          {locationStatsError}
        </div>
      );
    }

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
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers[locationTab].length} className="px-4 py-8 text-center text-sm text-gray-400">
                No data available.
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={item.id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                {locationTab === 'country' && (
                  <>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">{item.code}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                  </>
                )}
                {locationTab === 'level1' && (
                  <>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.country_name}</td>
                  </>
                )}
                {locationTab === 'level2' && (
                  <>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.parent_name}</td>
                  </>
                )}
                {locationTab === 'level3' && (
                  <>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.parent_name}</td>
                  </>
                )}
                <td className="px-4 py-3 text-sm text-center font-medium text-gray-700">{item.total_farms}</td>
                <td className="px-4 py-3 text-sm text-center font-medium text-blue-600">{item.active_users}</td>
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
            ))
          )}
        </tbody>
      </table>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────

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

      {/* Action success banner */}
      {actionBanner && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
          <Check className="h-4 w-4 shrink-0" />
          {actionBanner}
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'users' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Users className="h-4 w-4" /> Users
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            activeTab === 'users' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
          }`}>
            {loading ? '…' : totalCount}
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
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div
              onClick={() => setStatusFilter('all')}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                statusFilter === 'all' ? 'border-green-400 shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-2xl font-bold text-gray-800">{loading ? '—' : totalCount}</p>
              <p className="text-xs text-gray-500 mt-1">Total Users</p>
            </div>
            <div
              onClick={() => setStatusFilter('active')}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                statusFilter === 'active' ? 'border-green-400 shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-2xl font-bold text-green-700">{loading ? '—' : activeCount}</p>
              <p className="text-xs text-gray-500 mt-1">Active</p>
            </div>
            <div
              onClick={() => setStatusFilter('inactive')}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                statusFilter === 'inactive' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-2xl font-bold text-gray-400">{loading ? '—' : inactiveCount}</p>
              <p className="text-xs text-gray-500 mt-1">Inactive</p>
            </div>
          </div>

          {/* Error banner */}
          {fetchError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {fetchError}
              <button onClick={fetchUsers} className="ml-auto text-xs underline hover:no-underline">
                Retry
              </button>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="All Roles">All Roles</option>
                {apiRoles.map(r => (
                  <option key={r.id} value={r.role}>{r.role}</option>
                ))}
              </select>
              <button
                onClick={fetchUsers}
                disabled={loading}
                title="Refresh"
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Table */}
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
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Loading users…
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                        {search || roleFilter !== 'All Roles' || statusFilter !== 'all'
                          ? 'No users match the current filters.'
                          : 'No users found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, i) => (
                      <tr
                        key={user.user_id}
                        className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{user.name}</p>
                              <p className="text-xs text-gray-400">ID: {user.user_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.phone ?? '—'}</td>
                        <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {user.country ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3 text-gray-400 shrink-0" />
                                <span>{user.country}</span>
                              </div>
                              {(user.primary_location?.location_name || user.adm1_name) && (
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  <span>{user.primary_location?.location_name ?? user.adm1_name}</span>
                                </div>
                              )}
                            </div>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {user.last_login ?? '—'}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                        <td className="px-4 py-3">
                          <UserActionsMenu
                            user={user}
                            onEdit={() => setModal({ mode: 'edit', user })}
                            onDelete={() => setDeleteTarget(user)}
                            onReset={() => setModal({ mode: 'reset', user })}
                            onReactivate={() => handleReactivate(user.user_id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
              Showing {filteredUsers.length} of {totalCount} users
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
              <h3 className="text-sm font-semibold text-gray-700 capitalize">
                {locationTab === 'country' ? 'Countries' : `${locationTab} Areas`}
              </h3>
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

      {/* Modals & Dialogs */}
      {modal && (
        <UserModal
          mode={modal.mode}
          user={modal.user}
          onClose={() => setModal(null)}
          onSuccess={handleModalSuccess}
          token={token}
          roles={apiRoles}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          user={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {generatedPwd && (
        <GeneratedPasswordDialog
          email={generatedPwd.email}
          password={generatedPwd.password}
          onClose={() => setGeneratedPwd(null)}
        />
      )}
    </div>
  );
}
