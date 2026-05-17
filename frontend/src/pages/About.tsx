export default function About() {
  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="text-geek-accent text-xs tracking-[0.2em] mb-2">$ whoami</div>
        <h1 className="text-2xl font-bold text-geek-text-h font-mono mb-4">About Me</h1>
      </div>

      {/* Profile card */}
      <div className="card-glow bg-geek-surface border border-geek-border rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar placeholder */}
          <div className="w-24 h-24 rounded-lg border border-geek-border bg-geek-bg flex items-center justify-center shrink-0">
            <span className="text-3xl text-geek-accent/40 font-mono select-none">?</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-geek-text-h font-mono mb-1">从传领</h2>
            <p className="text-xs text-geek-accent font-mono mb-3">Software Engineer</p>
            <p className="text-sm text-geek-text leading-relaxed">
              Building things with code. Passionate about systems, open source,
              and the craft of software engineering.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { label: 'GitHub', href: 'https://github.com' },
                { label: 'Email', href: 'mailto:hello@example.com' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[11px] px-2.5 py-1 rounded border border-geek-border text-geek-text no-underline hover:text-geek-accent hover:border-geek-accent/40 transition-colors font-mono"
                >
                  &gt; {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-geek-text-h font-mono mb-4">
          <span className="text-geek-accent/60">$</span> cat ~/.skills
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            'Go', 'TypeScript', 'React', 'Python', 'Rust',
            'PostgreSQL', 'Docker', 'Linux', 'Git',
          ].map((skill) => (
            <div
              key={skill}
              className="px-3 py-2 bg-geek-surface border border-geek-border rounded text-xs text-geek-text font-mono hover:border-geek-accent/30 hover:text-geek-text-h transition-colors"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-geek-text-h font-mono mb-4">
          <span className="text-geek-accent/60">$</span> cat ~/.history
        </h2>
        <div className="space-y-0">
          {[
            { year: '2024', what: 'Building Cogito — a personal knowledge base' },
            { year: '2023', what: 'Senior backend engineer — distributed systems' },
            { year: '2021', what: 'Full-stack developer — React + Go microservices' },
            { year: '2019', what: 'Started career — wrote first line of production Go' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 py-3 border-b border-geek-border last:border-0">
              <span className="text-geek-accent text-xs font-mono shrink-0 w-12">{item.year}</span>
              <span className="text-sm text-geek-text">{item.what}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
