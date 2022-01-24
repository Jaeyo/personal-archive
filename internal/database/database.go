package database

import (
	"fmt"
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/models"
	_ "github.com/mattn/go-sqlite3"
	"github.com/pkg/errors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"os"
	"strconv"
	"strings"
)

type DB struct {
	*gorm.DB
}

func New() *DB {
	dbDir := "/data"
	if common.IsLocal() {
		dbDir = "./test_data"
	}
	ensureDirExist(dbDir)
	dbPath := fmt.Sprintf("%s/personal-archive.db", dbDir)

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{Logger: logger.Discard})
	if err != nil {
		panic(err)
	}

	return &DB{db}
}

func (d *DB) Init() error {
	if err := d.AutoMigrate(
		&models.Article{},
		&models.ArticleTag{},
		&models.Misc{},
		&models.Note{},
		&models.Paragraph{},
		&models.ReferenceArticle{},
		&models.ReferenceWeb{},
	); err != nil {
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

func (d *DB) SearchIDs(table, keyword string) ([]int64, error) {
	var results []*searchedID
	query := fmt.Sprintf("SELECT id FROM %s WHERE %s MATCH ? ORDER BY rank", table, table)
	if err := d.
		Raw(query, refineSearchKeyword(keyword)).
		Scan(&results).Error; err != nil {
		return nil, err
	}

	return common.MapWithErr(results, func(result *searchedID) (int64, error) {
		return strconv.ParseInt(result.ID, 10, 64)
	})
}

func ensureDirExist(dirPath string) {
	if _, err := os.Stat(dirPath); err != nil {
		if err := os.MkdirAll(dirPath, 0755); err != nil {
			panic(err)
		}
	}
}

func refineSearchKeyword(keyword string) string {
	splited := strings.Split(keyword, " ")
	for i, word := range splited {
		splited[i] = fmt.Sprintf("%s*", word)
	}
	return strings.Join(splited, " + ")
}

type searchedID struct {
	ID string
}
