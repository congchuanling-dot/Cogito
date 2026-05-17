import { Link, Outlet, useLocation } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Articles', icon: '$' },
  { to: '/admin/new', label: 'New Article', icon: '+' },
  { to: '/admin/about', label: 'About Page', icon: '@' },
]

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen">
      {/* Admin sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[220px] bg-geek-surface border-r border-geek-border flex flex-col p-5 z-10">
        <div className="mb-8">
          <div className="text-geek-accent text-xs tracking-[0.2em] mb-1">&gt; admin_</div>
          <div className="text-geek-text-h text-sm font-semibold">Dashboard</div>
        </div>

        <nav className="flex flex-col gap-1 mb-8">
          {links.map((link) => {
            const active = link.to === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm py-2 px-3 rounded no-underline transition-colors font-mono ${
                  active
                    ? 'text-geek-accent bg-geek-accent-dim'
                    : 'text-geek-text hover:text-geek-text-h hover:bg-geek-border/50'
                }`}
              >
                <span className="text-geek-accent/60 mr-2">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-geek-border">
          <Link
            to="/"
            className="text-xs text-geek-text no-underline hover:text-geek-accent font-mono transition-colors"
          >
            &lt; back to site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="ml-[220px] flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
