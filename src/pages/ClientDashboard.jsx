import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './ClientDashboard.css'

const ClientDashboard = () => {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const fetchProjects = async () => {
    try {
      setLoading(true)

      const response = await api.get('/projects/my-projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProjects(response.data.projects || [])
      setError('')
    } catch (err) {
      console.error(err.response?.data || err.message)
      setError(
        err.response?.data?.message || 'Unable to load projects',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const openProject = id => {
    navigate(`/client/project/${id}`)
  }

  const pending = projects.filter(
    project => project.status === 'Pending',
  ).length

  const inProgress = projects.filter(
    project => project.status === 'In Progress',
  ).length

  const completed = projects.filter(
    project => project.status === 'Completed',
  ).length

  const getProgress = status => {
    if (status === 'Completed') return 100
    if (status === 'In Progress') return 50
    return 0
  }

  const formatBudget = amount =>
    Number(amount || 0).toLocaleString('en-IN')

  return (
    <div className="client-layout">
      <aside className="client-sidebar">
        <div className="client-brand">
          <div className="client-brand-icon">F</div>
          <div>
            <h2>
              Freelance<span>Flow</span>
            </h2>
            <p>Client Portal</p>
          </div>
        </div>

        <p className="client-nav-label">WORKSPACE</p>

        <nav className="client-nav">
          <a href="#client-overview" className="client-nav-item active">
            <span>▦</span> Overview
          </a>

          <a href="#my-projects" className="client-nav-item">
            <span>▤</span> My Projects
          </a>
        </nav>

        <div className="client-sidebar-bottom">
          <div className="client-profile">
            <div className="client-avatar">C</div>
            <div>
              <h4>Client</h4>
              <p>Workspace Member</p>
            </div>
          </div>

          <button
            className="client-logout"
            onClick={handleLogout}
            type="button"
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="client-main">
        <header className="client-topbar">
          <div>
            <p className="client-breadcrumb">
              Workspace / Dashboard
            </p>
            <h1>My Dashboard</h1>
          </div>

          <div className="client-topbar-right">
            <span>Project Management</span>
            <div className="client-top-avatar">C</div>
          </div>
        </header>

        <div className="client-content">
          <section id="client-overview">
            <div className="client-welcome">
              <div>
                <p className="client-welcome-tag">
                  CLIENT WORKSPACE
                </p>
                <h2>Welcome back! 👋</h2>
                <p>
                  Track your projects and stay updated on their progress.
                </p>
              </div>

              <div className="client-welcome-symbol">✦</div>
            </div>

            <div className="client-section-heading">
              <div>
                <h2>Project Overview</h2>
                <p>
                  Here is the current status of your projects.
                </p>
              </div>

              <button
                className="client-refresh"
                type="button"
                onClick={fetchProjects}
              >
                ↻ Refresh
              </button>
            </div>

            <div className="client-stats">
              <div className="client-stat-card stat-total">
                <div className="client-stat-top">
                  <span>Total Projects</span>
                  <span className="client-stat-icon">▤</span>
                </div>
                <h3>{projects.length}</h3>
                <p>All assigned projects</p>
              </div>

              <div className="client-stat-card stat-pending">
                <div className="client-stat-top">
                  <span>Pending</span>
                  <span className="client-stat-icon">◷</span>
                </div>
                <h3>{pending}</h3>
                <p>Waiting to start</p>
              </div>

              <div className="client-stat-card stat-active">
                <div className="client-stat-top">
                  <span>In Progress</span>
                  <span className="client-stat-icon">◈</span>
                </div>
                <h3>{inProgress}</h3>
                <p>Currently in progress</p>
              </div>

              <div className="client-stat-card stat-done">
                <div className="client-stat-top">
                  <span>Completed</span>
                  <span className="client-stat-icon">✓</span>
                </div>
                <h3>{completed}</h3>
                <p>Successfully completed</p>
              </div>
            </div>
          </section>

          <section
            id="my-projects"
            className="client-projects-section"
          >
            <div className="client-section-heading">
              <div>
                <h2>My Projects</h2>
                <p>
                  View your assigned projects and their progress.
                </p>
              </div>

              <span className="client-project-count">
                {projects.length} Projects
              </span>
            </div>

            {loading ? (
              <div className="client-empty">
                <p>Loading your projects...</p>
              </div>
            ) : error ? (
              <div className="client-empty client-error">
                <h3>Unable to load projects</h3>
                <p>{error}</p>
                <button type="button" onClick={fetchProjects}>
                  Try Again
                </button>
              </div>
            ) : projects.length === 0 ? (
              <div className="client-empty">
                <div className="client-empty-icon">▤</div>
                <h3>No projects assigned yet</h3>
                <p>
                  Your projects will appear here when the admin assigns them.
                </p>
              </div>
            ) : (
              <div className="client-project-grid">
                {projects.map(project => {
                  const progress = getProgress(project.status)

                  return (
                    <article
                      className="client-project-card"
                      key={project._id}
                      onClick={() => openProject(project._id)}
                      onKeyDown={event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          openProject(project._id)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="client-project-top">
                        <div className="client-project-icon">▤</div>

                        <span
                          className={`client-status ${
                            project.status === 'Completed'
                              ? 'client-status-done'
                              : project.status === 'In Progress'
                                ? 'client-status-active'
                                : 'client-status-pending'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <h3>{project.title}</h3>

                      <p className="client-project-description">
                        {project.description}
                      </p>

                      <div className="client-progress-heading">
                        <span>Project Progress</span>
                        <strong>{progress}%</strong>
                      </div>

                      <div
                        className="client-progress-track"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`client-progress-fill ${
                            progress === 100 ? 'progress-complete' : ''
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="client-project-budget">
                        <span>Project Budget</span>
                        <strong>
                          ₹{formatBudget(project.budget)}
                        </strong>
                      </div>

                      <p className="client-view-details">
                        View Details →
                      </p>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default ClientDashboard