import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import Navbar from '../components/Navbar'
import { getDashboardStats, getAllComplaints, updateComplaintStatus } from '../services/api'

const COLORS = ['#e94560', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6']

/* ── Toast ─────────────────────────────────────────────────────────── */
const Toast = ({ message, type }) => {
  if (!message) return null
  const isError = type === 'error'
  return (
    <div style={{
      position: 'fixed', bottom: '28px', right: '28px',
      background: isError ? 'var(--accent-soft)' : 'var(--green-soft)',
      color: isError ? 'var(--accent)' : 'var(--green)',
      border: `1px solid ${isError ? 'rgba(233,69,96,0.2)' : 'rgba(16,185,129,0.2)'}`,
      borderRadius: 'var(--radius-md)', padding: '14px 20px',
      fontSize: '13px', fontWeight: 600, boxShadow: 'var(--shadow-md)',
      zIndex: 999, maxWidth: '320px',
      animation: 'slideUp 0.3s ease',
    }}>
      {message}
    </div>
  )
}

/* ── Complaint Detail Modal ────────────────────────────────────────── */
const ComplaintModal = ({ complaint, onClose, onStatusUpdate, priorityColor, statusColor }) => {
  if (!complaint) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg-overlay)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div className="glass slide-up" style={{
        width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)',
      }} onClick={e => e.stopPropagation()}>
        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Complaint Details</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex', padding: '4px',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* complaint text */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px',
          }}>Complaint Text</div>
          <p style={{
            fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.7,
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>{complaint.complaint_text}</p>
        </div>

        {/* data rows */}
        <div style={{ padding: '8px 24px' }}>
          {[
            { label: 'Complaint ID', value: complaint._id },
            { label: 'Category',     value: complaint.category },
            { label: 'Sentiment',    value: complaint.sentiment },
            { label: 'Submitted',    value: new Date(complaint.submittedAt).toLocaleString() },
            ...(complaint.resolvedAt ? [{ label: 'Resolved', value: new Date(complaint.resolvedAt).toLocaleString() }] : [])
          ].map((row, i) => (
            <div key={i} className="data-row">
              <span className="data-label">{row.label}</span>
              <span className="data-value">{row.value}</span>
            </div>
          ))}
          <div className="data-row">
            <span className="data-label">Priority</span>
            <span className="badge" style={{
              background: priorityColor(complaint.priority) === 'var(--accent)' ? 'var(--accent-soft)' : 'var(--green-soft)',
              color: priorityColor(complaint.priority) === 'var(--accent)' ? 'var(--accent)' : 'var(--green)',
            }}>{complaint.priority}</span>
          </div>
          <div className="data-row">
            <span className="data-label">Status</span>
            <span className="badge" style={{
              background: complaint.status === 'Resolved' ? 'var(--green-soft)' : complaint.status === 'In Progress' ? 'var(--amber-soft)' : 'rgba(255,255,255,0.06)',
              color: statusColor(complaint.status),
            }}>{complaint.status}</span>
          </div>
        </div>

        {/* footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Update Status</label>
          <select className="input" style={{ flex: 1, padding: '9px 12px', fontSize: '13px' }}
            value={complaint.status}
            onChange={e => onStatusUpdate(complaint._id, e.target.value)}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>
    </div>
  )
}

/* ── Skeleton ──────────────────────────────────────────────────────── */
const Skeleton = ({ width = '100%', height = '16px', radius = '6px', style = {} }) => (
  <div style={{
    width, height, borderRadius: radius,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
    backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', ...style,
  }} />
)

const DashboardSkeleton = () => (
  <>
    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '28px' }}>
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <Skeleton width="50%" height="36px" radius="8px" style={{ margin: '0 auto 10px' }} />
          <Skeleton width="70%" height="12px" style={{ margin: '0 auto' }} />
        </div>
      ))}
    </div>
    <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
      {Array(2).fill(0).map((_, i) => (
        <div key={i} className="card" style={{ padding: '24px' }}>
          <Skeleton width="40%" height="16px" style={{ marginBottom: '20px' }} />
          <Skeleton width="100%" height="180px" radius="8px" />
        </div>
      ))}
    </div>
  </>
)

/* ── Chart theme ───────────────────────────────────────────────────── */
const tooltipStyle = {
  fontSize: '12px', borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(15,15,26,0.95)', color: '#f0f0f5',
}

