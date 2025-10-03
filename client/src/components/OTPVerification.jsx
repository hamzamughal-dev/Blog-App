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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 backdrop-blur-3xl">
      <div className="max-w-md w-full">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Compact Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-2">
              📬 Verify Email
            </h2>
            <p className="text-sm text-emerald-700/80 mb-3">
              Enter the 6-digit code sent to {email}
            </p>
          </div>
          <form className="space-y-6" onSubmit={onSubmit}>
            {/* Messages */}
            {(success || error) && (
              <div className={`text-center text-sm mb-4 font-medium ${
                success ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {success ? `✅ ${success}` : `❌ ${error}`}
              </div>
            )}
            
            <div>
              {/* Individual OTP Input Boxes */}
              <div className="flex justify-center space-x-2 sm:space-x-3 mb-4">
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
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center backdrop-blur-md bg-white/30 border-2 border-white/30 rounded-2xl focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xl font-bold text-emerald-800 transition-all duration-300 shadow-lg"
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
                className="md:hidden w-full px-4 py-4 backdrop-blur-md bg-white/30 border border-white/30 placeholder-emerald-600/60 text-emerald-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-lg text-center tracking-widest font-mono transition-all duration-300"
                placeholder="Enter 6-digit code"
                maxLength="6"
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading || resendCooldown > 0}
                className="px-3 py-2 backdrop-blur-md bg-white/30 border border-white/30 text-emerald-700 rounded-lg font-medium hover:bg-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                {resendLoading 
                  ? 'Sending...' 
                  : resendCooldown > 0 
                    ? `Resend (${resendCooldown}s)`
                    : 'Resend'
                }
              </button>

              <button
                type="button"
                onClick={onBackToRegister}
                className="px-3 py-2 backdrop-blur-md bg-white/30 border border-white/30 text-emerald-700 rounded-lg font-medium hover:bg-white/40 transition-all duration-300 text-xs"
              >
                ← Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;