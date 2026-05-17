package router

import (
	"os"
	"path/filepath"

	"cogito-backend/handlers"
	"cogito-backend/middleware"

	"github.com/gin-gonic/gin"
)

func Setup() *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CORS())

	api := r.Group("/api")
	{
		api.GET("/articles", handlers.ListArticles)
		api.GET("/articles/:slug", handlers.GetArticle)
		api.GET("/articles/:slug/neighbors", handlers.GetArticleNeighbors)
		api.POST("/articles", handlers.CreateArticle)
		api.PUT("/articles/:id", handlers.UpdateArticle)
		api.DELETE("/articles/:id", handlers.DeleteArticle)
		api.GET("/search", handlers.SearchArticles)
		api.GET("/about", handlers.GetAbout)
		api.PUT("/about", handlers.UpdateAbout)
		api.GET("/categories", handlers.ListCategories)
		api.GET("/tags", handlers.ListTags)
	}

	staticPath := "../frontend/dist"
	if _, err := os.Stat(staticPath); err == nil {
		r.NoRoute(func(c *gin.Context) {
			c.File(filepath.Join(staticPath, "index.html"))
		})
		r.Static("/assets", filepath.Join(staticPath, "assets"))
	}

	return r
}
