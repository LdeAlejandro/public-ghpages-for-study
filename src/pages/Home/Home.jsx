import { useState } from 'react'
import { Link } from 'react-router-dom'
import { pages } from '../../lib/pageRegistry'
import './Home.css'


function Home() {
  const [search, setSearch] = useState('')

  const query = search.toLowerCase().trim()

  const filteredPages = pages.filter((page) => {
    const searchableContent = [
      page.title,
      page.path,
      page.category,
      page.description,
      ...page.keywords,
    ]
      .join(' ')
      .toLowerCase()

    return searchableContent.includes(query)
  })

  return (
    <main className="catalog">
      <header className="catalog-header">
        <div>
          <h1>Pages</h1>
          <p>Reusable frontend pages and iframe tools.</p>
        </div>

        <span className="page-count">
          {filteredPages.length} {filteredPages.length === 1 ? 'page' : 'pages'}
        </span>
       
      </header>

      <input
        className="search"
        type="search"
        placeholder="Search pages, categories or keywords..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <section className="page-list">
        {filteredPages.map((page) => (
          <Link className="page-card" to={page.path} key={page.path}>
            <div className="page-content">
              <div className="page-title-row">
                <h2>{page.title}</h2>
                <span className="category">{page.category}</span>
              </div>

              <p>{page.description}</p>
              <code>{page.path}</code>
            </div>

            <span className="arrow">→</span>
          </Link>
        ))}

        {filteredPages.length === 0 && (
          <div className="empty">
            <h2>No pages found</h2>
            <p>Try another search.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default Home