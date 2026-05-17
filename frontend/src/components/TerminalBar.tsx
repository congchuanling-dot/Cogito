interface Props {
  title?: string
  className?: string
}

export default function TerminalBar({ title, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-geek-bg/80 border-b border-geek-border rounded-t-lg ${className}`}>
      <span className="term-dot term-dot-red" />
      <span className="term-dot term-dot-yellow" />
      <span className="term-dot term-dot-green" />
      {title && (
        <span className="text-[10px] text-geek-text/50 ml-2 font-mono truncate">{title}</span>
      )}
    </div>
  )
}
