import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
})

// Attach token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const loginAdmin = (credentials) => API.post('/auth/login', credentials)

// Complaints
export const submitComplaint = (data) => API.post('/complaints', data)
export const getAllComplaints = (params) => API.get('/complaints', { params })
export const getComplaintById = (id) => API.get(`/complaints/${id}`)
export const updateComplaintStatus = (id, status) => API.patch(`/complaints/${id}/status`, { status })
export const getDashboardStats = () => API.get('/complaints/stats')