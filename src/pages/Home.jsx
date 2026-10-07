
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  const features = [
    {
      icon: '📁',
      title: 'Project Management',
      description: 'Create, organize, and manage all your projects in one place.',
    },
    {
      icon: '👥',
      title: 'Client Management',
      description: 'Manage client details and keep all project information organized.',
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Track project progress and monitor project status easily.',
    },
    {
      icon: '💰',
      title: 'Budget Management',
      description: 'Manage project budgets and keep track of project costs.',
    },
    {
      icon: '🔐',
      title: 'Secure Access',
      description: 'Separate Admin and Client dashboards with secure authentication.',
    },
    {
      icon: '⚡',
      title: 'Easy Workflow',
      description: 'Simplify your daily freelance project management workflow.',
    },
  ]

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <a href="#home" className="logo">
          FreelanceHub
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>
          <Link to="/register" className="register-btn">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="hero-content">
          <span className="hero-tag">Smart Freelance Management</span>

          <h1>
            Manage Your Projects
            <span> Smarter & Faster</span>
          </h1>

          <p>
            Manage clients, organize projects, track progress, and
            simplify your freelance workflow with one powerful platform.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Get Started
            </Link>
            <a href="#features" className="secondary-btn">
              Explore Features
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-preview">
            <div className="preview-header">
              <span>Project Overview</span>
              <span className="preview-dot">●</span>
            </div>

            <div className="preview-stats">
              <div>
                <small>Total Projects</small>
                <h2>24</h2>
              </div>
              <div>
                <small>Completed</small>
                <h2>18</h2>
              </div>
            </div>

            <div className="preview-project">
              <div>
                <strong>Website Development</strong>
                <p>Project Progress</p>
              </div>
              <div className="progress">
                <div className="progress-fill"></div>
              </div>
              <small>75%</small>
            </div>

            <div className="preview-project">
              <div>
                <strong>Mobile App Design</strong>
                <p>Project Progress</p>
              </div>
              <div className="progress">
                <div className="progress-fill second"></div>
              </div>
              <small>45%</small>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features section">
        <div className="section-heading">
          <span>OUR FEATURES</span>
          <h2>Everything You Need to Manage Projects</h2>
          <p>
            Powerful tools to make your project management simple
            and organized.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="about section">
        <div className="about-content">
          <span>ABOUT US</span>
          <h2>One Platform for Your Freelance Business</h2>
          <p>
            FreelanceHub is a project and client management platform
            designed to simplify the way freelance projects are
            organized and monitored.
          </p>
          <p>
            Admins can create projects, assign clients, update
            project statuses, and manage work. Clients can log in
            to view their assigned projects and track progress.
          </p>
          <Link to="/register" className="primary-btn">
            Join Now
          </Link>
        </div>

        <div className="about-visual">
          <div className="about-icon">🚀</div>
          <h3>Work Smarter</h3>
          <p>Plan. Manage. Deliver.</p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact section">
        <div className="section-heading">
          <span>CONTACT US</span>
          <h2>Let's Connect</h2>
          <p>Have a question? Send us a message.</p>
        </div>

        <form
          className="contact-form"
          onSubmit={event => {
            event.preventDefault()
            alert('Contact form UI is ready. Connect a backend to send messages.')
          }}
        >
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required />
          <button type="submit" className="primary-btn">
            Send Message
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div>
          <h2>FreelanceHub</h2>
          <p>Manage your projects. Build your success.</p>
        </div>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <Link to="/login">Login</Link>
        </div>

        <p className="copyright">
          © 2026 FreelanceHub. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default Home
