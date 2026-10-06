import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import PageLayout from './components/PageLayout/PageLayout'
import { pages } from './lib/pageRegistry'

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Home />} />

        {pages.map((page) => {
          const PageComponent = page.component

          return (
            <Route
              key={page.path}
              path={page.path}
              element={<PageComponent />}
            />
          )
        })}
      </Routes>
    </PageLayout>
  )
}

export default App