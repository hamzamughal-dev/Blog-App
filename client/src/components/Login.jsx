import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import OTPVerification from './OTPVerification';

const Login = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);

    try {
      const res = await authAPI.login({
        email,
        password
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.user.token);
        onAuthSuccess();
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.needsVerification) {
        setNeedsVerification(true);
        setError('Your email is not verified. Please verify your email to continue.');
      } else {
        setError(errorData?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setLoading(true);
      // Request new OTP
      const res = await authAPI.resendOTP(email);
      if (res.data.success) {
        setShowOTPVerification(true);
        setNeedsVerification(false);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (message) => {
    setShowOTPVerification(false);
    alert(message || 'Email verified successfully!');
    onAuthSuccess();
  };

  const handleBackToLogin = () => {
    setShowOTPVerification(false);
    setNeedsVerification(false);
    setError('');
  };

  // Show OTP verification if user needs to verify email
  if (showOTPVerification) {
    return (
      <OTPVerification 
        email={email}
        onVerificationSuccess={handleVerificationSuccess}
        onBackToRegister={handleBackToLogin}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/20 to-transparent"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10 p-4">
        {/* Glass Morphism Card */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-6">
          <div className="text-center mb-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center shadow-xl">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-2">
              Welcome Back! 🌱
            </h2>
            <p className="text-emerald-700/80 text-sm">
              Sign in to your AgriBot account
            </p>
          </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          {error && (
            <div className={`backdrop-blur-md border px-4 py-3 rounded-xl shadow-lg ${
              needsVerification 
                ? 'bg-yellow-100/80 border-yellow-400/50 text-yellow-800'
                : 'bg-red-100/80 border-red-400/50 text-red-800'
            }`}>
              <div className="flex items-center">
                {needsVerification ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{error}</span>
              </div>
              {needsVerification && (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={loading}
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending verification email...
                    </div>
                  ) : (
                    'Send verification email'
                  )}
                </button>
              )}
            </div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={onChange}
                className="block w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/30 border border-white/30 rounded-xl placeholder-emerald-600/60 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={onChange}
                className="block w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/30 border border-white/30 rounded-xl placeholder-emerald-600/60 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in 🚀'
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
            <Link
              to="/forgot-password"
              className="font-medium text-emerald-600 hover:text-emerald-800 transition-colors backdrop-blur-md bg-white/20 px-3 py-2 rounded-lg border border-white/30 hover:bg-white/30 text-sm"
            >
              Forgot password?
            </Link>
            
            <Link
              to="/register"
              className="font-medium text-emerald-600 hover:text-emerald-800 transition-colors backdrop-blur-md bg-white/20 px-3 py-2 rounded-lg border border-white/30 hover:bg-white/30 text-sm"
            >
              Create account
            </Link>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Login;