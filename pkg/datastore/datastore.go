package datastore

import (
	"github.com/jaeyo/personal-archive/internal/database"
)

type Datastore struct {
	database *database.DB
}

func New() *Datastore {
	d := &Datastore{
		database: database.New(),
	}

	if err := d.Init(); err != nil {
		panic(err)
	}

	return d
}

func (d *Datastore) Init() error {
	return d.database.Init()
}
