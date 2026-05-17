import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAbout, updateAbout } from '../../api/client'
import type { About } from '../../types'

export default function AboutEditor() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [githubUrl, setGitHubUrl] = useState('')
  const [email, setEmail] = useState('')
  const [skills, setSkills] = useState('')
  const [timeline, setTimeline] = useState('')

  useEffect(() => {
    fetchAbout()
      .then((a: About) => {
        setName(a.name || '')
        setTitle(a.title || '')
        setBio(a.bio || '')
        setGitHubUrl(a.github_url || '')
        setEmail(a.email || '')
        setSkills(a.skills || '')
        setTimeline(a.timeline || '')
      })
      .catch(() => {
        // No about data yet — use defaults
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateAbout({ name, title, bio, github_url: githubUrl, email, skills, timeline } as About)
      navigate('/admin')
    } catch {
      alert('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-geek-text text-sm py-12 text-center">
        <span className="animate-pulse">&gt;</span> Loading...
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-geek-text-h font-mono mb-6">Edit About Page</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-geek-text font-mono mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-geek-surface border border-geek-border text-geek-text-h text-sm p-2.5 rounded-lg font-mono outline-none focus:border-geek-accent/40 transition-colors"
              placeholder="从传领"
            />
          </div>
          <div>
            <label className="block text-xs text-geek-text font-mono mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-geek-surface border border-geek-border text-geek-text-h text-sm p-2.5 rounded-lg font-mono outline-none focus:border-geek-accent/40 transition-colors"
              placeholder="Software Engineer"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-geek-text font-mono mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full bg-geek-surface border border-geek-border text-geek-text text-sm p-2.5 rounded-lg font-mono outline-none focus:border-geek-accent/40 transition-colors resize-none"
            placeholder="A brief introduction about yourself..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-geek-text font-mono mb-1.5">GitHub URL</label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGitHubUrl(e.target.value)}
              className="w-full bg-geek-surface border border-geek-border text-geek-text-h text-sm p-2.5 rounded-lg font-mono outline-none focus:border-geek-accent/40 transition-colors"
              placeholder="https://github.com/congchuanling"
            />
          </div>
          <div>
            <label className="block text-xs text-geek-text font-mono mb-1.5">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-geek-surface border border-geek-border text-geek-text-h text-sm p-2.5 rounded-lg font-mono outline-none focus:border-geek-accent/40 transition-colors"
              placeholder="congchuanling@gmail.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-geek-text font-mono mb-1.5">
            Skills <span className="text-geek-text/40">(JSON array of strings)</span>
          </label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            rows={4}
            className="w-full bg-geek-surface border border-geek-border text-geek-text text-sm p-2.5 rounded-lg font-mono outline-none focus:border-geek-accent/40 transition-colors"
            placeholder='["Go", "TypeScript", "React", "Python", "Rust"]'
          />
        </div>

        <div>
          <label className="block text-xs text-geek-text font-mono mb-1.5">
            Timeline <span className="text-geek-text/40">(JSON array of {`{ year, what }`} objects)</span>
          </label>
          <textarea
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            rows={6}
            className="w-full bg-geek-surface border border-geek-border text-geek-text text-sm p-2.5 rounded-lg font-mono outline-none focus:border-geek-accent/40 transition-colors"
            placeholder='[{"year":"2024","what":"Building Cogito"},{"year":"2023","what":"Senior backend engineer"}]'
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-geek-accent/15 border border-geek-accent/30 text-geek-accent text-sm font-mono hover:bg-geek-accent/25 disabled:opacity-40 transition-colors cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save About'}
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
