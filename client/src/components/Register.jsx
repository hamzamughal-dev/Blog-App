import { useState } from 'react';
import { authAPI } from '../services/api';
import OTPVerification from './OTPVerification';

const Register = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.register({
        username,
        email,
        password
      });

      if (res.data.success) {
        setRegisteredEmail(email);
        setShowOTPVerification(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (message) => {
    // Show success message briefly then proceed to dashboard
    setTimeout(() => {
      onAuthSuccess();
    }, 1500);
  };

  const handleBackToRegister = () => {
    setShowOTPVerification(false);
    setRegisteredEmail('');
    setError('');
  };

  // Show OTP verification if registration was successful
  if (showOTPVerification) {
    return (
      <OTPVerification 
        email={registeredEmail}
        onVerificationSuccess={handleVerificationSuccess}
        onBackToRegister={handleBackToRegister}
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
          <div className="text-center mb-5">
            {/* Logo */}
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center shadow-xl">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-2">
              Join AgriBot! 🚀
            </h2>
            <p className="text-emerald-700/80 text-sm mb-4">
              Create account & detect plant diseases
            </p>
            
            {/* Progress Steps */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl px-4 py-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">1</div>
                  <span className="ml-1 text-emerald-700 font-medium text-xs">Register</span>
                </div>
                <div className="w-4 border-t border-emerald-300/50"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-white/30 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold border border-white/40">2</div>
                  <span className="ml-1 text-emerald-600/70 font-medium text-xs">Verify</span>
                </div>
                <div className="w-4 border-t border-emerald-300/50"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-white/30 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold border border-white/40">3</div>
                  <span className="ml-1 text-emerald-600/70 font-medium text-xs">Start</span>
                </div>
              </div>
            </div>
          </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          {error && (
            <div className="backdrop-blur-md bg-red-100/80 border border-red-400/50 text-red-800 px-4 py-3 rounded-xl shadow-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={onChange}
                className="block w-full pl-10 pr-4 py-2.5 backdrop-blur-md bg-white/30 border border-white/30 rounded-xl placeholder-emerald-600/60 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                placeholder="Username"
              />
            </div>
            
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
                className="block w-full pl-10 pr-4 py-2.5 backdrop-blur-md bg-white/30 border border-white/30 rounded-xl placeholder-emerald-600/60 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
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
                className="block w-full pl-10 pr-4 py-2.5 backdrop-blur-md bg-white/30 border border-white/30 rounded-xl placeholder-emerald-600/60 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                placeholder="Password"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={onChange}
                className="block w-full pl-10 pr-4 py-2.5 backdrop-blur-md bg-white/30 border border-white/30 rounded-xl placeholder-emerald-600/60 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create Account 🌱'
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Register;