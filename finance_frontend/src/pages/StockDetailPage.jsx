import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createComment, deleteComment, getAllComments } from '../services/commentService'
import { getStockById } from '../services/stockService'
import { getErrorMessages } from '../utils/errorMessages'
import toast from 'react-hot-toast'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const formatCurrency = (value) => currency.format(Number(value || 0))
const formatPrice = (value, digits = 2) => `$${Number(value || 0).toFixed(digits)}`
const formatDate = (value) => {
  if (!value) return 'Không có ngày'
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value))
}

export default function StockDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [stock, setStock] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [form, setForm] = useState({ title: '', content: '' })

  useEffect(() => {
    let alive = true

    const fetchData = async () => {
      setLoading(true)
      try {
        const [stockRes, commentRes] = await Promise.all([
          getStockById(id),
          getAllComments(),
        ])

        if (!alive) return
        setStock(stockRes.data)
        setComments(commentRes.data.filter((comment) => Number(comment.stockId) === Number(id)))
      } catch {
        toast.error('Không tải được dữ liệu cổ phiếu')
        navigate('/stocks')
      } finally {
        if (alive) setLoading(false)
      }
    }

    fetchData()
    return () => {
      alive = false
    }
  }, [id, navigate])

  const handlePostComment = async (e) => {
    e.preventDefault()

    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Nhập tiêu đề và nội dung bình luận')
      return
    }

    setPosting(true)
    try {
      const res = await createComment(id, {
        title: form.title.trim(),
        content: form.content.trim(),
      })
      setComments((current) => [res.data, ...current])
      setForm({ title: '', content: '' })
      toast.success('Đã thêm bình luận')
    } catch (err) {
      getErrorMessages(err.response?.data, 'Thêm bình luận thất bại').forEach((message) => toast.error(message))
    } finally {
      setPosting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Xóa bình luận này?')) return

    try {
      await deleteComment(commentId)
      setComments((current) => current.filter((comment) => comment.id !== commentId))
      toast.success('Đã xóa bình luận')
    } catch {
      toast.error('Xóa bình luận thất bại')
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div>
            <div className="spinner" />
            <p className="help-text" style={{ marginTop: 12 }}>Đang tải cổ phiếu...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stock) return null

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <div>
          <h1 className="page-title mono">{stock.symbol}</h1>
          <p className="page-subtitle">{stock.companyName}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/stocks')}>Danh sách</button>
          <button className="btn btn-primary" onClick={() => navigate(`/stocks/${id}/edit`)}>Sửa</button>
        </div>
      </header>

      <section className="card panel fade-in" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
          <span className="badge badge-blue">{stock.industry}</span>
          <span className="help-text">ID cổ phiếu {stock.id}</span>
        </div>

        <div className="metric-grid">
          <div className="metric">
            <p className="metric-label">Giá mua</p>
            <p className="metric-value mono">{formatPrice(stock.purchase)}</p>
          </div>
          <div className="metric">
            <p className="metric-label">Cổ tức gần nhất</p>
            <p className="metric-value mono">{formatPrice(stock.lastDiv, 3)}</p>
          </div>
          <div className="metric">
            <p className="metric-label">Market cap</p>
            <p className="metric-value mono">{formatCurrency(stock.marketCap)}</p>
          </div>
        </div>
      </section>

      <section className="card panel fade-in">
        <header className="page-header" style={{ marginBottom: 16 }}>
          <div>
            <h2 className="page-title" style={{ fontSize: '1.1rem' }}>Bình luận</h2>
            <p className="page-subtitle">{comments.length} bình luận cho cổ phiếu này</p>
          </div>
        </header>

        <form className="form-stack" onSubmit={handlePostComment} style={{ marginBottom: 18 }} noValidate>
          <label className="field">
            <span className="label">Tiêu đề</span>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Nhận định ngắn"
            />
          </label>
          <label className="field">
            <span className="label">Nội dung</span>
            <textarea
              className="input"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Ghi chú phân tích..."
            />
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" type="submit" disabled={posting}>
              {posting ? <span className="spinner" style={{ width: 18, height: 18, margin: 0 }} /> : 'Gửi bình luận'}
            </button>
          </div>
        </form>

        {comments.length === 0 ? (
          <div className="empty-state" style={{ minHeight: 140 }}>
            Chưa có bình luận nào.
          </div>
        ) : (
          <div className="comment-list">
            {comments.map((comment) => (
              <article className="comment" key={comment.id}>
                <div className="comment-head">
                  <div>
                    <h3 className="comment-title">{comment.title}</h3>
                    <p className="comment-meta">
                      {comment.createdBy || 'Ẩn danh'} - {formatDate(comment.createdOn)}
                    </p>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment.id)}>
                    Xóa
                  </button>
                </div>
                <p className="comment-content">{comment.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
