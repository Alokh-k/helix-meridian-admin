import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from '@/lib/auth'
import { ProtectedRoute, PublicRoute } from '@/components/auth/Guards'

// Pages
import LandingPage from '@/pages/Landing'
import LoginPage from '@/pages/auth/Login'
import RegisterPage from '@/pages/auth/Register'
import AdminLayout from '@/components/admin/AdminLayout'
import Dashboard from '@/pages/admin/Dashboard'
import PricingPage from '@/pages/admin/Pricing'
import HRManagement from '@/pages/admin/HRManagement'
import Settings from '@/pages/admin/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1929',
              color: '#e8f4ff',
              border: '1px solid #1a2d4a',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#00ff88', secondary: '#020408' } },
            error: { iconTheme: { primary: '#ff6b35', secondary: '#020408' } },
          }}
        />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/auth/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            {/* Admin (protected) */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="hrs" element={<HRManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </BrowserRouter>
  )
}
