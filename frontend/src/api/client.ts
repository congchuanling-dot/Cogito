import type { Article, ArticleListResponse, Category, Tag } from '../types'

const BASE = import.meta.env.DEV ? 'http://localhost:9090/api' : '/api'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function fetchArticles(params: Record<string, string> = {}): Promise<ArticleListResponse> {
  const qs = new URLSearchParams(params).toString()
  return get<ArticleListResponse>(`/articles${qs ? `?${qs}` : ''}`)
}

export function fetchArticle(slug: string): Promise<Article> {
  return get<Article>(`/articles/${slug}`)
}

export function searchArticles(q: string): Promise<{ articles: Article[]; total: number }> {
  return get(`/search?q=${encodeURIComponent(q)}`)
}

export function fetchCategories(): Promise<Category[]> {
  return get('/categories')
}

export function fetchTags(): Promise<Tag[]> {
  return get('/tags')
}
