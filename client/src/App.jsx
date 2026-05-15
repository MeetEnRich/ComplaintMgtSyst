import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import LandingPage from './pages/LandingPage'
import SubmitPage from './pages/SubmitPage'
import ResultPage from './pages/ResultPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TrackPage from './pages/TrackPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/submit"  element={<SubmitPage />} />
        <Route path="/result"  element={<ResultPage />} />
        <Route path="/track"   element={<TrackPage />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App