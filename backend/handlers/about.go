package handlers

import (
	"net/http"

	"cogito-backend/database"
	"cogito-backend/models"

	"github.com/gin-gonic/gin"
)

func GetAbout(c *gin.Context) {
	var about models.About
	if err := database.DB.First(&about).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "about not found"})
		return
	}
	c.JSON(http.StatusOK, about)
}

func UpdateAbout(c *gin.Context) {
	var input models.About
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.About
	if err := database.DB.First(&existing).Error; err != nil {
		// Create new
		input.ID = 1
		if err := database.DB.Create(&input).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else {
		// Update existing
		input.ID = existing.ID
		if err := database.DB.Model(&existing).Updates(map[string]interface{}{
			"name":       input.Name,
			"title":      input.Title,
			"bio":        input.Bio,
			"github_url": input.GitHubURL,
			"email":      input.Email,
			"skills":     input.Skills,
			"timeline":   input.Timeline,
		}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	// Return updated
	database.DB.First(&existing)
	c.JSON(http.StatusOK, existing)
}
