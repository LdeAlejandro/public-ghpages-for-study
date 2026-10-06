import { useState } from 'react'
import './ThemeToggle.css'

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    // Apply globally
    document.documentElement.setAttribute(
      'data-theme',
      newTheme
    )

    // Persist after refresh/navigation/browser restart
    localStorage.setItem('theme', newTheme)

    // Update button
    setTheme(newTheme)
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${
        theme === 'dark' ? 'light' : 'dark'
      } mode`}
    >
      <span className="theme-icon">
        {theme === 'dark' ? '☀' : '☾'}
      </span>

      <span>
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}

export default ThemeToggle