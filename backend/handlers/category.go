package handlers

import (
	"net/http"

	"cogito-backend/database"
	"cogito-backend/models"

	"github.com/gin-gonic/gin"
)

func ListCategories(c *gin.Context) {
	var categories []models.Category
	database.DB.Order("name ASC").Find(&categories)
	c.JSON(http.StatusOK, categories)
}

func ListTags(c *gin.Context) {
	var tags []models.Tag
	database.DB.Order("name ASC").Find(&tags)
	c.JSON(http.StatusOK, tags)
}
