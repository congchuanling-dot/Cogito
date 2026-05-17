package database

import (
	"log"

	"cogito-backend/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Init(dsn string) {
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("failed to connect MySQL: %v", err)
	}

	if err := DB.AutoMigrate(&models.Category{}, &models.Tag{}, &models.Article{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	log.Println("MySQL connected and migrated")
}
