import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.resetPassword(token, password);
      
      if (res.data.success) {
        setSuccess(true);
        // Auto login the user
        localStorage.setItem('token', res.data.user.token);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may be expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500/20 via-pink-500/20 to-purple-600/30 backdrop-blur-3xl">
        <div className="max-w-md w-full space-y-8">
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-800 to-pink-700 bg-clip-text text-transparent mb-4">
              ❌ Invalid Reset Link
            </h2>
            <div className="backdrop-blur-md bg-red-100/80 border border-red-200/50 text-red-800 px-4 py-3 rounded-xl mb-6">
              The password reset link is invalid or missing.
            </div>
            <Link
              to="/forgot-password"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              🔄 Request New Reset
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 backdrop-blur-3xl">
      <div className="max-w-md w-full space-y-8">
        {/* Glass Morphism Header */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-4">
              🔐 Reset Password
            </h2>
            <p className="text-emerald-700/80 leading-relaxed">
              Enter your new secure password below
            </p>
          </div>
        </div>

        {!success ? (
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <form className="space-y-6" onSubmit={onSubmit}>
              {error && (
                <div className="backdrop-blur-md bg-red-100/80 border border-red-200/50 text-red-800 px-4 py-3 rounded-xl flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-emerald-700/80 mb-3">
                    🔒 New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-white/30 border border-white/30 rounded-2xl placeholder-emerald-600/60 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-lg"
                      placeholder="Enter new password (min 6 characters)..."
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-emerald-700/80 mb-3">
                    🔍 Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-white/30 border border-white/30 rounded-2xl placeholder-emerald-600/60 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-lg"
                      placeholder="Confirm your new password..."
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`h-3 w-full rounded-full transition-all duration-300 ${password.length >= 6 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-pink-500'}`}></div>
                    <span className={`text-sm font-bold ${password.length >= 6 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {password.length >= 6 ? '✓' : '✗'}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${password.length >= 6 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {password.length >= 6 ? '💪 Strong password' : '⚠️ Password too short (minimum 6 characters)'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {loading ? '🔄 Resetting...' : '✅ Reset Password'}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 backdrop-blur-md bg-white/30 border border-white/30 text-emerald-700 rounded-xl font-medium hover:bg-white/40 transition-all duration-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="backdrop-blur-md bg-emerald-100/80 border border-emerald-200/50 text-emerald-800 px-6 py-4 rounded-2xl mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="font-bold text-xl mb-3">🎉 Password Reset Successful!</p>
              <p className="text-sm">You have been automatically logged in. Redirecting to dashboard...</p>
            </div>

            <div className="flex justify-center">
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-emerald-700 font-medium">🚀 Redirecting...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;