import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const OTPVerification = ({ email, onVerificationSuccess, onBackToRegister }) => {
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer for resend button
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 6) {
      setOTP(value);
      // Clear error when user starts typing
      if (error) setError('');
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const otpValue = paste.replace(/[^0-9]/g, '').slice(0, 6);
    setOTP(otpValue);
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.verifyOTP(email, otp);

      if (res.data.success) {
        localStorage.setItem('token', res.data.user.token);
        onVerificationSuccess(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await authAPI.resendOTP(email);
      
      if (res.data.success) {
        setResendCooldown(60); // 60 second cooldown
        setOTP(''); // Clear current OTP
        setSuccess('New verification code sent to your email!');
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-center text-sm font-medium text-indigo-600">
            {email}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="otp" className="sr-only">
              Verification Code
            </label>
            
            {/* Individual OTP Input Boxes */}
            <div className="flex justify-center space-x-3 mb-4">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index] || ''}
                  onChange={(e) => {
                    const newOtp = otp.split('');
                    newOtp[index] = e.target.value.replace(/[^0-9]/g, '');
                    const otpString = newOtp.join('').slice(0, 6);
                    setOTP(otpString);
                    
                    // Auto-focus next input
                    if (e.target.value && index < 5) {
                      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
                      if (nextInput) nextInput.focus();
                    }
                    
                    if (error) setError('');
                  }}
                  onKeyDown={(e) => {
                    // Handle backspace
                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
                      if (prevInput) prevInput.focus();
                    }
                  }}
                  onPaste={handlePaste}
                  name={`otp-${index}`}
                  className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-xl font-bold"
                />
              ))}
            </div>
            
            {/* Fallback single input for mobile or accessibility */}
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={handleOTPChange}
              onPaste={handlePaste}
              className="md:hidden appearance-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-lg text-center tracking-widest font-mono"
              placeholder="Enter 6-digit code"
              maxLength="6"
              autoComplete="one-time-code"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading || resendCooldown > 0}
              className="text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendLoading 
                ? 'Sending...' 
                : resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend code'
              }
            </button>

            <button
              type="button"
              onClick={onBackToRegister}
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              Back to registration
            </button>
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center">
          <p>Check your spam folder if you don't see the email.</p>
          <p>The verification code will expire in 10 minutes.</p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;