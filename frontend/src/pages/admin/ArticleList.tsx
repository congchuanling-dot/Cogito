import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Article } from '../../types'
import { fetchArticles, deleteArticle } from '../../api/client'

export default function AdminArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetchArticles({ limit: '100' })
      .then((d) => {
        setArticles(d.articles)
        setTotal(d.total)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    await deleteArticle(id)
    load()
  }

  if (loading) {
    return <div className="text-geek-text text-sm py-12 text-center"><span className="animate-pulse">&gt;</span> Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-geek-text-h font-mono">Articles</h1>
          <p className="text-xs text-geek-text mt-1">{total} total</p>
        </div>
        <Link
          to="/admin/new"
          className="px-4 py-2 rounded-lg bg-geek-accent/10 border border-geek-accent/30 text-geek-accent text-sm font-mono no-underline hover:bg-geek-accent/20 transition-colors"
        >
          + New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-geek-text text-sm py-12 text-center border border-geek-border rounded-lg bg-geek-surface">
          No articles yet.
          <Link to="/admin/new" className="text-geek-accent ml-1 no-underline hover:underline">Create one?</Link>
        </div>
      ) : (
        <div className="border border-geek-border rounded-lg overflow-hidden bg-geek-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-geek-border text-geek-text text-xs uppercase tracking-wider">
                <th className="text-left p-3 font-medium">Title</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Status</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">Date</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-geek-border last:border-0 hover:bg-geek-bg/50 transition-colors">
                  <td className="p-3">
                    <div className="text-geek-text-h font-mono text-sm truncate max-w-[300px]">{a.title}</div>
                    <div className="text-geek-text/50 text-[10px] font-mono mt-0.5 hidden sm:block">{a.slug}</div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${a.published ? 'text-geek-accent bg-geek-accent-dim border border-geek-accent/30' : 'text-geek-text bg-geek-border/50 border border-geek-border'}`}>
                      {a.published ? 'published' : 'draft'}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell text-geek-text text-xs font-mono">
                    {a.category?.name || '-'}
                  </td>
                  <td className="p-3 hidden lg:table-cell text-geek-text text-xs font-mono">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/edit/${a.slug}`}
                        className="text-xs px-3 py-1.5 rounded border border-geek-border text-geek-text no-underline hover:text-geek-text-h hover:border-geek-text font-mono transition-colors"
                      >
                        edit
                      </Link>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        className="text-xs px-3 py-1.5 rounded border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 font-mono transition-colors cursor-pointer"
                      >
                        delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
