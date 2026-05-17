export interface Category {
  id: number
  name: string
  slug: string
  created_at: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  created_at: string
}

export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  category_id: number
  category: Category | null
  tags: Tag[]
  published: boolean
  created_at: string
  updated_at: string
}

export interface ArticleListResponse {
  articles: Article[]
  total: number
  page: number
  limit: number
}
