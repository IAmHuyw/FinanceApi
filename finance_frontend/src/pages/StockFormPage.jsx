import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createStock, getStockById, updateStock } from '../services/stockService'
import { getErrorMessages } from '../utils/errorMessages'
import toast from 'react-hot-toast'

const INITIAL = {
  symbol: '',
  companyName: '',
  purchase: '',
  lastDiv: '',
  industry: '',
  marketCap: '',
}

const fields = [
  { name: 'symbol', label: 'Symbol', placeholder: 'AAPL', type: 'text' },
  { name: 'companyName', label: 'Tên công ty', placeholder: 'Apple Inc.', type: 'text', full: true },
  { name: 'industry', label: 'Ngành', placeholder: 'Technology', type: 'text' },
  { name: 'purchase', label: 'Giá mua', placeholder: '150.00', type: 'number' },
  { name: 'lastDiv', label: 'Cổ tức gần nhất', placeholder: '0.96', type: 'number' },
  { name: 'marketCap', label: 'Market cap', placeholder: '2500000000000', type: 'number' },
]

export default function StockFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return

    getStockById(id)
      .then((res) => {
        const stock = res.data
        setForm({
          symbol: stock.symbol || '',
          companyName: stock.companyName || '',
          purchase: stock.purchase ?? '',
          lastDiv: stock.lastDiv ?? '',
          industry: stock.industry || '',
          marketCap: stock.marketCap ?? '',
        })
      })
      .catch(() => {
        toast.error('Không tải được cổ phiếu')
        navigate('/stocks')
      })
      .finally(() => setFetching(false))
  }, [id, isEdit, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const buildPayload = () => {
    const purchase = Number(form.purchase)
    const lastDiv = Number(form.lastDiv)
    const marketCap = Number(form.marketCap)

    if (
      !form.symbol.trim() ||
      !form.companyName.trim() ||
      !form.industry.trim() ||
      form.purchase === '' ||
      form.lastDiv === '' ||
      form.marketCap === ''
    ) {
      throw new Error('Vui lòng nhập đầy đủ thông tin cổ phiếu')
    }

    if (!Number.isFinite(purchase) || !Number.isFinite(lastDiv) || !Number.isFinite(marketCap)) {
      throw new Error('Giá mua, cổ tức và market cap phải là số')
    }

    return {
      symbol: form.symbol.trim().toUpperCase(),
      companyName: form.companyName.trim(),
      industry: form.industry.trim(),
      purchase,
      lastDiv,
      marketCap: Math.trunc(marketCap),
    }
  }

  const showErrors = (payload) => {
    getErrorMessages(payload, 'Có lỗi xảy ra').forEach((message) => toast.error(message))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let payload
    try {
      payload = buildPayload()
    } catch (err) {
      toast.error(err.message)
      return
    }

    setLoading(true)
    try {
      if (isEdit) {
        await updateStock(id, payload)
        toast.success('Đã cập nhật cổ phiếu')
        navigate(`/stocks/${id}`)
      } else {
        const res = await createStock(payload)
        toast.success('Đã thêm cổ phiếu mới')
        navigate(`/stocks/${res.data.id || ''}`.replace(/\/$/, ''))
      }
    } catch (err) {
      showErrors(err.response?.data)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="page page-narrow">
        <div className="loading-state">
          <div className="spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Sửa cổ phiếu' : 'Thêm cổ phiếu'}</h1>
          <p className="page-subtitle">
            {isEdit ? `Đang sửa cổ phiếu ID ${id}.` : 'Tạo cổ phiếu mới theo schema backend.'}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>Quay lại</button>
      </header>

      <section className="card panel fade-in">
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          {fields.map((field) => (
            <label className={`field ${field.full ? 'field-full' : ''}`} key={field.name}>
              <span className="label">{field.label}</span>
              <input
                className="input"
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                step={field.type === 'number' ? 'any' : undefined}
                required
              />
            </label>
          ))}

          <div className="field-full" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
            <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>
              Hủy
            </button>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, margin: 0 }} /> : isEdit ? 'Cập nhật' : 'Tạo cổ phiếu'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
