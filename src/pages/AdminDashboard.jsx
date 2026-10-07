
import {useEffect, useState} from 'react'
import api from '../services/api'
import './Dashboard.css'

const AdminDashboard = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [client, setClient] = useState('')
  const [budget, setBudget] = useState('')
  const [projects, setProjects] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  // Progress update states
  const [selectedProject, setSelectedProject] = useState('')
  const [updateMessage, setUpdateMessage] = useState('')
  const [progress, setProgress] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [updateLoading, setUpdateLoading] = useState(false)

  const token = localStorage.getItem('token')

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/all', authConfig)
      setProjects(response.data.projects || [])
      setError('')
    } catch (err) {
      console.error(err.response?.data || err.message)
      setError('Unable to fetch projects')
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async event => {
    event.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      await api.post(
        '/projects/create',
        {
          title,
          description,
          client,
          budget: Number(budget),
        },
        authConfig,
      )

      setMessage('Project created successfully!')
      setTitle('')
      setDescription('')
      setClient('')
      setBudget('')
      await fetchProjects()
    } catch (err) {
      setError(
        err.response?.data?.message || 'Project creation failed',
      )
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.patch(
        `/projects/update-status/${id}`,
        {status},
        authConfig,
      )
      await fetchProjects()
    } catch (err) {
      console.error(err.response?.data || err.message)
      setError('Unable to update status')
    }
  }

  const deleteProject = async id => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?',
    )

    if (!confirmDelete) return

    try {
      await api.delete(`/projects/delete/${id}`, authConfig)
      await fetchProjects()
    } catch (err) {
      console.error(err.response?.data || err.message)
      setError('Unable to delete project')
    }
  }

  const handleAddProgressUpdate = async event => {
    event.preventDefault()
    setUpdateSuccess('')
    setUpdateError('')
    setUpdateLoading(true)

    try {
      const response = await api.post(
        '/project-updates/add',
        {
          projectId: selectedProject,
          message: updateMessage,
          progress: Number(progress),
        },
        authConfig,
      )

      setUpdateSuccess(
        response.data.message || 'Progress update added successfully!',
      )
      setSelectedProject('')
      setUpdateMessage('')
      setProgress('')
    } catch (err) {
      setUpdateError(
        err.response?.data?.message ||
          'Unable to add progress update',
      )
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    window.location.href = '/login'
  }

  const scrollToSection = section => {
    setActiveSection(section)
    document
      .getElementById(`admin-${section}`)
      ?.scrollIntoView({behavior: 'smooth'})
  }

  const totalProjects = projects.length
  const pendingProjects = projects.filter(
    project => project.status === 'Pending',
  ).length
  const activeProjects = projects.filter(
    project => project.status === 'In Progress',
  ).length
  const completedProjects = projects.filter(
    project => project.status === 'Completed',
  ).length

  const formatBudget = amount =>
    Number(amount || 0).toLocaleString('en-IN')

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-icon">F</div>
          <div>
            <h2>
              Freelance<span>Flow</span>
            </h2>
            <p>Management Portal</p>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="admin-nav">
          <button
            className={
              activeSection === 'overview'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => scrollToSection('overview')}
            type="button"
          >
            <span>▦</span> Overview
          </button>

          <button
            className={
              activeSection === 'projects'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => scrollToSection('projects')}
            type="button"
          >
            <span>▤</span> All Projects
          </button>

          <button
            className={
              activeSection === 'create'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => scrollToSection('create')}
            type="button"
          >
            <span>＋</span> Create Project
          </button>

          <button
            className={
              activeSection === 'updates'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => scrollToSection('updates')}
            type="button"
          >
            <span>◈</span> Progress Updates
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="profile-avatar">A</div>
            <div>
              <h4>Administrator</h4>
              <p>Workspace Admin</p>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            type="button"
          >
            <span>↪</span> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="topbar-subtitle">
              Workspace / Dashboard
            </p>
            <h1>Admin Overview</h1>
          </div>

          <div className="topbar-right">
            <div className="topbar-date">
              <span>◷</span> Project Management
            </div>
            <div className="topbar-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          {/* Overview */}
          <section
            id="admin-overview"
            className="overview-section"
          >
            <div className="welcome-banner">
              <div>
                <p className="welcome-tag">ADMIN WORKSPACE</p>
                <h2>Welcome back, Admin! 👋</h2>
                <p>
                  Manage projects, track progress, and keep your team
                  moving forward.
                </p>
              </div>
              <div className="welcome-decoration">✦</div>
            </div>

            <div className="section-title-row">
              <div>
                <h2>Project Overview</h2>
                <p>Here is what's happening in your workspace.</p>
              </div>

              <button
                className="refresh-button"
                onClick={fetchProjects}
                type="button"
              >
                ↻ Refresh
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-box stat-blue">
                <div className="stat-top">
                  <span>Total Projects</span>
                  <div className="stat-icon">▤</div>
                </div>
                <h3>{totalProjects}</h3>
                <p>All registered projects</p>
              </div>

              <div className="stat-box stat-orange">
                <div className="stat-top">
                  <span>Pending</span>
                  <div className="stat-icon">◷</div>
                </div>
                <h3>{pendingProjects}</h3>
                <p>Waiting to get started</p>
              </div>

              <div className="stat-box stat-purple">
                <div className="stat-top">
                  <span>In Progress</span>
                  <div className="stat-icon">◈</div>
                </div>
                <h3>{activeProjects}</h3>
                <p>Currently being worked on</p>
              </div>

              <div className="stat-box stat-green">
                <div className="stat-top">
                  <span>Completed</span>
                  <div className="stat-icon">✓</div>
                </div>
                <h3>{completedProjects}</h3>
                <p>Successfully completed</p>
              </div>
            </div>
          </section>

          {/* Create Project */}
          <section
            id="admin-create"
            className="create-project-section"
          >
            <div className="section-title-row">
              <div>
                <h2>Create a New Project</h2>
                <p>Add a project and assign it to a client.</p>
              </div>
            </div>

            <div className="create-project-card">
              <div className="form-heading">
                <div className="form-heading-icon">＋</div>
                <div>
                  <h3>Project Details</h3>
                  <p>Fill in the information below.</p>
                </div>
              </div>

              <form
                onSubmit={handleCreateProject}
                className="admin-project-form"
              >
                <div className="form-field">
                  <label htmlFor="project-title">
                    Project Title
                  </label>
                  <input
                    id="project-title"
                    type="text"
                    placeholder="e.g. E-commerce Website"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="client-id">Client ID</label>
                  <input
                    id="client-id"
                    type="text"
                    placeholder="Enter registered client ID"
                    value={client}
                    onChange={e => setClient(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field full-width">
                  <label htmlFor="project-description">
                    Description
                  </label>
                  <textarea
                    id="project-description"
                    placeholder="Describe the project requirements..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="project-budget">
                    Budget (₹)
                  </label>
                  <input
                    id="project-budget"
                    type="number"
                    placeholder="Enter project budget"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    min="0"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : '＋ Create Project'}
                  </button>
                </div>
              </form>

              {message && (
                <p className="admin-success">{message}</p>
              )}
              {error && (
                <p className="admin-error">{error}</p>
              )}
            </div>
          </section>

          {/* Progress Update Form */}
          <section
            id="admin-updates"
            className="admin-progress-section"
          >
            <div className="section-title-row">
              <div>
                <h2>Add Progress Update</h2>
                <p>
                  Share the latest work progress with your client.
                </p>
              </div>
            </div>

            <div className="create-project-card">
              <form
                onSubmit={handleAddProgressUpdate}
                className="admin-project-form progress-update-form"
              >
                <div className="form-field full-width">
                  <label htmlFor="update-project">
                    Select Project
                  </label>
                  <select
                    id="update-project"
                    value={selectedProject}
                    onChange={e =>
                      setSelectedProject(e.target.value)
                    }
                    required
                  >
                    <option value="">Choose a project</option>
                    {projects.map(project => (
                      <option
                        key={project._id}
                        value={project._id}
                      >
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field full-width">
                  <label htmlFor="update-message">
                    Update Message
                  </label>
                  <textarea
                    id="update-message"
                    rows="4"
                    placeholder="Describe the work completed..."
                    value={updateMessage}
                    onChange={e =>
                      setUpdateMessage(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="update-progress">
                    Progress Percentage
                  </label>
                  <input
                    id="update-progress"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter 0 to 100"
                    value={progress}
                    onChange={e => setProgress(e.target.value)}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={
                      updateLoading || projects.length === 0
                    }
                  >
                    {updateLoading
                      ? 'Saving...'
                      : '＋ Add Progress Update'}
                  </button>
                </div>
              </form>

              {updateSuccess && (
                <p className="admin-success">{updateSuccess}</p>
              )}
              {updateError && (
                <p className="admin-error">{updateError}</p>
              )}
            </div>
          </section>

          {/* All Projects */}
          <section
            id="admin-projects"
            className="all-projects-section"
          >
            <div className="section-title-row">
              <div>
                <h2>All Projects</h2>
                <p>View and manage all client projects.</p>
              </div>
              <span className="project-count">
                {totalProjects} Projects
              </span>
            </div>

            {error && !message && (
              <p className="admin-error project-error">{error}</p>
            )}

            {projects.length === 0 ? (
              <div className="empty-projects">
                <div className="empty-icon">▤</div>
                <h3>No projects yet</h3>
                <p>Create your first project to see it here.</p>
              </div>
            ) : (
              <div className="admin-projects-grid">
                {projects.map(project => (
                  <article
                    className="admin-project-card"
                    key={project._id}
                  >
                    <div className="project-card-top">
                      <div className="project-symbol">▤</div>
                      <span
                        className={`status-badge ${
                          project.status === 'Completed'
                            ? 'status-completed'
                            : project.status === 'In Progress'
                              ? 'status-progress'
                              : 'status-pending'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <h3>{project.title}</h3>
                    <p className="project-description">
                      {project.description}
                    </p>

                    <div className="project-details">
                      <div>
                        <span className="detail-label">Client</span>
                        <strong>
                          {project.client?.name || 'Unknown'}
                        </strong>
                      </div>

                      <div>
                        <span className="detail-label">Email</span>
                        <strong className="client-email">
                          {project.client?.email || 'Unknown'}
                        </strong>
                      </div>

                      <div>
                        <span className="detail-label">Budget</span>
                        <strong className="budget-value">
                          ₹{formatBudget(project.budget)}
                        </strong>
                      </div>
                    </div>

                    <div className="project-card-footer">
                      <div className="status-control">
                        <label htmlFor={`status-${project._id}`}>
                          Update status
                        </label>
                        <select
                          id={`status-${project._id}`}
                          value={project.status}
                          onChange={e =>
                            updateStatus(
                              project._id,
                              e.target.value,
                            )
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">
                            In Progress
                          </option>
                          <option value="Completed">
                            Completed
                          </option>
                        </select>
                      </div>

                      <button
                        className="delete-project-button"
                        type="button"
                        onClick={() => deleteProject(project._id)}
                        aria-label={`Delete ${project.title}`}
                        title="Delete project"
                      >
                        ✕
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
