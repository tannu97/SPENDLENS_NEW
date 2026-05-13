import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import LandingPage from './pages/LandingPage'
import AuditPage from './pages/AuditPage'
import ResultsPage from './pages/ResultsPage'
import SharePage from './pages/SharePage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/results/:auditId" element={<ResultsPage />} />
        <Route path="/share/:auditId" element={<SharePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
