
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async event => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/users/login', {
        email,
        password,
      })

      console.log('Login response:', response.data)

      const token = response.data.token
      const role = response.data.role || response.data.user?.role

      if (!token) {
        setError('Token not received from backend')
        return
      }

      if (!role) {
        setError('Role not received from backend')
        return
      }

      localStorage.setItem('token', token)
      localStorage.setItem('role', role)

      const normalizedRole = role.toLowerCase()

      if (normalizedRole === 'admin') {
        navigate('/admin')
      } else if (normalizedRole === 'client') {
        navigate('/client')
      } else {
        setError(`Invalid user role: ${role}`)
      }
    } catch (err) {
      console.error('Login error:', err)

      setError(
        err.response?.data?.message || 'Login failed',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to your Freelancer account
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="register-text">
          Don't have an account?{' '}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
