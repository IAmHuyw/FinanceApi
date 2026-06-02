import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addToPortfolio } from '../services/portfolioService'
import { deleteStock, getAllStocks } from '../services/stockService'
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

export default function StockListPage() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState({
    symbol: '',
    companyName: '',
    sortBy: '',
    isDescending: false,
    pageNumber: 1,
    pageSize: 10,
  })
  const navigate = useNavigate()

  const fetchStocks = useCallback(async () => {
    setLoading(true)
    try {
      const requestParams = {
        ...params,
        symbol: params.symbol.trim() || undefined,
        companyName: params.companyName.trim() || undefined,
        sortBy: params.sortBy || undefined,
      }
      const res = await getAllStocks(requestParams)
      setStocks(res.data)
    } catch {
      toast.error('Không tải được danh sách cổ phiếu')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])

  const setParam = (key, value) => {
    setParams((current) => ({ ...current, [key]: value, pageNumber: 1 }))
  }

  const handleDelete = async (id, symbol) => {
    if (!window.confirm(`Xóa ${symbol}?`)) return

    try {
      await deleteStock(id)
      toast.success(`Đã xóa ${symbol}`)
      fetchStocks()
    } catch {
      toast.error('Xóa cổ phiếu thất bại')
    }
  }

  const handleAddPortfolio = async (symbol) => {
    try {
      await addToPortfolio(symbol)
      toast.success(`Đã thêm ${symbol} vào danh mục`)
    } catch (err) {
      getErrorMessages(err.response?.data, 'Không thể thêm vào danh mục').forEach((message) => toast.error(message))
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Cổ phiếu</h1>
          <p className="page-subtitle">Tìm kiếm, sắp xếp và quản lý danh sách cổ phiếu trong backend.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/stocks/create')}>
          Thêm cổ phiếu
        </button>
      </header>

      <section className="card panel toolbar" aria-label="Bộ lọc cổ phiếu">
        <label className="field">
          <span className="label">Symbol</span>
          <input
            className="input"
            placeholder="AAPL"
            value={params.symbol}
            onChange={(e) => setParam('symbol', e.target.value)}
          />
        </label>

        <label className="field">
          <span className="label">Công ty</span>
          <input
            className="input"
            placeholder="Apple, Microsoft..."
            value={params.companyName}
            onChange={(e) => setParam('companyName', e.target.value)}
          />
        </label>

        <label className="field">
          <span className="label">Sắp xếp theo</span>
          <select className="input" value={params.sortBy} onChange={(e) => setParam('sortBy', e.target.value)}>
            <option value="">Mặc định</option>
            <option value="Symbol">Symbol</option>
            <option value="LastDiv">Cổ tức gần nhất</option>
          </select>
        </label>

        <label className="field" style={{ minHeight: 42, alignContent: 'center' }}>
          <span className="label">Thứ tự</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
            <input
              type="checkbox"
              checked={params.isDescending}
              onChange={(e) => setParam('isDescending', e.target.checked)}
            />
            Giảm dần
          </span>
        </label>
      </section>

      <section className="card table-wrap">
        {loading ? (
          <div className="loading-state">
            <div>
              <div className="spinner" />
              <p className="help-text" style={{ marginTop: 12 }}>Đang tải cổ phiếu...</p>
            </div>
          </div>
        ) : stocks.length === 0 ? (
          <div className="empty-state">
            <div>
              <p>Không tìm thấy cổ phiếu nào.</p>
              <button className="btn btn-primary" onClick={() => navigate('/stocks/create')}>Thêm cổ phiếu đầu tiên</button>
            </div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Công ty</th>
                <th>Ngành</th>
                <th>Giá mua</th>
                <th>Cổ tức</th>
                <th>Market Cap</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.id}>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>
                    <span className="mono badge badge-accent">{stock.symbol}</span>
                  </td>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>{stock.companyName}</td>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>
                    <span className="badge badge-blue">{stock.industry}</span>
                  </td>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>{formatPrice(stock.purchase)}</td>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>{formatPrice(stock.lastDiv, 3)}</td>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>{formatCurrency(stock.marketCap)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => handleAddPortfolio(stock.symbol)}>
                        Thêm vào danh mục
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/stocks/${stock.id}/edit`)}>
                        Sửa
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(stock.id, stock.symbol)}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <nav className="pagination" aria-label="Phân trang">
        <button
          className="btn btn-ghost"
          disabled={params.pageNumber === 1}
          onClick={() => setParams((current) => ({ ...current, pageNumber: current.pageNumber - 1 }))}
        >
          Trước
        </button>
        <span className="mono help-text">Trang {params.pageNumber}</span>
        <button
          className="btn btn-ghost"
          disabled={stocks.length < params.pageSize}
          onClick={() => setParams((current) => ({ ...current, pageNumber: current.pageNumber + 1 }))}
        >
          Sau
        </button>
      </nav>
    </div>
  )
}
