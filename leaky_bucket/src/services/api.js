// src/services/api.js
import { BASE_URL } from '../config';

const jsonHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: token }),
});

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (data.session_expired) {
      window.dispatchEvent(new Event('session_expired'));
    }
    throw data;
  }
  return data;
};

// Auth
export const login = (email, password) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);

export const register = (token, email, password, role_id) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({ email, password, role_id }),
  }).then(handleResponse);

export const getUserRoles = () =>
  fetch(`${BASE_URL}/auth/user_role`, {
    headers: { 'Content-Type': 'application/json' },
  }).then(handleResponse);

export const getSelf = (token) =>
  fetch(`${BASE_URL}/auth/self`, {
    headers: jsonHeaders(token),
  }).then(handleResponse);

// User Management (GET list/single, POST create, PATCH edit/reset/reactivate, DELETE)
export const getUserMgmt = (token, opts = {}) => {
  const params = new URLSearchParams();
  if (opts.user_id != null) params.append('user_id', opts.user_id);
  if (opts.page != null) params.append('page', opts.page);
  if (opts.size != null) params.append('size', opts.size);
  if (opts.status) params.append('status', opts.status);
  if (opts.search_for) params.append('search_for', opts.search_for);
  return fetch(`${BASE_URL}/auth/user_mgmt?${params}`, {
    headers: jsonHeaders(token),
  }).then(handleResponse);
};

export const createUserMgmt = (token, data) =>
  fetch(`${BASE_URL}/auth/user_mgmt`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateUserMgmt = (token, data) =>
  fetch(`${BASE_URL}/auth/user_mgmt`, {
    method: 'PATCH',
    headers: jsonHeaders(token),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteUserMgmt = (token, user_id) =>
  fetch(`${BASE_URL}/auth/user_mgmt`, {
    method: 'DELETE',
    headers: jsonHeaders(token),
    body: JSON.stringify({ user_id }),
  }).then(handleResponse);

// Location
export const getLocationAdm = (token, level, parent_id) => {
  const params = new URLSearchParams({ level });
  if (parent_id != null) params.append('parent_id', parent_id);
  return fetch(`${BASE_URL}/lkp/location/adm?${params}`, {
    headers: jsonHeaders(token),
  }).then(handleResponse);
};

export const getLocationAdmLevel = (token, adm0_id) =>
  fetch(`${BASE_URL}/lkp/location/adm_level?adm0_id=${adm0_id}`, {
    headers: jsonHeaders(token),
  }).then(handleResponse);

// Forms
export const getFormTypes = (token) =>
  fetch(`${BASE_URL}/form/types`, {
    headers: jsonHeaders(token),
  }).then(handleResponse);

export const getForms = (token) =>
  fetch(`${BASE_URL}/forms`, {
    headers: jsonHeaders(token),
  }).then(handleResponse);

export const getFormFields = (token, form_id) =>
  fetch(`${BASE_URL}/form/fields?form_id=${form_id}`, {
    headers: jsonHeaders(token),
  }).then(handleResponse);

// Core — POST with JSON body (form_id mandatory; all others optional)
// opts: { id, data_id, page, size, search_for, adm0_id, adm1_id, adm2_id, adm3_id, adm4_id, crop_id }
export const getCore = (token, form_id, opts = {}) => {
  const body = { form_id };
  if (opts.id != null)       body.id         = opts.id;
  if (opts.data_id != null)  body.data_id    = opts.data_id;
  if (opts.page != null)     body.page       = opts.page;
  if (opts.size != null)     body.size       = opts.size;
  if (opts.search_for)       body.search_for = opts.search_for;
  if (opts.adm0_id)          body.adm0_id    = opts.adm0_id;
  if (opts.adm1_id)          body.adm1_id    = opts.adm1_id;
  if (opts.adm2_id)          body.adm2_id    = opts.adm2_id;
  if (opts.adm3_id)          body.adm3_id    = opts.adm3_id;
  if (opts.adm4_id)          body.adm4_id    = opts.adm4_id;
  if (opts.crop_id)          body.crop_id    = opts.crop_id;  // array of numbers
  const pageParam = opts.page != null ? `?page=${opts.page}` : '';
  return fetch(`${BASE_URL}/core${pageParam}`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(body),
  }).then(handleResponse);
};

export const getCoreSummary = (token, form_id, opts = {}) => {
  const body = { form_id };
  if (opts.adm0_id) body.adm0_id = opts.adm0_id;
  if (opts.adm1_id) body.adm1_id = opts.adm1_id;
  if (opts.adm2_id) body.adm2_id = opts.adm2_id;
  if (opts.adm3_id) body.adm3_id = opts.adm3_id;
  if (opts.adm4_id) body.adm4_id = opts.adm4_id;
  if (opts.crop_id) body.crop_id = opts.crop_id;
  return fetch(`${BASE_URL}/core/summary`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(body),
  }).then(handleResponse);
};

export const getCoreDashboard = (token, purpose, opts = {}) => {
  const body = { purpose };
  if (opts.adm0_id) body.adm0_id = opts.adm0_id;
  if (opts.adm1_id) body.adm1_id = opts.adm1_id;
  if (opts.adm2_id) body.adm2_id = opts.adm2_id;
  if (opts.adm3_id) body.adm3_id = opts.adm3_id;
  if (opts.adm4_id) body.adm4_id = opts.adm4_id;
  if (opts.crop_id) body.crop_id = opts.crop_id;
  return fetch(`${BASE_URL}/core/dashboard`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(body),
  }).then(handleResponse);
};

export const getCoreLkp = (token, tablename) =>
  fetch(`${BASE_URL}/core/lkp/${tablename}`, {
    headers: jsonHeaders(token),
  }).then(handleResponse);

// Sync
export const syncDownload = (token) =>
  fetch(`${BASE_URL}/sync`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({ purpose: 'download' }),
  }).then(handleResponse);

export const syncUpload = (token, payload) =>
  fetch(`${BASE_URL}/sync`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(payload),
  }).then(handleResponse);

// Profile
export const updateProfile = (token, data) =>
  fetch(`${BASE_URL}/auth/profile`, {
    method: 'PATCH',
    headers: jsonHeaders(token),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateProfileImage = (token, file) => {
  const formData = new FormData();
  formData.append('purpose', 'change_profile_image');
  formData.append('profile_image', file);
  return fetch(`${BASE_URL}/auth/profile`, {
    method: 'PATCH',
    headers: { Authorization: token },
    body: formData,
  }).then(handleResponse);
};

export const forgotPassword = (email) =>
  fetch(`${BASE_URL}/auth/forgot_password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then(handleResponse);