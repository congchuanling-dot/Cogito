import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import type { Category, Tag } from '../../types'
import {
  fetchArticle,
  fetchCategories,
  fetchTags,
  createArticle,
  updateArticle,
} from '../../api/client'
import MarkdownEditor from '../../components/MarkdownEditor'

export default function ArticleForm() {
  const { slug } = useParams<{ slug: string }>()
  const [articleId, setArticleId] = useState<number | null>(null)
  const isEdit = Boolean(slug)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [categoryId, setCategoryId] = useState<number>(0)
  const [tagIds, setTagIds] = useState<number[]>([])
  const [published, setPublished] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories().then(setCategories)
    fetchTags().then(setTags)

    if (isEdit && slug) {
      setLoading(true)
      fetchArticle(slug)
        .then((a) => {
          setArticleId(a.id)
          setTitle(a.title)
          setContent(a.content)
          setExcerpt(a.excerpt || '')
          setCategoryId(a.category_id || 0)
          setTagIds(a.tags?.map((t) => t.id) || [])
          setPublished(a.published)
        })
        .finally(() => setLoading(false))
    }
  }, [slug, isEdit])

  const toggleTag = (tagId: number) => {
    setTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((tid) => tid !== tagId) : [...prev, tagId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) return
    setSaving(true)
    try {
      const data = { title, content, excerpt, category_id: categoryId, tag_ids: tagIds, published }
      if (isEdit && articleId) {
        await updateArticle(articleId, data)
      } else {
        await createArticle(data)
      }
      navigate('/admin')
    } catch {
      alert('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-geek-text text-sm py-12 text-center"><span className="animate-pulse">&gt;</span> Loading...</div>
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-geek-text-h font-mono mb-6">
        {isEdit ? `Edit: ${title}` : 'New Article'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs text-geek-text font-mono mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-geek-surface border border-geek-border text-geek-text-h text-sm p-2.5 rounded-lg font-mono outline-none focus:border-geek-accent/40 transition-colors"
            placeholder="Article title..."
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs text-geek-text font-mono mb-1.5">Excerpt</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full bg-geek-surface border border-geek-border text-geek-text text-sm p-2.5 rounded-lg font-mono outline-none focus:border-geek-accent/40 transition-colors"
            placeholder="Brief description..."
          />
        </div>

        {/* Content — split-pane WYSIWYG */}
        <div>
          <label className="block text-xs text-geek-text font-mono mb-1.5">Content</label>
          <div className="grid grid-cols-2 gap-3" style={{ height: '500px' }}>
            {/* Editor */}
            <div className="overflow-hidden rounded-lg">
              <MarkdownEditor value={content} onChange={setContent} />
            </div>
            {/* Live preview */}
            <div className="prose max-w-none bg-geek-surface border border-geek-border rounded-lg p-4 overflow-y-auto">
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]}>
                  {content}
                </ReactMarkdown>
              ) : (
                <p className="text-geek-text/40 text-sm italic font-mono">Start typing to preview...</p>
              )}
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs text-geek-text font-mono mb-1.5">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(parseInt(e.target.value))}
              className="w-full bg-geek-surface border border-geek-border text-geek-text-h text-sm p-2.5 rounded-lg font-mono outline-none focus:border-geek-accent/40 transition-colors cursor-pointer"
            >
              <option value={0}>None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Published toggle */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 accent-geek-accent cursor-pointer"
              />
              <span className="text-xs text-geek-text font-mono">Published</span>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs text-geek-text font-mono mb-1.5">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`text-[11px] px-2.5 py-1 rounded border font-mono transition-colors cursor-pointer ${
                  tagIds.includes(tag.id)
                    ? 'border-geek-accent text-geek-accent bg-geek-accent-dim'
                    : 'border-geek-border text-geek-text hover:border-geek-text'
                }`}
              >
                {tagIds.includes(tag.id) ? '> ' : ''}{tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-geek-accent/15 border border-geek-accent/30 text-geek-accent text-sm font-mono hover:bg-geek-accent/25 disabled:opacity-40 transition-colors cursor-pointer"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2.5 rounded-lg border border-geek-border text-geek-text text-sm font-mono hover:text-geek-text-h transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
