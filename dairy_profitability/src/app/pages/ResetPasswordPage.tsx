import { useState, type FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Milk, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { resetPasswordWithToken } from '../services/api';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get('uuid') ?? '';
  const email = searchParams.get('email') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!uuid || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-red-600" />
          </div>
          <h2 className="text-gray-800 mb-2">Invalid Reset Link</h2>
          <p className="text-sm text-gray-500 mb-4">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await resetPasswordWithToken(email, uuid, newPassword);
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to reset password. The link may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-green-700 mb-4 shadow-lg">
            <Milk className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-1">DairyPro</h1>
          <p className="text-gray-500 text-sm">Dairy Profitability & Advisory Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="h-7 w-7 text-green-600" />
              </div>
              <h2 className="text-gray-800 mb-1">Password Reset!</h2>
              <p className="text-sm text-gray-500 mb-6">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-gray-800 mb-1">Set New Password</h2>
              <p className="text-gray-500 text-sm mb-1">
                Resetting password for <strong>{email}</strong>
              </p>
              <p className="text-gray-400 text-xs mb-6">
                Must include uppercase, lowercase, and a number. Minimum 8 characters.
              </p>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-4">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting…' : 'Reset Password'}
                </button>

                <div className="text-center">
                  <Link to="/login" className="text-sm text-green-700 hover:underline">
                    Back to login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
