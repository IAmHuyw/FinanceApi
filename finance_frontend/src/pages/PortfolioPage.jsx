import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPortfolio, removeFromPortfolio } from '../services/portfolioService'
import { getErrorMessages } from '../utils/errorMessages'
import toast from 'react-hot-toast'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const formatCurrency = (value) => currency.format(Number(value || 0))
const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true

    const fetchPortfolio = async () => {
      setLoading(true)
      try {
        const res = await getPortfolio()
        if (alive) setPortfolio(res.data)
      } catch {
        toast.error('Không tải được danh mục')
      } finally {
        if (alive) setLoading(false)
      }
    }

    fetchPortfolio()
    return () => {
      alive = false
    }
  }, [])

  const handleRemove = async (symbol) => {
    if (!window.confirm(`Xóa ${symbol} khỏi danh mục?`)) return

    try {
      await removeFromPortfolio(symbol)
      setPortfolio((current) => current.filter((stock) => stock.symbol !== symbol))
      toast.success(`Đã xóa ${symbol}`)
    } catch (err) {
      getErrorMessages(err.response?.data, 'Xóa khỏi danh mục thất bại').forEach((message) => toast.error(message))
    }
  }

  const totalMarketCap = portfolio.reduce((sum, stock) => sum + Number(stock.marketCap || 0), 0)
  const averagePurchase = portfolio.length
    ? portfolio.reduce((sum, stock) => sum + Number(stock.purchase || 0), 0) / portfolio.length
    : 0

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Danh mục đầu tư</h1>
          <p className="page-subtitle">Danh mục cổ phiếu của người dùng đang đăng nhập.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/stocks')}>
          Thêm từ cổ phiếu
        </button>
      </header>

      <section className="metric-grid" style={{ marginBottom: 18 }}>
        <div className="metric">
          <p className="metric-label">Số cổ phiếu</p>
          <p className="metric-value mono">{portfolio.length}</p>
        </div>
        <div className="metric">
          <p className="metric-label">Giá mua trung bình</p>
          <p className="metric-value mono">{formatPrice(averagePurchase)}</p>
        </div>
        <div className="metric">
          <p className="metric-label">Tổng market cap</p>
          <p className="metric-value mono">{formatCurrency(totalMarketCap)}</p>
        </div>
      </section>

      <section className="card table-wrap">
        {loading ? (
          <div className="loading-state">
            <div>
              <div className="spinner" />
              <p className="help-text" style={{ marginTop: 12 }}>Đang tải danh mục...</p>
            </div>
          </div>
        ) : portfolio.length === 0 ? (
          <div className="empty-state">
            <div>
              <p>Danh mục đang trống.</p>
              <button className="btn btn-primary" onClick={() => navigate('/stocks')}>Chọn cổ phiếu</button>
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
              {portfolio.map((stock) => (
                <tr key={stock.id}>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>
                    <span className="mono badge badge-accent">{stock.symbol}</span>
                  </td>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>{stock.companyName}</td>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>
                    <span className="badge badge-blue">{stock.industry}</span>
                  </td>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>{formatPrice(stock.purchase)}</td>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>{formatPrice(stock.lastDiv)}</td>
                  <td onClick={() => navigate(`/stocks/${stock.id}`)}>{formatCurrency(stock.marketCap)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemove(stock.symbol)}>
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
    </div>
  )
}
