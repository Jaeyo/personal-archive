package internal

import (
	"fmt"
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/models"
	"github.com/pkg/errors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"os"
	"sync"
	_ "github.com/mattn/go-sqlite3"
)

type DB struct {
	*gorm.DB
}

var GetDatabase = func() func() *DB {
	var instance *DB
	var once sync.Once

	return func() *DB {
		once.Do(func() {
			dbDir := "/data"
			if common.IsLocal() {
				dbDir = "./test_data"
			}
			ensureDirExist(dbDir)
			dbPath := fmt.Sprintf("%s/personal-archive.db", dbDir)

			db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
			if err != nil {
				panic(err)
			}

			instance = &DB{db}
		})
		return instance
	}
}()

func (d *DB) Init() error {
	if err := d.AutoMigrate(&models.Article{}, &models.ArticleTag{}); err != nil {
		return errors.Wrap(err, "failed to auto migrate")
	}
	return nil
}

func (d *DB) Tables() ([]string, error) {
	rows, err := d.Raw("SELECT name FROM sqlite_master").Rows()
	if err != nil {
		return nil, err
	}

	cols, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	tables := []string{}
	for rows.Next() {
		columns := make([]string, len(cols))
		columnPtrs := make([]interface{}, len(cols))
		for i, _ := range columns {
			columnPtrs[i] = &columns[i]
		}
		if err := rows.Scan(columnPtrs...); err != nil {
			return nil, err
		}
		tables = append(tables, columns[0])
	}

	return tables, nil
}

func ensureDirExist(dirPath string) {
	if _, err := os.Stat(dirPath); err != nil {
		if err := os.MkdirAll(dirPath, 0755); err != nil {
			panic(err)
		}
	}
}
