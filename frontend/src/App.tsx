import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import StarfieldBackground from './components/StarfieldBackground'
import Home from './pages/Home'
import ArticlePage from './pages/Article'
import Search from './pages/Search'
import About from './pages/About'
import AdminLayout from './pages/admin/AdminLayout'
import AdminArticleList from './pages/admin/ArticleList'
import ArticleForm from './pages/admin/ArticleForm'

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
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminArticleList />} />
          <Route path="new" element={<ArticleForm />} />
          <Route path="edit/:slug" element={<ArticleForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
