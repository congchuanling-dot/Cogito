import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Article } from '../types'
import { fetchArticles } from '../api/client'
import ArticleCard from '../components/ArticleCard'

export default function Home() {
  const [searchParams] = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const category = searchParams.get('category') || ''
  const tag = searchParams.get('tag') || ''

  useEffect(() => {
    setPage(1)
  }, [category, tag])

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = { page: String(page), limit: '10' }
    if (category) params.category = category
    if (tag) params.tag = tag

    fetchArticles(params)
      .then((data) => {
        setArticles(data.articles)
        setTotal(data.total)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, category, tag])

  const totalPages = Math.ceil(total / 10)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="text-geek-accent text-xs tracking-[0.2em] mb-2">
          {category || tag ? '$ grep -r' : '$ ls -la ~/articles'}
        </div>
        <h1 className="text-xl font-semibold text-geek-text-h font-mono">
          {category ? `category:${category}` : tag ? `tag:${tag}` : 'Articles'}
        </h1>
        <p className="text-xs text-geek-text mt-1">{total} article{total !== 1 ? 's' : ''} found</p>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-geek-text text-sm py-12 text-center">
          <span className="animate-pulse text-geek-accent">&gt;</span> Loading...
        </div>
      ) : articles.length === 0 ? (
        <div className="text-geek-text text-sm py-12 text-center border border-geek-border rounded-lg bg-geek-surface">
          <span className="text-geek-accent">$</span> No articles found.
          <span className="animate-pulse ml-1">▊</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 text-xs font-mono">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded border border-geek-border text-geek-text hover:text-geek-text-h hover:border-geek-accent/40 disabled:opacity-30 disabled:cursor-not-allowed bg-geek-surface transition-colors"
          >
            &lt; prev
          </button>
          <span className="text-geek-text px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded border border-geek-border text-geek-text hover:text-geek-text-h hover:border-geek-accent/40 disabled:opacity-30 disabled:cursor-not-allowed bg-geek-surface transition-colors"
          >
            next &gt;
          </button>
        </div>
      )}
    </div>
  )
}
