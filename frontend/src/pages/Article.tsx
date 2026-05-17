import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import type { Article as ArticleType, ArticleNeighbor } from '../types'
import { fetchArticle, fetchArticleNeighbors } from '../api/client'
import TerminalBar from '../components/TerminalBar'
import TOC from '../components/TOC'

function readingTime(content: string): string {
  const chars = content.replace(/\s/g, '').length
  const mins = Math.max(1, Math.round(chars / 400))
  return `≈ ${mins} min read`
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<ArticleType | null>(null)
  const [neighbors, setNeighbors] = useState<{ prev?: ArticleNeighbor; next?: ArticleNeighbor }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([
      fetchArticle(slug),
      fetchArticleNeighbors(slug),
    ])
      .then(([articleData, neighborsData]) => {
        setArticle(articleData)
        setNeighbors(neighborsData)
      })
      .catch(() => setError('Article not found'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="text-geek-text text-sm py-12 text-center">
        <span className="animate-pulse text-geek-accent">&gt;</span> Loading article...
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="text-center py-16">
        <div className="text-geek-accent text-lg font-mono mb-4">404: Not Found</div>
        <p className="text-geek-text text-sm mb-6">$ cat article.md &mdash; file not found</p>
        <Link
          to="/"
          className="text-geek-accent text-sm no-underline hover:underline font-mono"
        >
          &gt; cd ~/articles
        </Link>
      </div>
    )
  }

  const date = new Date(article.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <article className="flex-1 min-w-0">
        {/* Meta bar */}
        <div className="flex items-center gap-2 text-[10px] text-geek-text mb-3 tracking-wider flex-wrap">
          <Link to="/" className="text-geek-accent/60 no-underline hover:text-geek-accent font-mono">
            ~/articles
          </Link>
          <span className="text-geek-border">/</span>
          <span className="text-geek-text">{article.slug}.md</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-geek-text-h font-mono mb-2 leading-tight">
          {article.title}
        </h1>

        {/* Info */}
        <div className="flex items-center gap-3 text-xs text-geek-text mb-8 flex-wrap">
          {article.category && (
            <span className="px-2 py-0.5 rounded border border-geek-border text-geek-accent font-mono">
              {article.category.name}
            </span>
          )}
          <time>{date}</time>
          <span className="text-geek-text/50">{readingTime(article.content)}</span>
          {article.tags.length > 0 && (
            <span className="text-geek-text/60">
              {article.tags.map((t) => `#${t.name}`).join(' ')}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="card-glow bg-geek-surface border border-geek-border rounded-lg overflow-hidden">
          <TerminalBar title={`${article.slug}.md`} />
          <div className="prose max-w-none p-5">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Prev / Next */}
        {(neighbors.prev || neighbors.next) && (
          <div className="mt-8 grid grid-cols-2 gap-4">
            {neighbors.prev ? (
              <Link
                to={`/article/${neighbors.prev.slug}`}
                className="card-glow bg-geek-surface border border-geek-border rounded-lg p-4 no-underline hover:border-geek-accent/40 transition-colors group"
              >
                <div className="text-[10px] text-geek-text/50 tracking-wider mb-1">&lt; prev</div>
                <div className="text-sm text-geek-text-h group-hover:text-geek-accent transition-colors font-mono truncate">
                  {neighbors.prev.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
            {neighbors.next ? (
              <Link
                to={`/article/${neighbors.next.slug}`}
                className="card-glow bg-geek-surface border border-geek-border rounded-lg p-4 no-underline hover:border-geek-accent/40 transition-colors group text-right"
              >
                <div className="text-[10px] text-geek-text/50 tracking-wider mb-1">next &gt;</div>
                <div className="text-sm text-geek-text-h group-hover:text-geek-accent transition-colors font-mono truncate">
                  {neighbors.next.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}

        {/* Back */}
        <div className="mt-6 pt-4 border-t border-geek-border">
          <Link
            to="/"
            className="text-geek-accent text-sm no-underline hover:underline font-mono"
          >
            &lt; cd ~/articles
          </Link>
        </div>
      </article>

      {/* TOC sidebar */}
      <aside className="hidden xl:block w-[200px] shrink-0">
        <div className="sticky top-8">
          <TOC content={article.content} />
        </div>
      </aside>
    </div>
  )
}