/* ── Main ──────────────────────────────────────────────────────────── */
const DashboardPage = () => {
  const navigate = useNavigate()
  const [stats, setStats]           = useState(null)
  const [complaints, setComplaints] = useState([])
  const [total, setTotal]           = useState(0)
  const [page, setPage]             = useState(1)
  const [filters, setFilters]       = useState({ status: '', priority: '', category: '' })
  const [loading, setLoading]       = useState(true)
  const [networkError, setNetworkError] = useState('')
  const [toast, setToast]           = useState({ message: '', type: 'success' })
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000)
  }

  const fetchData = async () => {
    setNetworkError('')
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        getDashboardStats(),
        getAllComplaints({ ...filters, page, limit: 10 })
      ])
      setStats(statsRes.data.data)
      setComplaints(complaintsRes.data.data)
      setTotal(complaintsRes.data.total)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('admin_token')
        navigate('/login')
      } else if (err.code === 'ERR_NETWORK') {
        setNetworkError('Cannot reach the server. Please check your connection.')
      } else {
        setNetworkError('Failed to load dashboard data. Please refresh.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [page, filters])

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateComplaintStatus(id, status)
      showToast(`Status updated to "${status}"`)
      const [statsRes, complaintsRes] = await Promise.all([
        getDashboardStats(),
        getAllComplaints({ ...filters, page, limit: 10 })
      ])
      setStats(statsRes.data.data)
      setComplaints(complaintsRes.data.data)
      setTotal(complaintsRes.data.total)
      if (selectedComplaint?._id === id) {
        setSelectedComplaint(prev => ({ ...prev, status, resolvedAt: status === 'Resolved' ? new Date().toISOString() : prev.resolvedAt }))
      }
    } catch {
      showToast('Failed to update status. Please try again.', 'error')
    }
  }

  const priorityColor = (p) => p === 'Urgent' ? 'var(--accent)' : 'var(--green)'
  const statusColor   = (s) => s === 'Resolved' ? 'var(--green)' : s === 'In Progress' ? 'var(--amber)' : 'var(--text-muted)'

  const categoryData  = stats?.byCategory?.map(d => ({ name: d._id, value: d.count })) ?? []
  const sentimentData = stats?.bySentiment?.map(d => ({ name: d._id, value: d.count })) ?? []
  const priorityData  = stats?.byPriority?.map(d => ({ name: d._id, value: d.count })) ?? []

  return (
    <div className="page">
      <Navbar isAdmin />
      <div className="container fade-in">
        <h2 className="section-title" style={{ marginBottom: '28px' }}>Dashboard</h2>

        {networkError && (
          <div className="error-msg" style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {networkError}
            <button className="btn btn-primary btn-sm" onClick={fetchData} style={{ marginLeft: 'auto', padding: '5px 14px', fontSize: '12px' }}>Retry</button>
          </div>
        )}

        {loading ? <DashboardSkeleton /> : (
          <>
            {/* Stats */}
            <div className="stagger stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Total Complaints', value: stats?.total,      color: 'var(--text-primary)' },
                { label: 'Pending',          value: stats?.pending,    color: 'var(--text-muted)' },
                { label: 'In Progress',      value: stats?.inProgress, color: 'var(--amber)' },
                { label: 'Resolved',         value: stats?.resolved,   color: 'var(--green)' },
                { label: 'Urgent',           value: stats?.urgent,     color: 'var(--accent)' },
              ].map((stat, i) => (
                <div key={i} className="card slide-up" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: stat.color, marginBottom: '6px' }}>{stat.value ?? 0}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Complaints by Category</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8b8fa3' }} angle={-25} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: '#8b8fa3' }} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sentiment &amp; Priority Split</div>
                <div style={{ display: 'flex', gap: '8px', height: '200px' }}>
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false} style={{ fontSize: '11px' }}>
                        {sentimentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', color: '#8b8fa3' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false} style={{ fontSize: '11px' }}>
                        {priorityData.map((_, i) => <Cell key={i} fill={i === 0 ? '#e94560' : '#10b981'} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', color: '#8b8fa3' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {[
                { key: 'status',   options: ['Pending', 'In Progress', 'Resolved'],                                                          label: 'Status'   },
                { key: 'priority', options: ['Urgent', 'Not Urgent'],                                                                        label: 'Priority' },
                { key: 'category', options: ['Credit Card', 'Credit Reporting', 'Debt Collection', 'Mortgages and Loans', 'Retail Banking'], label: 'Category' },
              ].map(f => (
                <select key={f.key} className="input" style={{ width: 'auto', minWidth: '140px', padding: '10px 36px 10px 14px', fontSize: '13px' }}
                  value={filters[f.key]}
                  onChange={e => { setFilters({ ...filters, [f.key]: e.target.value }); setPage(1) }}>
                  <option value="">All {f.label}s</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ))}
            </div>

            {/* Table */}
            <div className="card table-responsive" style={{ overflow: 'hidden', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)' }}>
                    {['Complaint', 'Category', 'Sentiment', 'Priority', 'Status', 'Submitted', 'Action'].map(h => (
                      <th key={h} style={{
                        padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700,
                        color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '48px', height: '48px', color: 'var(--text-secondary)', opacity: 0.5 }}>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                          </svg>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>No complaints found</span>
                          <span style={{ fontSize: '13px' }}>Try adjusting or clearing your filters.</span>
                          {(filters.status || filters.priority || filters.category) && (
                            <button className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }} onClick={() => { setFilters({ status: '', priority: '', category: '' }); setPage(1) }}>
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : complaints.map(c => (
                    <tr key={c._id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.15s' }}
                      onClick={() => setSelectedComplaint(c)}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-primary)', verticalAlign: 'middle', maxWidth: '220px' }}>
                        <div style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.complaint_text}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{c.category}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{c.sentiment}</td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <span className={`badge ${c.priority === 'Urgent' ? 'badge-accent' : 'badge-green'}`}>{c.priority}</span>
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <span className={`badge ${c.status === 'Resolved' ? 'badge-green' : c.status === 'In Progress' ? 'badge-amber' : 'badge-muted'}`}>{c.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{new Date(c.submittedAt).toLocaleDateString()}</td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }} onClick={e => e.stopPropagation()}>
                        <select className="input" style={{ width: 'auto', padding: '6px 30px 6px 10px', fontSize: '12px' }}
                          value={c.status}
                          onChange={e => handleStatusUpdate(c._id, e.target.value)}>
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Showing {total === 0 ? 0 : (page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p + 1)} disabled={page * 10 >= total}>Next</button>
            </div>
          </>
        )}
      </div>
      <Toast message={toast.message} type={toast.type} />
      <ComplaintModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onStatusUpdate={handleStatusUpdate}
        priorityColor={priorityColor}
        statusColor={statusColor}
      />
    </div>
  )
}

export default DashboardPage
