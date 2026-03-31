import { BASE_URL } from '../config';

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));

  if (body?.session_expired === true) {
    window.dispatchEvent(new CustomEvent('dairy:session-expired'));
    throw new Error(body.message ?? 'Session expired');
  }

  if (!res.ok) {
    throw new Error(
      body.message ?? body.detail ?? body.error ?? `HTTP ${res.status}`
    );
  }

  return body;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: token };
}

// ── Auth: General ────────────────────────────────────────────────────────────

export function login(email: string, password: string) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(
  token: string,
  data: { name: string; email: string; password: string; role_id: number }
) {
  return request('/auth/register', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function getUserRoles(token?: string) {
  return request('/auth/user_role', {
    headers: token ? authHeaders(token) : {},
  });
}

// ── Auth: Profile ────────────────────────────────────────────────────────────

export function getSelf(token: string) {
  return request('/auth/self', { headers: authHeaders(token) });
}

export function updateProfile(
  token: string,
  data: { name?: string; email?: string; phone?: string | null }
) {
  return request('/auth/profile', {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ purpose: 'edit', ...data }),
  });
}

export function resetSelfPassword(
  token: string,
  currentPassword: string,
  newPassword: string
) {
  return request('/auth/profile', {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({
      purpose: 'reset_password',
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}

// ── User Management ───────────────────────────────────────────────────────────

export function getUsers(
  token: string,
  params?: {
    status?: 'active' | 'inactive';
    search_for?: string;
    page?: number;
    size?: number;
  }
) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.search_for) qs.set('search_for', params.search_for);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.size) qs.set('size', String(params.size));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request(`/auth/user_mgmt${query}`, {
    headers: authHeaders(token),
  });
}

export function createUserMgmt(
  token: string,
  data: { name: string; email: string; phone?: string; role_id: number; adm0_id?: number; location_id?: number }
) {
  return request('/auth/user_mgmt', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function editUser(
  token: string,
  data: { user_id: number; name: string; email: string; phone?: string; role_id: number; adm0_id?: number; location_id?: number }
) {
  return request('/auth/user_mgmt', {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ purpose: 'edit', ...data }),
  });
}

export function deleteUser(token: string, userId: number) {
  return request('/auth/user_mgmt', {
    method: 'DELETE',
    headers: authHeaders(token),
    body: JSON.stringify({ user_id: userId }),
  });
}

export function adminResetPassword(token: string, userId: number) {
  return request('/auth/user_mgmt', {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ purpose: 'reset_password', user_id: userId }),
  });
}

export function reactivateUser(token: string, userId: number) {
  return request('/auth/user_mgmt', {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ purpose: 'reactivate', user_id: userId }),
  });
}

// ── Password Reset ────────────────────────────────────────────────────────────

export function forgotPassword(email: string) {
  return request('/auth/forgot_password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPasswordWithToken(
  email: string,
  passwordResetToken: string,
  newPassword: string
) {
  return request('/auth/reset_password', {
    method: 'PATCH',
    body: JSON.stringify({
      email,
      password_reset_token: passwordResetToken,
      new_password: newPassword,
    }),
  });
}

// ── Location Lookups ──────────────────────────────────────────────────────────

export function getCountries(token: string) {
  return request('/lkp/country', { headers: authHeaders(token) });
}

export function getLocations(token: string, params: { adm0_id?: number; parent_id?: number }) {
  const qs = new URLSearchParams();
  if (params.adm0_id) qs.set('adm0_id', String(params.adm0_id));
  if (params.parent_id) qs.set('parent_id', String(params.parent_id));
  return request(`/lkp/location?${qs.toString()}`, { headers: authHeaders(token) });
}

export function getLocationStats(token: string) {
  return request('/web/location_stats', { headers: authHeaders(token) });
}
