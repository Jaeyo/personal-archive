package datastore

import (
	"github.com/jaeyo/personal-archive/internal/database"
)

type Datastore struct {
	database *database.DB
}

func New() *Datastore {
	return &Datastore{
		database: database.New(),
	}
}

func (d *Datastore) Init() error {
	return d.database.Init()
}
