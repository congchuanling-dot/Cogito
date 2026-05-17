import { Link } from 'react-router-dom'
import type { Article } from '../types'

export default function ArticleCard({ article }: { article: Article }) {
  const date = new Date(article.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link to={`/article/${article.slug}`} className="no-underline group block">
      <article className="bg-geek-surface border border-geek-border rounded-lg p-5 transition-all hover:border-geek-accent/40 hover:translate-x-0.5">
        <div className="flex items-center gap-2 text-[10px] text-geek-text mb-2 tracking-wider">
          <span className="text-geek-accent/60">{'>>>'}</span>
          {article.category && (
            <span className="px-1.5 py-0.5 rounded border border-geek-border text-geek-accent">
              {article.category.name}
            </span>
          )}
          <time>{date}</time>
        </div>
        <h2 className="text-base font-semibold text-geek-text-h group-hover:text-geek-accent transition-colors mb-2 font-mono">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="text-xs text-geek-text leading-relaxed line-clamp-2">{article.excerpt}</p>
        )}
        {article.tags.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {article.tags.map((tag) => (
              <span key={tag.id} className="text-[10px] text-geek-text/60">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  )
}
