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

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.message ?? body.detail ?? body.error ?? `HTTP ${res.status}`
    );
  }

  return res.json();
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
