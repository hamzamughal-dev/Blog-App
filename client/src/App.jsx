import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import { authAPI } from './services/api'

function AppContent({ isAuthenticated, onAuthSuccess, onLogout }) {
  const location = useLocation();
  const isDashboardRoute = location.pathname === '/dashboard';

  return (
    <div className="App">
      {/* Hide Navbar on Dashboard route since Dashboard has its own navigation */}
      {!isDashboardRoute && (
        <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      )}
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onAuthSuccess={onAuthSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register onAuthSuccess={onAuthSuccess} />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ForgotPassword />
            )
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ResetPassword />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={onLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Verify if the user still exists in database
          const res = await authAPI.getMe();
          if (res.data.success) {
            setIsAuthenticated(true)
          } else {
            // User doesn't exist, remove invalid token
            localStorage.removeItem('token')
            setIsAuthenticated(false)
          }
        } catch (err) {
          // Token is invalid or user was deleted from database
          console.log('Token validation failed, logging out...')
          localStorage.removeItem('token')
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }

    validateToken()
  }, [])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <Router>
      <AppContent 
        isAuthenticated={isAuthenticated} 
        onAuthSuccess={handleAuthSuccess} 
        onLogout={handleLogout} 
      />
    </Router>
  )
}

export default App
