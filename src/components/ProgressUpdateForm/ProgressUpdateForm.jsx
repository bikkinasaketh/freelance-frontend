import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import api from '../../api'
import './index.css'

const ProgressUpdateForm = () => {
  const [projects, setProjects] = useState([])
  const [projectId, setProjectId] = useState('')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')

  const token = Cookies.get('jwt_token')

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await api.get('/projects/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setProjects(response.data.projects || [])
      } catch (err) {
        setError('Failed to load projects')
        console.log(err)
      }
    }

    getProjects()
  }, [token])

  const handleSubmit = async event => {
    event.preventDefault()

    setLoading(true)
    setError('')
    setStatusMessage('')

    try {
      const response = await api.post(
        '/project-updates/add',
        {
          projectId,
          message,
          progress: Number(progress),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setStatusMessage(response.data.message)
      setMessage('')
      setProgress('')
      setProjectId('')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to add project update',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="progress-update-container">
      <div className="progress-update-card">
        <h2>Add Progress Update</h2>
        <p className="form-subtitle">
          Update the progress of a client project.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="project">Select Project</label>

            <select
              id="project"
              value={projectId}
              onChange={event => setProjectId(event.target.value)}
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

          <div className="form-group">
            <label htmlFor="message">Update Message</label>

            <textarea
              id="message"
              value={message}
              onChange={event => setMessage(event.target.value)}
              placeholder="Enter work completed..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="progress">
              Progress Percentage
            </label>

            <input
              id="progress"
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={event => setProgress(event.target.value)}
              placeholder="Enter progress (0-100)"
              required
            />
          </div>

          {statusMessage && (
            <p className="success-message">{statusMessage}</p>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || projects.length === 0}
          >
            {loading ? 'Saving...' : 'Add Update'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProgressUpdateForm