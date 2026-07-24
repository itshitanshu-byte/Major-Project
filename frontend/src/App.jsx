import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Predictor from './pages/Predictor';
import StudentReport from './pages/StudentReport';
import { LogOut, LayoutDashboard, Brain, Database, PlusCircle, Sun, Moon } from 'lucide-react';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: 'var(--text-secondary)'
      }}>
        <div className="text-gradient">Initializing EduScore...</div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Navigation layout wrapper for logged-in users
const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');

  React.useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow effects */}
      <div className="glow-bg">
        <div className="glow-sphere-1"></div>
        <div className="glow-sphere-2"></div>
      </div>

      {/* Navbar */}
      <nav className="glass-panel no-print" style={{
        margin: '16px',
        padding: '16px 24px',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        position: 'sticky',
        top: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: 800
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              color: '#fff'
            }}>
              <Brain size={20} />
            </div>
            <span className="text-gradient">EduScore</span>
          </Link>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'all 0.2s'
            }} className="glass-panel-interactive">
              <LayoutDashboard size={16} />
              {user?.role === 'teacher' ? 'Dashboard' : 'My Portal'}
            </Link>

            {user?.role === 'student' && (
              <Link to="/predict" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                transition: 'all 0.2s'
              }} className="glass-panel-interactive">
                <PlusCircle size={16} />
                My Profile Form
              </Link>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Database Mode status */}
          {user?.isMockDB && (
            <div className="badge badge-medium" style={{ display: 'flex', gap: '6px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              <Database size={12} />
              Mock DB
            </div>
          )}
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Welcome ({user?.role === 'teacher' ? 'Teacher' : 'Student'}),
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user?.username}
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} style={{ color: '#fbbf24' }} /> : <Moon size={16} style={{ color: '#6366f1' }} />}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Log Out"
          >
            <LogOut size={16} style={{ color: 'var(--color-high)' }} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '0 16px 40px 16px' }}>
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/predict" element={
            <ProtectedRoute>
              <AppLayout>
                <Predictor />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/predict/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <Predictor />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/student/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <StudentReport />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
