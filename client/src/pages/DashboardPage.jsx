import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import Navbar from '../components/Navbar'
import { getDashboardStats, getAllComplaints, updateComplaintStatus } from '../services/api'

const COLORS = ['#e94560', '#1a1a2e', '#10b981', '#f59e0b', '#6366f1']

// ── Toast ──────────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => {
  if (!message) return null
  const bg = type === 'error' ? '#fff0f3' : '#ecfdf5'
  const color = type === 'error' ? '#e94560' : '#10b981'
  return (
    <div style={{ position: 'fixed', bottom: '28px', right: '28px', background: bg, color, border: `1px solid ${color}30`, borderRadius: '10px', padding: '14px 20px', fontSize: '13px', fontWeight: '600', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 999, maxWidth: '320px' }}>
      {message}
    </div>
  )
}

// ── Complaint Detail Modal ────────────────────────────────────────────────
const ComplaintModal = ({ complaint, onClose, onStatusUpdate, priorityColor, statusColor }) => {
  if (!complaint) return null
  return (
    <div style={m.overlay} onClick={onClose}>
      <div style={m.modal} onClick={e => e.stopPropagation()}>
        <div style={m.header}>
          <span style={m.headerTitle}>Complaint Details</span>
          <button style={m.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={m.textBox}>
          <div style={m.textLabel}>Complaint Text</div>
          <p style={m.textContent}>{complaint.complaint_text}</p>
        </div>

        <div style={m.grid}>
          {[
            { label: 'Complaint ID', value: complaint._id },
            { label: 'Category',     value: complaint.category },
            { label: 'Sentiment',    value: complaint.sentiment },
            { label: 'Submitted',    value: new Date(complaint.submittedAt).toLocaleString() },
            ...(complaint.resolvedAt ? [{ label: 'Resolved', value: new Date(complaint.resolvedAt).toLocaleString() }] : [])
          ].map((row, i) => (
            <div key={i} style={m.row}>
              <span style={m.rowLabel}>{row.label}</span>
              <span style={m.rowValue}>{row.value}</span>
            </div>
          ))}
          <div style={m.row}>
            <span style={m.rowLabel}>Priority</span>
            <span style={{ ...m.badge, background: priorityColor(complaint.priority) + '20', color: priorityColor(complaint.priority) }}>{complaint.priority}</span>
          </div>
          <div style={m.row}>
            <span style={m.rowLabel}>Status</span>
            <span style={{ ...m.badge, background: statusColor(complaint.status) + '20', color: statusColor(complaint.status) }}>{complaint.status}</span>
          </div>
        </div>

        <div style={m.footer}>
          <label style={m.selectLabel}>Update Status</label>
          <select
            style={m.select}
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

const m = {
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  modal:       { background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' },
  header:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f4f6f9' },
  headerTitle: { fontSize: '15px', fontWeight: '700', color: '#1a1a2e' },
  closeBtn:    { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: '4px' },
  textBox:     { padding: '20px 24px', borderBottom: '1px solid #f4f6f9' },
  textLabel:   { fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' },
  textContent: { fontSize: '14px', color: '#1a1a2e', lineHeight: '1.7', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  grid:        { padding: '8px 24px' },
  row:         { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f4f6f9' },
  rowLabel:    { fontSize: '13px', color: '#9ca3af', fontWeight: '500' },
  rowValue:    { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' },
  badge:       { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  footer:      { padding: '16px 24px', borderTop: '1px solid #f4f6f9', display: 'flex', alignItems: 'center', gap: '12px' },
  selectLabel: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', whiteSpace: 'nowrap' },
  select:      { flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', fontFamily: 'inherit' },
}

const Skeleton = ({ width = '100%', height = '16px', radius = '6px', style = {} }) => (
  <div style={{
    width, height, borderRadius: radius,
    background: 'linear-gradient(90deg, #e5e7eb 25%, #f4f6f9 50%, #e5e7eb 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
    ...style
  }} />
)

const DashboardSkeleton = () => (
  <>
    <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    <div style={s.statsGrid}>
      {Array(5).fill(0).map((_, i) => (
        <div key={i} style={s.statCard}>
          <Skeleton width="50%" height="36px" radius="8px" style={{ margin: '0 auto 10px' }} />
          <Skeleton width="70%" height="12px" style={{ margin: '0 auto' }} />
        </div>
      ))}
    </div>
    <div style={s.chartsRow}>
      {Array(2).fill(0).map((_, i) => (
        <div key={i} style={s.chartCard}>
          <Skeleton width="40%" height="16px" style={{ marginBottom: '20px' }} />
          <Skeleton width="100%" height="180px" radius="8px" />
        </div>
      ))}
    </div>
    <div style={s.tableWrap}>
      {Array(5).fill(0).map((_, i) => (
        <div key={i} style={{ padding: '16px', borderBottom: '1px solid #f4f6f9', display: 'flex', gap: '16px' }}>
          <Skeleton width="30%" />
          <Skeleton width="15%" />
          <Skeleton width="12%" />
          <Skeleton width="12%" />
          <Skeleton width="12%" />
        </div>
      ))}
    </div>
  </>
)

// ── Main component ─────────────────────────────────────────────────────────
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
      // refresh list and update modal if open
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

  const priorityColor = (p) => p === 'Urgent' ? '#e94560' : '#10b981'
  const statusColor   = (s) => s === 'Resolved' ? '#10b981' : s === 'In Progress' ? '#f59e0b' : '#9ca3af'

  // Normalise chart data from aggregation arrays
  const categoryData  = stats?.byCategory?.map(d => ({ name: d._id, value: d.count })) ?? []
  const sentimentData = stats?.bySentiment?.map(d => ({ name: d._id, value: d.count })) ?? []
  const priorityData  = stats?.byPriority?.map(d => ({ name: d._id, value: d.count })) ?? []

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9' }}>
      <Navbar isAdmin />
      <div style={s.container}>
        <h2 style={s.title}>Dashboard</h2>

        {networkError && (
          <div style={s.networkError}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {networkError}
            <button onClick={fetchData} style={s.retryBtn}>Retry</button>
          </div>
        )}

        {loading ? <DashboardSkeleton /> : (
          <>
            {/* Stats */}
            <div style={s.statsGrid}>
              {[
                { label: 'Total Complaints', value: stats?.total,      color: '#1a1a2e' },
                { label: 'Pending',          value: stats?.pending,    color: '#9ca3af' },
                { label: 'In Progress',      value: stats?.inProgress, color: '#f59e0b' },
                { label: 'Resolved',         value: stats?.resolved,   color: '#10b981' },
                { label: 'Urgent',           value: stats?.urgent,     color: '#e94560' },
              ].map((stat, i) => (
                <div key={i} style={s.statCard}>
                  <div style={{ ...s.statValue, color: stat.color }}>{stat.value ?? 0}</div>
                  <div style={s.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={s.chartsRow}>
              <div style={s.chartCard}>
                <div style={s.chartTitle}>Complaints by Category</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} angle={-25} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="value" fill="#1a1a2e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={s.chartCard}>
                <div style={s.chartTitle}>Sentiment & Priority Split</div>
                <div style={{ display: 'flex', gap: '8px', height: '200px' }}>
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: '11px' }}>
                        {sentimentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: '11px' }}>
                        {priorityData.map((_, i) => <Cell key={i} fill={i === 0 ? '#e94560' : '#10b981'} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div style={s.filters}>
              {[
                { key: 'status',   options: ['Pending', 'In Progress', 'Resolved'],                                                              label: 'Status'   },
                { key: 'priority', options: ['Urgent', 'Not Urgent'],                                                                            label: 'Priority' },
                { key: 'category', options: ['Credit Card', 'Credit Reporting', 'Debt Collection', 'Mortgages and Loans', 'Retail Banking'],     label: 'Category' },
              ].map(f => (
                <select
                  key={f.key}
                  style={s.select}
                  value={filters[f.key]}
                  onChange={e => { setFilters({ ...filters, [f.key]: e.target.value }); setPage(1) }}>
                  <option value="">All {f.label}s</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ))}
            </div>

            {/* Table */}
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr style={s.thead}>
                    {['Complaint', 'Category', 'Sentiment', 'Priority', 'Status', 'Submitted', 'Action'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No complaints found</td></tr>
                  ) : complaints.map(c => (
                    <tr key={c._id} style={{ ...s.tr, cursor: 'pointer' }} onClick={() => setSelectedComplaint(c)}>
                      <td style={{ ...s.td, maxWidth: '220px' }}>
                        <div style={s.complaintText}>{c.complaint_text}</div>
                      </td>
                      <td style={s.td}>{c.category}</td>
                      <td style={s.td}>{c.sentiment}</td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: priorityColor(c.priority) + '20', color: priorityColor(c.priority) }}>
                          {c.priority}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: statusColor(c.status) + '20', color: statusColor(c.status) }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={s.td}>{new Date(c.submittedAt).toLocaleDateString()}</td>
                      <td style={s.td} onClick={e => e.stopPropagation()}>
                        <select
                          style={s.actionSelect}
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
            <div style={s.pagination}>
              <button style={s.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
              <span style={s.pageInfo}>Page {page} — {total} total</span>
              <button style={s.pageBtn} onClick={() => setPage(p => p + 1)} disabled={page * 10 >= total}>Next</button>
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

const s = {
  container:     { maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' },
  title:         { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', marginBottom: '28px' },
  statsGrid:     { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '28px' },
  statCard:      { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' },
  statValue:     { fontSize: '32px', fontWeight: '800', marginBottom: '6px' },
  statLabel:     { fontSize: '12px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  chartsRow:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' },
  chartCard:     { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  chartTitle:    { fontSize: '13px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  filters:       { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  select:        { padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', background: '#fff', fontFamily: 'inherit' },
  tableWrap:     { background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' },
  table:         { width: '100%', borderCollapse: 'collapse' },
  thead:         { background: '#f4f6f9' },
  th:            { padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tr:            { borderBottom: '1px solid #f4f6f9' },
  td:            { padding: '14px 16px', fontSize: '13px', color: '#1a1a2e', verticalAlign: 'middle' },
  complaintText: { maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  badge:         { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  actionSelect:  { padding: '6px 10px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '12px', fontFamily: 'inherit' },
  pagination:    { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '24px' },
  pageBtn:       { background: '#1a1a2e', color: '#fff', padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
  pageInfo:      { fontSize: '13px', color: '#6b7280' },
  networkError:  { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff0f3', color: '#e94560', border: '1px solid #e9456020', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', fontWeight: '500', marginBottom: '24px' },
  retryBtn:      { marginLeft: 'auto', background: '#e94560', color: '#fff', padding: '5px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', border: 'none', cursor: 'pointer' },
}

export default DashboardPage
