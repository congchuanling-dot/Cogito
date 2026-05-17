import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Article } from '../types'
import { searchArticles } from '../api/client'
import ArticleCard from '../components/ArticleCard'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    setSearchParams({ q })
    searchArticles(q)
      .then((data) => setArticles(data.articles))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [setSearchParams])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      doSearch(q)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') doSearch(query)
  }

  return (
    <div>
      <div className="mb-8">
        <div className="text-geek-accent text-xs tracking-[0.2em] mb-2">$ grep -rn</div>
        <h1 className="text-xl font-semibold text-geek-text-h font-mono mb-4">Search</h1>

        {/* Search input */}
        <div className="flex items-center gap-0">
          <span className="text-geek-accent text-sm font-mono px-3 py-2 bg-geek-surface border border-r-0 border-geek-border rounded-l-lg select-none">
            &gt;
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="search articles..."
            autoFocus
            className="flex-1 bg-geek-surface border border-geek-border text-geek-text-h text-sm py-2 px-3 outline-none font-mono placeholder:text-geek-text/40 placeholder:font-mono rounded-r-lg focus:border-geek-accent/40 transition-colors"
          />
          <button
            onClick={() => doSearch(query)}
            className="ml-2 px-4 py-2 rounded-lg bg-geek-accent/10 border border-geek-accent/30 text-geek-accent text-sm font-mono hover:bg-geek-accent/20 transition-colors cursor-pointer"
          >
            grep
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-geek-text text-sm py-12 text-center">
          <span className="animate-pulse text-geek-accent">&gt;</span> Searching...
        </div>
      ) : searched ? (
        <>
          <p className="text-xs text-geek-text mb-4">
            {articles.length} result{articles.length !== 1 ? 's' : ''} for &quot;{searchParams.get('q')}&quot;
          </p>
          {articles.length === 0 ? (
            <div className="text-geek-text text-sm py-8 text-center border border-geek-border rounded-lg bg-geek-surface">
              No matches found. <span className="text-geek-accent/60">grep returned empty.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-geek-text text-sm py-12 text-center border border-geek-border rounded-lg bg-geek-surface">
          <span className="text-geek-accent">$</span> Type a query and press Enter to search.
        </div>
      )}
    </div>
  )
}
