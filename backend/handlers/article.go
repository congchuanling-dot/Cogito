package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"cogito-backend/database"
	"cogito-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/gosimple/slug"
)

func ListArticles(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	categorySlug := c.Query("category")
	tagSlug := c.Query("tag")

	query := database.DB.Model(&models.Article{}).Where("published = ?", true)

	if categorySlug != "" {
		var cat models.Category
		if err := database.DB.Where("slug = ?", categorySlug).First(&cat).Error; err == nil {
			query = query.Where("category_id = ?", cat.ID)
		}
	}
	if tagSlug != "" {
		var tag models.Tag
		if err := database.DB.Where("slug = ?", tagSlug).First(&tag).Error; err == nil {
			query = query.
				Joins("JOIN article_tags ON article_tags.article_id = articles.id").
				Where("article_tags.tag_id = ?", tag.ID)
		}
	}

	var total int64
	query.Count(&total)

	var articles []models.Article
	offset := (page - 1) * limit
	query.
		Preload("Category").
		Preload("Tags").
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&articles)

	c.JSON(http.StatusOK, gin.H{
		"articles": articles,
		"total":    total,
		"page":     page,
		"limit":    limit,
	})
}

func GetArticle(c *gin.Context) {
	slug := c.Param("slug")
	var article models.Article
	if err := database.DB.
		Where("slug = ? AND published = ?", slug, true).
		Preload("Category").
		Preload("Tags").
		First(&article).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}
	c.JSON(http.StatusOK, article)
}

type CreateArticleInput struct {
	Title      string `json:"title" binding:"required"`
	Content    string `json:"content" binding:"required"`
	Excerpt    string `json:"excerpt"`
	CategoryID *uint  `json:"category_id"`
	TagIDs     []uint `json:"tag_ids"`
	Published  bool   `json:"published"`
}

func CreateArticle(c *gin.Context) {
	var input CreateArticleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	articleSlug := uniqueSlug(slug.Make(input.Title))

	article := models.Article{
		Title:     input.Title,
		Slug:      articleSlug,
		Content:   input.Content,
		Excerpt:   input.Excerpt,
		Published: input.Published,
	}
	if input.CategoryID != nil && *input.CategoryID > 0 {
		article.CategoryID = input.CategoryID
	}

	if len(input.TagIDs) > 0 {
		var tags []models.Tag
		database.DB.Where("id IN ?", input.TagIDs).Find(&tags)
		article.Tags = tags
	}

	if err := database.DB.Create(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create article"})
		return
	}

	database.DB.Preload("Category").Preload("Tags").First(&article, article.ID)
	c.JSON(http.StatusCreated, article)
}

type UpdateArticleInput struct {
	Title      string `json:"title"`
	Content    string `json:"content"`
	Excerpt    string `json:"excerpt"`
	CategoryID *uint  `json:"category_id"`
	TagIDs     []uint `json:"tag_ids"`
	Published  *bool  `json:"published"`
}

func UpdateArticle(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var article models.Article
	if err := database.DB.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}

	var input UpdateArticleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{}
	if input.Title != "" {
		updates["title"] = input.Title
		updates["slug"] = uniqueSlug(slug.Make(input.Title))
	}
	if input.Content != "" {
		updates["content"] = input.Content
	}
	if input.Excerpt != "" {
		updates["excerpt"] = input.Excerpt
	}
	if input.CategoryID != nil {
		updates["category_id"] = *input.CategoryID
	}
	if input.Published != nil {
		updates["published"] = *input.Published
	}

	database.DB.Model(&article).Updates(updates)

	if input.TagIDs != nil {
		var tags []models.Tag
		database.DB.Where("id IN ?", input.TagIDs).Find(&tags)
		database.DB.Model(&article).Association("Tags").Replace(tags)
	}

	database.DB.Preload("Category").Preload("Tags").First(&article, id)
	c.JSON(http.StatusOK, article)
}

func DeleteArticle(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var article models.Article
	if err := database.DB.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}
	database.DB.Select("Tags").Delete(&article)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

func SearchArticles(c *gin.Context) {
	q := c.Query("q")
	if q == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "query required"})
		return
	}

	var articles []models.Article
	pattern := "%" + q + "%"
	database.DB.
		Where("published = ?", true).
		Where("title LIKE ? OR content LIKE ?", pattern, pattern).
		Preload("Category").
		Preload("Tags").
		Order("created_at DESC").
		Limit(20).
		Find(&articles)

	c.JSON(http.StatusOK, gin.H{"articles": articles, "total": len(articles)})
}

func uniqueSlug(base string) string {
	s := base
	for i := 2; ; i++ {
		var count int64
		database.DB.Unscoped().Model(&models.Article{}).Where("slug = ?", s).Count(&count)
		if count == 0 {
			return s
		}
		s = slug.Make(fmt.Sprintf("%s-%d", base, i))
	}
}
