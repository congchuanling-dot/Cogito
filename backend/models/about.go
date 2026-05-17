package models

import "time"

type About struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	Name      string    `gorm:"size:255" json:"name"`
	Title     string    `gorm:"size:255" json:"title"`
	Bio       string    `gorm:"type:text" json:"bio"`
	GitHubURL string    `gorm:"size:500" json:"github_url"`
	Email     string    `gorm:"size:255" json:"email"`
	Skills    string    `gorm:"type:text" json:"skills"`
	Timeline  string    `gorm:"type:text" json:"timeline"`
	UpdatedAt time.Time `json:"updated_at"`
}
