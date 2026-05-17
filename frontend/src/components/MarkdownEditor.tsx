import { useRef } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insert = (before: string, after: string, placeholder: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.substring(start, end) || placeholder
    const newText = value.substring(0, start) + before + selected + after + value.substring(end)
    onChange(newText)
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = start + before.length
      ta.selectionEnd = start + before.length + selected.length
    })
  }

  const btn = 'p-1.5 rounded text-geek-text hover:text-geek-text-h hover:bg-geek-border/50 transition-colors cursor-pointer text-xs font-mono'

  return (
    <div className="border border-geek-border rounded-lg overflow-hidden h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 p-1.5 bg-geek-surface border-b border-geek-border flex-wrap">
        <button type="button" className={btn} onClick={() => insert('**', '**', 'bold')} title="Bold (Ctrl+B)">
          <b>B</b>
        </button>
        <button type="button" className={btn} onClick={() => insert('<u>', '</u>', 'underline')} title="Underline">
          <span className="underline">U</span>
        </button>
        <button type="button" className={btn} onClick={() => insert('`', '`', 'code')} title="Inline Code">
          &lt;/&gt;
        </button>
        <button type="button" className={btn} onClick={() => insert('\n```\n', '\n```\n', 'code block')} title="Code Block">
          {'{ }'}
        </button>

        <span className="w-px h-5 bg-geek-border mx-0.5" />

        <button type="button" className={btn} onClick={() => insert('[', '](url)', 'link text')} title="Link">
          🔗
        </button>
        <button type="button" className={btn} onClick={() => insert('![', '](url)', 'alt text')} title="Image">
          🖼
        </button>

        <span className="w-px h-5 bg-geek-border mx-0.5" />

        {['#22d3a0', '#60a5fa', '#f472b6', '#fbbf24', '#f87171', '#c084fc', '#e5e7eb', '#9ca3af'].map((color) => (
          <button
            key={color}
            type="button"
            className="p-1.5 rounded hover:bg-geek-border/50 transition-colors cursor-pointer"
            onClick={() => insert(`<span style="color:${color}">`, '</span>', 'colored text')}
            title={`Color ${color}`}
          >
            <span className="inline-block w-3.5 h-3.5 rounded-sm border border-geek-border" style={{ backgroundColor: color }} />
          </button>
        ))}

        <span className="w-px h-5 bg-geek-border mx-0.5" />

        <button type="button" className={btn} onClick={() => insert('- ', '', 'list item')} title="List">•</button>
        <button type="button" className={btn} onClick={() => insert('> ', '', 'quote')} title="Quote">&ldquo;</button>
        <button type="button" className={btn} onClick={() => insert('---\n', '', '')} title="Divider">—</button>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-h-0 w-full bg-geek-bg text-geek-text-h text-sm p-3 font-mono outline-none resize-none border-none"
        placeholder="Write Markdown here...

**Bold text** · <u>underlined</u> · <span style=&quot;color:#22d3a0&quot;>colored</span>

![Image](https://example.com/img.png)
[Link](https://example.com)
```go
func main() { ... }
```"
      />
    </div>
  )
}
