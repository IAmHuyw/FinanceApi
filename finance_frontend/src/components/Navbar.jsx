import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    toast.success('Đã đăng xuất')
    navigate('/login')
  }

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <nav className="navbar">
      <Link to="/stocks" className="nav-brand">
        <span className="brand-mark" aria-hidden="true">F</span>
        <span>FinanceApp</span>
      </Link>

      {user && (
        <div className="nav-links">
          <Link className={`nav-link ${isActive('/stocks') ? 'active' : ''}`} to="/stocks">
            Cổ phiếu
          </Link>
          <Link className={`nav-link ${isActive('/portfolio') ? 'active' : ''}`} to="/portfolio">
            Danh mục
          </Link>
        </div>
      )}

      <div className="nav-user">
        {user ? (
          <>
            <span className="user-pill">
              Người dùng <strong>{user.username}</strong>
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-ghost btn-sm" to="/login">Đăng nhập</Link>
            <Link className="btn btn-primary btn-sm" to="/register">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  )
}
