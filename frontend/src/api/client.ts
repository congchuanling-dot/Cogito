import type { Article, ArticleListResponse, Category, Tag } from '../types'

const BASE = import.meta.env.DEV ? 'http://localhost:9090/api' : '/api'

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function fetchArticles(params: Record<string, string> = {}): Promise<ArticleListResponse> {
  const qs = new URLSearchParams(params).toString()
  return request('GET', `/articles${qs ? `?${qs}` : ''}`)
}

export function fetchArticle(slug: string): Promise<Article> {
  return request('GET', `/articles/${slug}`)
}

export function searchArticles(q: string): Promise<{ articles: Article[]; total: number }> {
  return request('GET', `/search?q=${encodeURIComponent(q)}`)
}

export function fetchCategories(): Promise<Category[]> {
  return request('GET', '/categories')
}

export function fetchTags(): Promise<Tag[]> {
  return request('GET', '/tags')
}

// Admin
export function createArticle(data: {
  title: string
  content: string
  excerpt: string
  category_id: number
  tag_ids: number[]
  published: boolean
}): Promise<Article> {
  return request('POST', '/articles', data)
}

export function updateArticle(id: number, data: {
  title?: string
  content?: string
  excerpt?: string
  category_id?: number
  tag_ids?: number[]
  published?: boolean
}): Promise<Article> {
  return request('PUT', `/articles/${id}`, data)
}

export function deleteArticle(id: number): Promise<void> {
  return request('DELETE', `/articles/${id}`)
}
