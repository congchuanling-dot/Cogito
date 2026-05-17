import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

export default function TOC({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    // Parse headings from markdown — skip code blocks
    const lines = content.split('\n')
    const result: Heading[] = []
    let inCode = false
    for (const line of lines) {
      if (line.startsWith('```')) { inCode = !inCode; continue }
      if (inCode) continue
      const match = line.match(/^(#{1,3})\s+(.+)/)
      if (match) {
        const level = match[1].length
        const text = match[2].replace(/[`*_~\[\]()]/g, '').trim()
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9一-鿿\-]/g, '')
        result.push({ id, text, level })
      }
    }
    setHeadings(result)
  }, [content])

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )
    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav className="text-xs font-mono">
      <div className="text-geek-accent/60 text-[10px] tracking-[0.2em] mb-3 uppercase">On this page</div>
      <ul className="space-y-0.5 border-l border-geek-border pl-3">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? 12 : 0 }}>
            <a
              href={`#${h.id}`}
              className={`block py-1 no-underline transition-colors truncate ${
                activeId === h.id
                  ? 'text-geek-accent'
                  : 'text-geek-text/60 hover:text-geek-text'
              }`}
            >
              {h.level === 3 && <span className="text-geek-text/30 mr-1">└</span>}
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
