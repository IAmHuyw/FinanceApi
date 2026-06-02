import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import StockListPage  from './pages/StockListPage'
import StockDetailPage from './pages/StockDetailPage'
import StockFormPage  from './pages/StockFormPage'
import PortfolioPage  from './pages/PortfolioPage'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="app-shell">{children}</main>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/stocks" element={
            <ProtectedRoute>
              <Layout><StockListPage /></Layout>
            </ProtectedRoute>
          }/>
          <Route path="/stocks/create" element={
            <ProtectedRoute>
              <Layout><StockFormPage /></Layout>
            </ProtectedRoute>
          }/>
          <Route path="/stocks/:id" element={
            <ProtectedRoute>
              <Layout><StockDetailPage /></Layout>
            </ProtectedRoute>
          }/>
          <Route path="/stocks/:id/edit" element={
            <ProtectedRoute>
              <Layout><StockFormPage /></Layout>
            </ProtectedRoute>
          }/>
          <Route path="/portfolio" element={
            <ProtectedRoute>
              <Layout><PortfolioPage /></Layout>
            </ProtectedRoute>
          }/>

          {/* Redirect root → stocks */}
          <Route path="/" element={<Navigate to="/stocks" replace />} />
          <Route path="*" element={<Navigate to="/stocks" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
