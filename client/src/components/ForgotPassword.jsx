import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await authAPI.forgotPassword(email);
      
      if (res.data.success) {
        setSuccess(true);
        setMessage('Password reset email sent! Check your inbox for further instructions.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 backdrop-blur-3xl">
      <div className="max-w-md w-full relative z-10 p-4">
        {!success ? (
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 shadow-2xl">
            {/* Compact Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-2">
                🔐 Forgot Password
              </h2>
              <p className="text-emerald-700/80 text-sm">
                Enter your email to reset your password
              </p>
            </div>
            <form className="space-y-4" onSubmit={onSubmit}>
              {error && (
                <div className="text-center text-red-600 text-sm font-medium">
                  ❌ {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-emerald-700/80 mb-2">
                  📧 Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 backdrop-blur-md bg-white/30 border border-white/30 rounded-xl placeholder-emerald-600/60 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                    placeholder="Enter your email address..."
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Reset Email 📤'
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-2 backdrop-blur-md bg-white/30 border border-white/30 text-emerald-700 rounded-lg font-medium hover:bg-white/40 transition-all duration-300 text-sm"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 shadow-2xl text-center">
            <div className="mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-bold text-emerald-800 mb-2">✅ Email Sent!</p>
              <p className="text-sm text-emerald-700/80">{message}</p>
            </div>

            <p className="text-emerald-700/70 mb-4 text-sm">
              Check your spam folder if needed.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                  setMessage('');
                }}
                className="w-full py-2.5 backdrop-blur-md bg-white/30 border border-white/30 text-emerald-700 rounded-xl font-bold hover:bg-white/40 transition-all duration-300 transform hover:scale-105 text-sm"
              >
                Try Again
              </button>

              <Link
                to="/login"
                className="w-full flex justify-center py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;