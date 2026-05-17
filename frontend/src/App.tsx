import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import StarfieldBackground from './components/StarfieldBackground'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import ArticlePage from './pages/Article'
import Search from './pages/Search'
import About from './pages/About'
import AdminLayout from './pages/admin/AdminLayout'
import AdminArticleList from './pages/admin/ArticleList'
import AboutEditor from './pages/admin/AboutEditor'

const ArticleForm = lazy(() => import('./pages/admin/ArticleForm'))

function PublicLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[260px] flex-1 p-8 lg:p-12 relative z-[1]">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <StarfieldBackground />
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<About />} />
          <Route path="/articles" element={<Home />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminArticleList />} />
          <Route path="new" element={<ErrorBoundary><Suspense fallback={<div className="text-geek-text text-sm py-12 text-center"><span className="animate-pulse">&gt;</span> Loading editor...</div>}><ArticleForm /></Suspense></ErrorBoundary>} />
          <Route path="edit/:slug" element={<ErrorBoundary><Suspense fallback={<div className="text-geek-text text-sm py-12 text-center"><span className="animate-pulse">&gt;</span> Loading editor...</div>}><ArticleForm /></Suspense></ErrorBoundary>} />
          <Route path="about" element={<AboutEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
