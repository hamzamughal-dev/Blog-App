import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setMobileMenuOpen(false);
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  // Navigation links for authenticated users
  const navLinks = [
    { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Dashboard', path: '/dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Prediction', path: '/prediction', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'AI Assistant', path: '/ai-assistant', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { name: 'About', path: '/about', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden ${
        scrolled 
          ? 'backdrop-blur-xl bg-white shadow-2xl border-b border-emerald-100/50' 
          : 'backdrop-blur-md bg-white border-b border-white/20'
      }`}
    >
      {/* Animated Glowing Orbs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Center Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Left Side Glow */}
        <motion.div
          className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(5, 150, 105, 0.2) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{
            x: [-50, 0, -50],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Right Side Glow */}
        <motion.div
          className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)',
            filter: 'blur(45px)',
          }}
          animate={{
            x: [50, 0, 50],
            scale: [1.2, 1, 1.2],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
              filter: 'blur(2px)',
              left: `${10 + i * 12}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
        
        {/* Gradient Sweep Effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%)',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
              >
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </motion.div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 bg-clip-text text-transparent">
                  AgriBot
                </span>
                <p className="text-xs text-emerald-600 font-medium">Smart Farming Solutions</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Authenticated */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 group ${
                      isActivePath(link.path)
                        ? 'text-white bg-gradient-to-r from-emerald-600 to-green-700 shadow-lg'
                        : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                    </svg>
                    <span>{link.name}</span>
                    {isActivePath(link.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Right Side - Auth Buttons / User Menu */}
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold backdrop-blur-md border-2 transition-all duration-300 ${
                      isActivePath('/login')
                        ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white border-emerald-600 shadow-lg'
                        : 'text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                    }`}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 border-2 ${
                      isActivePath('/register')
                        ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white border-emerald-600 shadow-xl'
                        : 'text-emerald-700 bg-white hover:bg-emerald-50 border-emerald-300 hover:border-emerald-400 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <span>Sign Up</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            ) : (
              <>
                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-700 hover:text-emerald-900 backdrop-blur-md bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 transition-all duration-300"
                  >
                    <div className="h-9 w-9 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">{user?.username?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-bold text-gray-900">{user?.username}</div>
                      <div className="text-xs text-emerald-600 capitalize">{user?.role}</div>
                    </div>
                    <motion.svg 
                      animate={{ rotate: showUserDropdown ? 180 : 0 }}
                      className="h-4 w-4 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </motion.button>

                  {/* Premium Dropdown Menu */}
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl border-2 border-emerald-100 z-50 overflow-hidden"
                      >
                        {/* User Info Header */}
                        <div className="px-6 py-5 bg-gradient-to-br from-emerald-50 to-green-50 border-b-2 border-emerald-100">
                          <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-xl">{user?.username?.[0]?.toUpperCase()}</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-lg font-bold text-emerald-900">{user?.username}</div>
                              <div className="text-sm text-emerald-700">{user?.email}</div>
                              <div className="inline-block mt-1 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full capitalize">
                                {user?.role} Member
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <div className="px-4 py-2 text-xs text-emerald-600 font-medium flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <motion.button 
                            whileHover={{ x: 5 }}
                            className="w-full text-left px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 rounded-xl flex items-center space-x-3 transition-all duration-300 mb-1"
                          >
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="font-semibold">My Profile</span>
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ x: 5 }}
                            className="w-full text-left px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 rounded-xl flex items-center space-x-3 transition-all duration-300 mb-1"
                          >
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="font-semibold">Settings</span>
                          </motion.button>

                          <motion.button 
                            whileHover={{ x: 5 }}
                            className="w-full text-left px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 rounded-xl flex items-center space-x-3 transition-all duration-300 mb-1"
                          >
                            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="font-semibold">Help & Support</span>
                          </motion.button>
                          
                          <div className="border-t-2 border-emerald-100 mt-3 pt-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleLogout}
                              className="w-full px-4 py-3 text-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span>Logout</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-emerald-100 py-4"
            >
              {isAuthenticated ? (
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActivePath(link.path)
                          ? 'text-white bg-gradient-to-r from-emerald-600 to-green-700'
                          : 'text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                      </svg>
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full px-4 py-3 text-center rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
                      isActivePath('/login')
                        ? 'text-white bg-gradient-to-r from-emerald-600 to-green-700 border-emerald-600 shadow-lg'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full px-4 py-3 text-center rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
                      isActivePath('/register')
                        ? 'text-white bg-gradient-to-r from-emerald-600 to-green-700 border-emerald-600 shadow-xl'
                        : 'text-emerald-700 bg-white hover:bg-emerald-50 border-emerald-300 hover:border-emerald-400'
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;