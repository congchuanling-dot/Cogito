package main

import (
	"log"
	"os"
	"path/filepath"

	"cogito-backend/config"
	"cogito-backend/database"
	"cogito-backend/handlers"
	"cogito-backend/middleware"
	"cogito-backend/models"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()
	database.Init(cfg.DBPath)

	seed()

	r := gin.Default()
	r.Use(middleware.CORS())

	api := r.Group("/api")
	{
		api.GET("/articles", handlers.ListArticles)
		api.GET("/articles/:slug", handlers.GetArticle)
		api.POST("/articles", handlers.CreateArticle)
		api.PUT("/articles/:id", handlers.UpdateArticle)
		api.DELETE("/articles/:id", handlers.DeleteArticle)
		api.GET("/search", handlers.SearchArticles)
		api.GET("/categories", handlers.ListCategories)
		api.GET("/tags", handlers.ListTags)
	}

	// Serve React build in production
	staticPath := "../frontend/dist"
	if _, err := os.Stat(staticPath); err == nil {
		r.NoRoute(func(c *gin.Context) {
			c.File(filepath.Join(staticPath, "index.html"))
		})
		r.Static("/assets", filepath.Join(staticPath, "assets"))
	}

	log.Printf("server starting on :%s", cfg.Port)
	r.Run(":" + cfg.Port)
}

func seed() {
	var count int64
	database.DB.Model(&models.Article{}).Where("published = ?", true).Count(&count)
	if count > 0 {
		return
	}

	cat := models.Category{Name: "Tech", Slug: "tech"}
	tag1 := models.Tag{Name: "Go", Slug: "go"}
	tag2 := models.Tag{Name: "React", Slug: "react"}
	tag3 := models.Tag{Name: "Architecture", Slug: "architecture"}

	database.DB.Create(&cat)
	database.DB.Create(&tag1)
	database.DB.Create(&tag2)
	database.DB.Create(&tag3)

	database.DB.Create(&models.Article{
		Title:      "Hello, World — Welcome to My Geek Corner",
		Slug:       "hello-world-welcome-to-my-geek-corner",
		Content:    "This is your personal homepage. Write your thoughts, share your code, and build your digital garden.\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, Geek!\")\n}\n```\n\nStay curious, keep hacking.",
		Excerpt:    "Welcome to my geek corner. This is where I share thoughts on code, architecture, and the craft of software.",
		CategoryID: cat.ID,
		Tags:       []models.Tag{tag1, tag3},
		Published:  true,
	})

	database.DB.Create(&models.Article{
		Title:      "Building a Personal Site with React and Go",
		Slug:       "building-a-personal-site-with-react-and-go",
		Content:    "Here's how I built this site from scratch using React for the frontend and Go for the backend.\n\n## Architecture\n\n- **Frontend**: React + TypeScript + Vite + Tailwind CSS\n- **Backend**: Go + Gin + GORM + SQLite\n\n## Why this stack?\n\n1. **Go** is fast, simple, and perfect for REST APIs\n2. **React** gives us component-based UI with a rich ecosystem\n3. **SQLite** means zero-config deployment — no separate database server\n\n```tsx\n// A simple React component\nfunction App() {\n  return <h1>Hello, World!</h1>;\n}\n```\n\nThat's the beauty of it — simple tools, powerful results.",
		Excerpt:    "How I built this personal site from scratch using React for frontend and Go for backend.",
		CategoryID: cat.ID,
		Tags:       []models.Tag{tag2, tag3},
		Published:  true,
	})

	database.DB.Create(&models.Article{
		Title:      "Why I Love Monospace Fonts",
		Slug:       "why-i-love-monospace-fonts",
		Content:    "There's something about monospace fonts that just feels right for a developer's personal site.\n\n## The aesthetic\n\nEvery character takes the same width. Every line aligns perfectly. Code blocks look natural. Text has a rhythm.\n\n## My favorites\n\n- **JetBrains Mono** — clean, modern, with ligatures\n- **Fira Code** — great ligature support\n- **Cascadia Code** — Microsoft's take, excellent readability\n- **IBM Plex Mono** — classic, serious, highly legible\n\n> \"In a world of proportional fonts, be monospace.\" — some developer, probably\n\nFor this site, I chose JetBrains Mono as the primary typeface. It gives the site that terminal-like, hacker aesthetic without being gimmicky.",
		Excerpt:    "Monospace fonts give a developer's personal site that perfect terminal-like aesthetic.",
		CategoryID: cat.ID,
		Tags:       []models.Tag{tag3},
		Published:  true,
	})

	log.Println("seed data created")
}
