import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            // User doesn't exist in database, trigger logout
            console.log('User not found in database, logging out...');
            onLogout();
            navigate('/login');
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          // If user fetch fails (user deleted from database), logout automatically
          if (err.response?.status === 401 || err.response?.status === 404) {
            console.log('User authentication failed, logging out...');
            onLogout();
            navigate('/login');
          }
        }
      } else {
        // Reset user data and close dropdown when not authenticated
        setUser(null);
        setShowUserDropdown(false);
      }
    };

    fetchUser();
  }, [isAuthenticated, onLogout, navigate]);

  // Reset dropdown state when authentication status changes
  useEffect(() => {
    setShowUserDropdown(false);
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowUserDropdown(false); // Close dropdown before logout
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="backdrop-blur-xl bg-white/90 border-b border-white/20 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent">
                AgriBot
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-emerald-700 hover:text-emerald-900 px-4 py-2.5 rounded-xl text-sm font-semibold backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-emerald-700 hover:text-emerald-900 px-4 py-2.5 rounded-xl text-sm font-semibold backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 transition-all duration-300"
                >
                  Dashboard
                </Link>
                
                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-700 hover:text-emerald-900 backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 transition-all duration-300"
                  >
                    <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{user?.username?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900">{user?.username}</div>
                      <div className="text-xs text-gray-500">{user?.role}</div>
                    </div>
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Glass Morphism Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-3 w-72 backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl border border-white/30 z-50 overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/50 to-green-50/50 border-b border-white/30">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">{user?.username?.[0]?.toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="text-base font-bold text-emerald-800">{user?.username}</div>
                            <div className="text-sm text-emerald-600">{user?.email}</div>
                            <div className="text-xs text-emerald-500 capitalize font-medium">{user?.role} Member</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <div className="px-4 py-2 text-xs text-emerald-600/70 font-medium">
                          🌱 Member since {new Date(user?.createdAt).toLocaleDateString()}
                        </div>
                        
                        <button className="w-full text-left px-4 py-3 text-sm text-emerald-700 hover:bg-white/40 rounded-xl flex items-center space-x-3 transition-all duration-300 mb-1">
                          <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="font-medium">Profile Settings</span>
                        </button>
                        
                        <button className="w-full text-left px-4 py-3 text-sm text-emerald-700 hover:bg-white/40 rounded-xl flex items-center space-x-3 transition-all duration-300 mb-1">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="font-medium">Account Settings</span>
                        </button>
                        
                        <div className="border-t border-white/30 mt-3 pt-3">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 rounded-xl flex items-center space-x-3 transition-all duration-300"
                          >
                            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;