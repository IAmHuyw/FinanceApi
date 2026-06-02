import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { loginApi } from '../services/authService'
import { getErrorMessages } from '../utils/errorMessages'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.username.trim() || !form.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }

    setLoading(true)
    try {
      const res = await loginApi({
        username: form.username.trim(),
        password: form.password,
      })
      loginUser(res.data)
      toast.success(`Chào mừng, ${res.data.userName}!`)
      navigate('/stocks')
    } catch (err) {
      getErrorMessages(err.response?.data, 'Sai tài khoản hoặc mật khẩu').forEach((message) => toast.error(message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="card auth-card fade-in">
        <div className="auth-brand">
          <span className="brand-mark" aria-hidden="true">F</span>
          <h1 className="page-title">FinanceApp</h1>
          <p className="page-subtitle">Đăng nhập để quản lý cổ phiếu và danh mục đầu tư</p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span className="label">Tên đăng nhập</span>
            <input
              className="input"
              name="username"
              placeholder="ví dụ: huy"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
            />
          </label>

          <label className="field">
            <span className="label">Mật khẩu</span>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </label>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18, margin: 0 }} /> : 'Đăng nhập'}
          </button>
        </form>

        <p className="help-text" style={{ marginTop: 18, textAlign: 'center' }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--accent-hover)' }}>Đăng ký</Link>
        </p>
      </section>
    </div>
  )
}
