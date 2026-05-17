import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { Category, Tag } from '../types'
import { fetchCategories, fetchTags } from '../api/client'

export default function Sidebar() {
  const location = useLocation()
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
    fetchTags().then(setTags).catch(() => {})
  }, [])

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-geek-surface border-r border-geek-border flex flex-col p-6 z-10 overflow-y-auto">
      {/* Brand */}
      <div className="mb-8">
        <Link to="/" className="no-underline">
          <div className="text-geek-accent text-sm tracking-widest mb-1">&gt; cogito_</div>
          <div className="text-geek-text-h text-lg font-semibold">From 从传领</div>
        </Link>
        <p className="text-xs text-geek-text mt-2 leading-relaxed">
          <span className="text-geek-accent">$</span> cd ~/thoughts && ls -la
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 mb-8">
        <NavLink to="/" label="~/articles" active={location.pathname === '/'} />
        <NavLink to="/search" label="~/search" active={location.pathname === '/search'} />
      </nav>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-6">
          <div className="text-[10px] text-geek-text tracking-[0.2em] mb-2 uppercase">Categories</div>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/?category=${cat.slug}`}
              className={`block text-xs py-1 px-2 rounded no-underline transition-colors ${
                location.search.includes(cat.slug)
                  ? 'text-geek-accent bg-geek-accent-dim'
                  : 'text-geek-text hover:text-geek-text-h'
              }`}
            >
              &gt; {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <div className="text-[10px] text-geek-text tracking-[0.2em] mb-2 uppercase">Tags</div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/?tag=${tag.slug}`}
                className={`text-[11px] px-2 py-0.5 rounded border no-underline transition-colors ${
                  location.search.includes(tag.slug)
                    ? 'border-geek-accent text-geek-accent bg-geek-accent-dim'
                    : 'border-geek-border text-geek-text hover:border-geek-text hover:text-geek-text-h'
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-6 text-[10px] text-geek-text">
        <div className="border-t border-geek-border pt-4">
          <span className="text-geek-accent">●</span> online &mdash; built with Go + React
        </div>
      </div>
    </aside>
  )
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`text-sm py-1.5 px-2 rounded no-underline transition-colors font-mono ${
        active
          ? 'text-geek-accent bg-geek-accent-dim'
          : 'text-geek-text hover:text-geek-text-h hover:bg-geek-border/50'
      }`}
    >
      <span className="text-geek-accent/60 mr-1">$</span>
      {label}
    </Link>
  )
}
