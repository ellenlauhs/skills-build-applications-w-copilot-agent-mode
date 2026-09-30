import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

function Dashboard() {
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/health', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('API request failed')
        return response.json()
      })
      .then(({ status, database }) => {
        setApiStatus(status === 'ok' && database === 'connected' ? 'online' : 'offline')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setApiStatus('offline')
      })

    return () => controller.abort()
  }, [])

  const statusLabel = {
    checking: 'Checking connection',
    online: 'All systems operational',
    offline: 'API unavailable',
  }[apiStatus]

  return (
    <main className="container-fluid dashboard">
      <div className="row align-items-end g-4 dashboard-heading">
        <div className="col-lg-8">
          <p className="eyebrow">YOUR TRAINING SPACE</p>
          <h1>Movement, <span>measured.</span></h1>
          <p className="lead-copy">A clearer view of your activity starts here.</p>
        </div>
        <div className="col-lg-4">
          <div className={`service-status status-${apiStatus}`} role="status">
            <span className="status-dot" aria-hidden="true" />
            <span>{statusLabel}</span>
            <small>API · MongoDB</small>
          </div>
        </div>
      </div>

      <section className="workspace-links" aria-label="Tracker sections">
        <NavLink className="workspace-link" to="/activity">
          <span className="section-number">01</span>
          <span><strong>Activity</strong><small>Track the work you put in</small></span>
          <span className="link-arrow" aria-hidden="true">↗</span>
        </NavLink>
        <NavLink className="workspace-link" to="/teams">
          <span className="section-number">02</span>
          <span><strong>Teams</strong><small>Find your people and compete</small></span>
          <span className="link-arrow" aria-hidden="true">↗</span>
        </NavLink>
      </section>
    </main>
  )
}

function SectionPage({ title, description }) {
  return (
    <main className="container-fluid dashboard section-page">
      <p className="eyebrow">OCTOFIT TRACKER</p>
      <h1>{title}</h1>
      <p className="lead-copy">{description}</p>
      <Link className="back-link" to="/">Back to overview</Link>
    </main>
  )
}

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/" aria-label="OctoFit Tracker home">
          <img src="/octofitapp-small.png" alt="" />
          <span>OctoFit <strong>Tracker</strong></span>
        </Link>
        <nav className="primary-nav" aria-label="Main navigation">
          <NavLink to="/" end>Overview</NavLink>
          <NavLink to="/activity">Activity</NavLink>
          <NavLink to="/teams">Teams</NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/activity" element={<SectionPage title="Activity" description="Your movement history will live here." />} />
        <Route path="/teams" element={<SectionPage title="Teams" description="Your team space is ready to take shape." />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="app-footer">OCTOFIT TRACKER <span>·</span> BUILD YOUR MOMENTUM</footer>
    </div>
  )
}

export default App
