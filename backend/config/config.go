package config

import "os"

type Config struct {
	DSN string
	Port string
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9090"
	}

	dsn := os.Getenv("MYSQL_DSN")
	if dsn == "" {
		dsn = "root:123456@tcp(192.168.150.102:3306)/cogito?charset=utf8mb4&parseTime=True&loc=Local"
	}

	return &Config{Port: port, DSN: dsn}
}
