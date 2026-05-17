package models

import (
	"time"

	"gorm.io/gorm"
)

type Category struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	Name      string         `gorm:"size:100;not null" json:"name"`
	Slug      string         `gorm:"size:100;uniqueIndex;not null" json:"slug"`
	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Tag struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	Name      string         `gorm:"size:100;not null" json:"name"`
	Slug      string         `gorm:"size:100;uniqueIndex;not null" json:"slug"`
	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Article struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	Title      string         `gorm:"size:255;not null" json:"title"`
	Slug       string         `gorm:"size:255;uniqueIndex;not null" json:"slug"`
	Content    string         `gorm:"type:text;not null" json:"content"`
	Excerpt    string         `gorm:"size:500" json:"excerpt"`
	CategoryID *uint          `json:"category_id"`
	Category   *Category      `gorm:"foreignKey:CategoryID;references:ID;constraint:false" json:"category,omitempty"`
	Tags       []Tag          `gorm:"many2many:article_tags;foreignKey:ID;joinForeignKey:ArticleID;references:ID;joinReferences:TagID;constraint:false" json:"tags,omitempty"`
	Published  bool           `gorm:"default:false" json:"published"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
