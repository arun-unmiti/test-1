// src/pages/Login.js
import React, { useState } from 'react';
import { login, forgotPassword } from '../services/api';
import Swal from 'sweetalert2';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      const token = data.token || data.access_token || data.data?.token || data.data?.access_token;
      const user = data.user || data.data?.user || data.data || { email };
      if (!token) throw new Error('No token in response');
      onLoginSuccess(token, user);
    } catch (err) {
      // Bug #10: generic message — don't reveal whether email exists
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail);
      setShowForgot(false);
      setForgotEmail('');
      Swal.fire({
        icon: 'success',
        title: 'Email Sent',
        text: 'A password reset link has been sent to your email.',
        confirmButtonColor: '#2e7d32',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Not Found',
        text: err?.message || 'No active account found with that email.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      className="d-flex min-vh-100 align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 45%, #81c784 100%)',
      }}
    >
      <div
        className="card p-4 shadow"
        style={{ width: '100%', maxWidth: '440px', borderRadius: '16px', border: 'none' }}
      >
        {/* Branding */}
        <div className="text-center mb-4">
          <h1 className="mb-1 fw-bold" style={{ color: '#1b5e20', fontSize: '1.5rem' }}>Leaky Bucket</h1>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>

          <div className="mb-1">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <input
                type={showPw ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
                style={{ borderLeft: 'none' }}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="text-end mb-4">
            <button
              type="button"
              className="btn btn-link p-0"
              style={{ fontSize: 13, color: '#2e7d32' }}
              onClick={() => { setShowForgot(true); setForgotEmail(email); }}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="btn btn-addnew w-100" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Reset Password</h5>
                <button type="button" className="btn-close" onClick={() => setShowForgot(false)} />
              </div>
              <form onSubmit={handleForgotPassword}>
                <div className="modal-body">
                  <p className="text-muted small">Enter your email address and we'll send you a link to reset your password.</p>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-cancel" onClick={() => setShowForgot(false)}>Cancel</button>
                  <button type="submit" className="btn btn-addnew" disabled={forgotLoading}>
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
