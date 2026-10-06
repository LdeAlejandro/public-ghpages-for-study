import { Link, useLocation } from 'react-router-dom'
import './PageLayout.css'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

function PageLayout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <nav className="page-navigation">
        {!isHome && (
          <Link to="/" className="home-button">
            ← Home
          </Link>
        )}

        <ThemeToggle />
      </nav>

      {children}
    </>
  )
}

export default PageLayout