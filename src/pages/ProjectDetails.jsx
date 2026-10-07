
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import Cookies from 'js-cookie'

import api from '../services/api'
import './ProjectDetails.css'

const ProjectDetails = () => {
  const {id} = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = Cookies.get('jwt_token')

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const loadProjectDetails = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get(
        '/projects/my-projects',
        authConfig,
      )

      const projects = response.data.projects || []

      const selectedProject = projects.find(
        eachProject => eachProject._id === id,
      )

      if (!selectedProject) {
        setProject(null)
        setError('Project not found')
        return
      }

      setProject(selectedProject)

      const updatesResponse = await api.get(
        `/project-updates/${id}`,
        authConfig,
      )

      setUpdates(updatesResponse.data.updates || [])
    } catch (err) {
      console.error(err.response?.data || err.message)
      setError(
        err.response?.data?.message ||
          'Failed to load project details',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjectDetails()
  }, [id])

  const handleLogout = () => {
    Cookies.remove('jwt_token')
    Cookies.remove('role')
    navigate('/login')
  }

  const getStatusClass = status => {
    if (status === 'Completed') return 'completed'
    if (status === 'In Progress') return 'in-progress'
    return 'pending'
  }

  const getStatusProgress = status => {
    if (status === 'Completed') return 100
    if (status === 'In Progress') return 50
    return 0
  }

  const latestProgress =
    updates.length > 0
      ? Math.min(
          100,
          Math.max(0, Number(updates[0].progress) || 0),
        )
      : getStatusProgress(project?.status)

  const formatDate = date => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = date => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="project-details-page">
        <div className="details-loading">
          <div className="loading-spinner"></div>
          <h2>Loading Project...</h2>
          <p>Please wait while we fetch your project details.</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="project-details-page">
        <div className="details-error">
          <div className="error-icon">!</div>
          <h2>{error || 'Project not found'}</h2>
          <p>We could not load this project.</p>
          <button
            type="button"
            onClick={() => navigate('/client/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="project-details-page">
      {/* Header */}
      <header className="project-details-header">
        <div className="details-brand">
          <div className="details-brand-icon">F</div>
          <div>
            <h1>
              Freelance<span>Flow</span>
            </h1>
            <p>Client Workspace</p>
          </div>
        </div>

        <div className="details-header-actions">
          <span className="workspace-label">
            Project Management
          </span>
          <button
            type="button"
            className="details-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="project-details-container">
        <button
          type="button"
          className="details-back-button"
          onClick={() => navigate('/client/dashboard')}
        >
          ← Back to Dashboard
        </button>

        {/* Project Information */}
        <section className="project-info-card">
          <div className="project-info-top">
            <div className="project-title-area">
              <div className="project-icon">▤</div>
              <div>
                <p className="details-eyebrow">
                  PROJECT OVERVIEW
                </p>
                <h2>{project.title}</h2>
              </div>
            </div>

            <span
              className={`details-status-badge ${getStatusClass(
                project.status,
              )}`}
            >
              {project.status}
            </span>
          </div>

          <div className="details-description">
            <h3>Project Description</h3>
            <p>{project.description}</p>
          </div>

          <div className="project-info-grid">
            <div className="details-info-box">
              <span className="info-icon">₹</span>
              <div>
                <p>Project Budget</p>
                <h3>
                  ₹{Number(project.budget || 0).toLocaleString('en-IN')}
                </h3>
              </div>
            </div>

            <div className="details-info-box">
              <span className="info-icon">◈</span>
              <div>
                <p>Current Progress</p>
                <h3>{latestProgress}%</h3>
              </div>
            </div>

            <div className="details-info-box">
              <span className="info-icon">◷</span>
              <div>
                <p>Project Status</p>
                <h3>{project.status}</h3>
              </div>
            </div>

            <div className="details-info-box">
              <span className="info-icon">▣</span>
              <div>
                <p>Created Date</p>
                <h3>{formatDate(project.createdAt)}</h3>
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="overall-progress">
            <div className="progress-heading">
              <div>
                <h3>Overall Progress</h3>
                <p>Latest progress reported by Admin</p>
              </div>
              <strong>{latestProgress}%</strong>
            </div>

            <div
              className="progress-bar"
              role="progressbar"
              aria-valuenow={latestProgress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Overall project progress"
            >
              <div
                className="progress-fill"
                style={{width: `${latestProgress}%`}}
              ></div>
            </div>

            <div className="progress-scale">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </section>

        {/* Updates */}
        <section className="updates-section">
          <div className="updates-section-heading">
            <div>
              <p className="details-eyebrow">
                PROJECT ACTIVITY
              </p>
              <h2>Progress Updates</h2>
              <p>
                Follow the latest work updates shared by your Admin.
              </p>
            </div>

            <span className="updates-count">
              {updates.length} Updates
            </span>
          </div>

          {updates.length === 0 ? (
            <div className="no-updates">
              <div className="no-updates-icon">◷</div>
              <h3>No Updates Yet</h3>
              <p>
                Admin has not added any progress updates for this
                project yet. Check back later.
              </p>
            </div>
          ) : (
            <div className="updates-list">
              {updates.map((update, index) => (
                <article
                  key={update._id}
                  className="update-card"
                >
                  <div className="update-timeline">
                    <div className="timeline-dot">
                      {index === 0 ? '✓' : ''}
                    </div>
                    {index !== updates.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>

                  <div className="update-content">
                    <div className="update-top">
                      <div>
                        <span className="update-label">
                          {index === 0
                            ? 'Latest Update'
                            : 'Progress Update'}
                        </span>
                        <h3>{update.message}</h3>
                        <p className="update-date">
                          ◷ {formatDateTime(update.createdAt)}
                        </p>
                      </div>

                      <span className="progress-percentage">
                        {update.progress}%
                      </span>
                    </div>

                    <div
                      className="update-progress-bar"
                      role="progressbar"
                      aria-valuenow={update.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label={`Progress ${update.progress}%`}
                    >
                      <div
                        className="update-progress-fill"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, Number(update.progress) || 0),
                          )}%`,
                        }}
                      ></div>
                    </div>

                    <p className="progress-text">
                      Project Progress: {update.progress}%
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="details-footer">
          <p>FreelanceFlow · Client Project Portal</p>
          <button
            type="button"
            onClick={loadProjectDetails}
          >
            ↻ Refresh Details
          </button>
        </div>
      </main>
    </div>
  )
}

export default ProjectDetails
