import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import ClientDashboard from './pages/ClientDashboard'
import ProjectDetails from './pages/ProjectDetails'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRole="Admin">
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/client"
      element={
        <ProtectedRoute allowedRole="Client">
          <ClientDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/client/project/:id"
      element={
        <ProtectedRoute allowedRole="Client">
          <ProjectDetails />
        </ProtectedRoute>
      }
    />
  </Routes>
)

export default App