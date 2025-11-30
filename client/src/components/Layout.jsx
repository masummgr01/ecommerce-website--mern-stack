import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import './Layout.css'

export default function Layout() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [location.pathname])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  function scrollToSection(sectionId) {
    // If not on home page, navigate first
    if (location.pathname !== '/' && location.pathname !== '/products') {
      navigate('/')
      // Wait for navigation and DOM update, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    } else {
      // Already on home page, scroll immediately
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 50)
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo" onClick={() => navigate('/')}>HamroShop</div>
        <nav className="nav-left">
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('products'); }}>Shop</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('featured'); }}>Featured</a>
          <Link to="/cart">Cart</Link>
          {user?.role === 'admin' && <Link to="/admin/products">Admin</Link>}
        </nav>
        <nav className="nav-right">
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </nav>
      </header>
      <section id="hero" className="hero">
        <div className="hero-content">
          <h1>Welcome to HamroShop</h1>
          <p>Your one-stop shop for everything you need.</p>
        </div>
      </section>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">&copy; {new Date().getFullYear()} HamroShop</footer>
    </div>
  )
}
