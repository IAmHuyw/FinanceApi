import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { registerApi } from '../services/authService'
import { getErrorMessages } from '../utils/errorMessages'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const showErrors = (payload) => {
    getErrorMessages(payload, 'Đăng ký thất bại').forEach((message) => toast.error(message))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.username.trim() || !form.email.trim() || !form.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error('Email không hợp lệ')
      return
    }

    setLoading(true)
    try {
      const res = await registerApi({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      loginUser(res.data)
      toast.success('Đăng ký thành công')
      navigate('/stocks')
    } catch (err) {
      showErrors(err.response?.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="card auth-card fade-in">
        <div className="auth-brand">
          <span className="brand-mark" aria-hidden="true">F</span>
          <h1 className="page-title">Tạo tài khoản</h1>
          <p className="page-subtitle">Backend sẽ trả JWT sau khi đăng ký thành công</p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span className="label">Tên đăng nhập</span>
            <input className="input" name="username" value={form.username} onChange={handleChange} autoComplete="username" autoFocus />
          </label>

          <label className="field">
            <span className="label">Email</span>
            <input className="input" type="email" name="email" placeholder="email@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
          </label>

          <label className="field">
            <span className="label">Mật khẩu</span>
            <input className="input" type="password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" />
            <span className="help-text">Thường cần chữ hoa, chữ thường, số và ký tự đặc biệt theo cấu hình Identity.</span>
          </label>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18, margin: 0 }} /> : 'Đăng ký'}
          </button>
        </form>

        <p className="help-text" style={{ marginTop: 18, textAlign: 'center' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: 'var(--accent-hover)' }}>Đăng nhập</Link>
        </p>
      </section>
    </div>
  )
}
