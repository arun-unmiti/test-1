// src/pages/Settings.js
import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { getSelf, updateProfile, updateProfileImage } from '../services/api';
import Swal from 'sweetalert2';

// Password strength scorer (0-4)
const getPasswordStrength = (pw) => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
};

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#dc3545', '#fd7e14', '#ffc107', '#28a745'];

function Settings({ token }) {
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("Profile");

  // Original profile (for cancel)
  const [origProfile, setOrigProfile] = useState(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    profileImage: '',
    previousLogin: '',
    userId: null,
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Security tab state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [twoFaEnabled] = useState(false);

  const pwStrength = getPasswordStrength(newPw);

  useEffect(() => {
    if (!token) return;
    getSelf(token)
      .then((data) => {
        const u = data.data || data.user || data;
        const p = {
          name: u.farmer?.name || u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          role: u.role || '',
          profileImage: u.profile_image || '',
          previousLogin: u.previous_login || '',
          userId: u.user_id || null,
        };
        setProfile(p);
        setOrigProfile(p);
      })
      .catch(() => {});
  }, [token]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'File too large', text: 'Max size is 2MB.', confirmButtonColor: '#d33' });
      return;
    }
    setPhotoLoading(true);
    try {
      await updateProfileImage(token, file);
      // Refresh profile image
      const data = await getSelf(token);
      const u = data.data || data.user || data;
      setProfile((p) => ({ ...p, profileImage: u.profile_image || '' }));
      Swal.fire({ icon: 'success', title: 'Photo Updated', text: 'Profile photo has been updated.', confirmButtonColor: '#2e7d32', timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: err?.message || 'Could not upload photo.', confirmButtonColor: '#d33' });
    } finally {
      setPhotoLoading(false);
      e.target.value = '';
    }
  };

  const handleSaveProfile = async () => {
    // Validation
    if (!profile.email) {
      Swal.fire({ icon: 'warning', title: 'Validation', text: 'Email is required.', confirmButtonColor: '#2e7d32' });
      return;
    }
    if (profile.phone && !/^\d+$/.test(profile.phone)) {
      Swal.fire({ icon: 'warning', title: 'Validation', text: 'Phone number must contain digits only.', confirmButtonColor: '#2e7d32' });
      return;
    }
    setProfileLoading(true);
    try {
      await updateProfile(token, { purpose: 'edit', email: profile.email, phone: profile.phone || null });
      setOrigProfile({ ...profile });
      Swal.fire({ icon: 'success', title: 'Saved', text: 'Profile updated successfully.', confirmButtonColor: '#2e7d32', timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save Failed', text: err?.message || 'Could not save profile.', confirmButtonColor: '#d33' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCancel = () => {
    if (origProfile) setProfile(origProfile);
  };

  const handleChangePassword = async () => {
    setPwError('');
    if (!currentPw || !newPw || !confirmPw) {
      setPwError('All password fields are required.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New password and confirm password do not match.');
      return;
    }
    if (pwStrength < 2) {
      setPwError('Password is too weak. Include uppercase, lowercase, and numbers.');
      return;
    }
    setPwLoading(true);
    try {
      await updateProfile(token, { purpose: 'reset_password', current_password: currentPw, new_password: newPw });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      Swal.fire({ icon: 'success', title: 'Password Changed', text: 'Your password has been updated successfully.', confirmButtonColor: '#2e7d32', timer: 2500, showConfirmButton: false });
    } catch (err) {
      setPwError(err?.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  const handle2FAToggle = () => {
    Swal.fire({
      icon: 'info',
      title: 'Coming Soon',
      text: 'Two-Factor Authentication will be available in a future update.',
      confirmButtonColor: '#2e7d32',
    });
  };

  const initials = (profile.name ? profile.name[0] : (profile.email?.[0] || 'A')).toUpperCase();

  return (
    <>
      <div className="container-fluid">
        <div className="row p-3">
          <div className="col-sm-12">
            <div className="overviewBox">
              <h3>Settings</h3>
              <p>Manage your profile and security preferences</p>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-sm-12 col-md-4 col-lg-4">
            <div className="tabBox one mb-3">
              <ul className="nav nav-tabs nav-fill tblmapTab border-0 mb-0 pb-0">
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === "Profile" ? "active" : ""}`} onClick={() => setActiveTab("Profile")}>
                    Profile
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === "Security" ? "active" : ""}`} onClick={() => setActiveTab("Security")}>
                    Security
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-sm-12 col-md-12 col-lg-12">
            <div className="card tbl search">
              <div className="card-body">
                <div className="tab-content mt-3 bg-transparent">

                  {/* ── Profile Tab ─────────────────────────────── */}
                  {activeTab === "Profile" && (
                    <div className="tab-pane active">
                      <div className="row">
                        <div className="col-12">
                          <div className="profileBox">
                            <p><span><img src="./assets/images/profile.png" alt="" /></span>&nbsp; Profile Information</p>
                          </div>
                        </div>

                        {/* Avatar + photo change */}
                        <div className="col-12 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="profileCircle">
                              {profile.profileImage ? (
                                <img src={profile.profileImage} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} onError={(e) => { e.target.style.display = 'none'; }} />
                              ) : (
                                <span>{initials}</span>
                              )}
                            </div>
                            <div className="upload-container ms-4">
                              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept=".jpg,.jpeg,.png" />
                              <button className="btn btn-upload" onClick={() => fileInputRef.current.click()} disabled={photoLoading}>
                                {photoLoading ? 'Uploading...' : 'Change Photo'}
                              </button>
                              <p className="mt-2 mb-0 small text-muted">JPG or PNG. Max size 2MB</p>
                            </div>
                          </div>
                        </div>

                        {/* Form fields */}
                        <div className="col-12">
                          <div className="row mt-2 search">
                            <div className="col-sm-12 col-md-6 mb-3">
                              <label>Name <span className="text-muted small">(read-only)</span></label>
                              <InputText type="text" className="w-100 h46px pd0" value={profile.name || '—'} readOnly style={{ background: '#f8f9fa', cursor: 'default' }} />
                            </div>
                            <div className="col-sm-12 col-md-6 mb-3">
                              <label>Email *</label>
                              <InputText type="email" className="w-100 h46px pd0" placeholder="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                            </div>
                            <div className="col-sm-12 col-md-6 mb-3">
                              <label>Phone</label>
                              <InputText
                                type="text"
                                className="w-100 h46px pd0"
                                placeholder="Digits only"
                                value={profile.phone}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  if (v === '' || /^\d+$/.test(v)) setProfile({ ...profile, phone: v });
                                }}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 mb-3">
                              <label>Role <span className="text-muted small">(read-only)</span></label>
                              <div className="d-flex align-items-center mt-1">
                                <span className="buyerbadge px-3 py-2" style={{ fontSize: 14 }}>{profile.role || '—'}</span>
                              </div>
                            </div>
                            <div className="col-sm-12 col-md-6 mb-3">
                              <label>Last Login <span className="text-muted small">(read-only)</span></label>
                              <InputText type="text" className="w-100 h46px pd0" value={profile.previousLogin || '—'} readOnly style={{ background: '#f8f9fa', cursor: 'default' }} />
                            </div>

                            <div className="col-12 mt-2">
                              <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-cancel" onClick={handleCancel} disabled={profileLoading}>Cancel</button>
                                <button className="btn btn-addnew" onClick={handleSaveProfile} disabled={profileLoading}>
                                  {profileLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Security Tab ─────────────────────────────── */}
                  {activeTab === "Security" && (
                    <div className="tab-pane active">
                      <div className="overviewBox">

                        {/* Change Password */}
                        <div className="row">
                          <div className="col-sm-12 col-md-6">
                            <div className="profileBox">
                              <p><span><img src="./assets/images/lock.png" alt="" /></span>&nbsp; Security Settings</p>
                            </div>
                            <div className="passwordBox mt-3">
                              <h6>Change Password</h6>

                              {pwError && <div className="alert alert-danger py-2 small mt-2">{pwError}</div>}

                              <div className="mb-2 mt-3">
                                <label>Current Password</label>
                                <div className="input-group">
                                  <input type={showCurrentPw ? 'text' : 'password'} className="form-control" placeholder="Current password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
                                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCurrentPw(v => !v)} tabIndex={-1}>{showCurrentPw ? '🙈' : '👁️'}</button>
                                </div>
                              </div>

                              <div className="mb-2">
                                <label>New Password</label>
                                <div className="input-group">
                                  <input type={showNewPw ? 'text' : 'password'} className="form-control" placeholder="New password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowNewPw(v => !v)} tabIndex={-1}>{showNewPw ? '🙈' : '👁️'}</button>
                                </div>
                                {/* Password strength indicator */}
                                {newPw && (
                                  <div className="mt-1">
                                    <div className="d-flex gap-1 mb-1">
                                      {[1,2,3,4].map(i => (
                                        <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= pwStrength ? STRENGTH_COLORS[pwStrength] : '#e0e0e0', transition: 'background 0.2s' }} />
                                      ))}
                                    </div>
                                    <small style={{ color: STRENGTH_COLORS[pwStrength] }}>{STRENGTH_LABELS[pwStrength]}</small>
                                  </div>
                                )}
                              </div>

                              <div className="mb-2">
                                <label>Confirm New Password</label>
                                <div className="input-group">
                                  <input type={showConfirmPw ? 'text' : 'password'} className="form-control" placeholder="Confirm new password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} style={{ borderColor: confirmPw && newPw !== confirmPw ? '#dc3545' : '' }} />
                                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPw(v => !v)} tabIndex={-1}>{showConfirmPw ? '🙈' : '👁️'}</button>
                                </div>
                                {confirmPw && newPw !== confirmPw && <small className="text-danger">Passwords do not match</small>}
                              </div>
                            </div>

                            <button className="btn btn-addnew my-3" onClick={handleChangePassword} disabled={pwLoading}>
                              {pwLoading ? 'Updating...' : 'Update Password'}
                            </button>
                          </div>
                        </div>

                        <hr />

                        {/* 2FA */}
                        <div className="row">
                          <div className="col-sm-12 col-md-6">
                            <div className="profileBox">
                              <h6>Two-Factor Authentication</h6>
                              <p className="para">Add an extra layer of security to your account</p>
                            </div>
                            <div className="profileBox">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6>Enable 2FA</h6>
                                  <p className="para mb-0">Require code from authenticator app</p>
                                  <small className="text-muted">Coming soon</small>
                                </div>
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={twoFaEnabled}
                                    onChange={handle2FAToggle}
                                    style={{ cursor: 'pointer', width: 40, height: 22 }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr />

                        {/* Active Sessions */}
                        <div className="col-12">
                          <div className="passwordBox mt-4">
                            <h6>Active Sessions</h6>
                            <p className="text-muted small">These are the devices currently signed in to your account. Click <strong>Revoke</strong> to sign out a session you don't recognise.</p>
                          </div>

                          <div className="benchMark white d-flex justify-content-between px-3 mt-3">
                            <div>
                              <h4 className="mb-0 text-start">Chrome on Windows <span className="buyerbadge ms-2">Current</span></h4>
                              <div className="profileBox"><p className="para mb-0">2 hours ago</p></div>
                            </div>
                          </div>

                          <div className="benchMark white d-flex justify-content-between align-items-center px-3 mt-3">
                            <div>
                              <h4 className="mb-0 text-start">Safari on iPhone</h4>
                              <div className="profileBox"><p className="para mb-0">1 day ago</p></div>
                            </div>
                            <div>
                              <button
                                className="btn btn-sm btn-delete"
                                onClick={() => Swal.fire({ icon: 'info', title: 'Coming Soon', text: 'Session management will be available in a future update.', confirmButtonColor: '#2e7d32' })}
                                title="Sign out this session"
                              >
                                Revoke
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
