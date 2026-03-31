import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Milk, AlertCircle, ArrowLeft } from 'lucide-react';

type LoginView = 'login' | 'forgot';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState<LoginView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setForgotSent(true);
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

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {view === 'login' ? (
            <>
              <h2 className="text-gray-800 mb-1">Welcome back</h2>
              <p className="text-gray-500 text-sm mb-6">Sign in to your account to continue</p>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-4">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@dairypro.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setView('forgot'); setError(''); }}
                    className="text-sm text-green-700 hover:text-green-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>


            </>
          ) : (
            <>
              <button
                onClick={() => { setView('login'); setForgotSent(false); setForgotEmail(''); }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>

              <h2 className="text-gray-800 mb-1">Reset password</h2>
              <p className="text-gray-500 text-sm mb-6">
                Enter your email address and we'll send you instructions to reset your password.
              </p>

              {forgotSent ? (
                <div className="text-center py-4">
                  <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-800 mb-1">Email sent!</p>
                  <p className="text-sm text-gray-500">Check <strong>{forgotEmail}</strong> for reset instructions.</p>
                  <button
                    onClick={() => { setView('login'); setForgotSent(false); }}
                    className="mt-4 text-sm text-green-700 hover:underline"
                  >
                    Back to login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !forgotEmail}
                    className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}