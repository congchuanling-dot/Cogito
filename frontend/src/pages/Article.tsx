import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import type { Article as ArticleType } from '../types'
import { fetchArticle } from '../api/client'
import TerminalBar from '../components/TerminalBar'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<ArticleType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetchArticle(slug)
      .then(setArticle)
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
    <article>
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
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Back */}
      <div className="mt-12 pt-6 border-t border-geek-border">
        <Link
          to="/"
          className="text-geek-accent text-sm no-underline hover:underline font-mono"
        >
          &lt; cd ~/articles
        </Link>
      </div>
    </article>
  )
}
