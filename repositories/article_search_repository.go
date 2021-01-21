package repositories

import (
	"fmt"
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/internal"
	"github.com/jaeyo/personal-archive/models"
	"github.com/pkg/errors"
	"strconv"
	"strings"
	"sync"
)

type ArticleSearchRepository interface {
	Initialize() (bool, error)
	Index(article []*models.Article) error
	Insert(article *models.Article) error
	Update(article *models.Article) error
	Delete(id int64) error
	Deletes(ids []int64) error
	Search(keyword string) ([]int64, error)
}

type articleSearchRepository struct {
	database *internal.DB
}

var GetArticleSearchRepository = func() func() ArticleSearchRepository {
	var instance ArticleSearchRepository
	var once sync.Once

	return func() ArticleSearchRepository {
		once.Do(func() {
			instance = &articleSearchRepository{
				database: internal.GetDatabase(),
			}
		})
		return instance
	}
}()

func (r *articleSearchRepository) Initialize() (bool, error) {
	tables, err := r.database.Tables()
	if err != nil {
		return false, errors.Wrap(err, "failed to find tables")
	}

	if common.Strings(tables).Contain("article_search") {
		return false, nil
	}

	sqlDB, err := r.database.DB.DB()
	if err != nil {
		return false, err
	}
	if _, err := sqlDB.Exec("CREATE VIRTUAL TABLE article_search USING FTS5 (id, title, content)"); err != nil {
		return false, err
	}

	return true, nil
}
func (r *articleSearchRepository) Index(articles []*models.Article) error {
	for _, article := range articles {
		if err := r.Insert(article); err != nil {
			panic(err)
		}
	}

	return nil
}

func (r *articleSearchRepository) Insert(article *models.Article) error {
	return r.database.Exec("INSERT INTO article_search (id, title, content) VALUES (?, ?, ?)", article.ID, article.Title, article.Content).Error
}

func (r *articleSearchRepository) Update(article *models.Article) error {
	return r.database.Exec("UPDATE article_search SET title = ?, content = ? WHERE id = ?", article.Title, article.Content, article.ID).Error
}

func (r *articleSearchRepository) Delete(id int64) error {
	return r.database.Exec("DELETE FROM article_search WHERE id = ?", id).Error
}

func (r *articleSearchRepository) Deletes(ids []int64) error {
	return r.database.Exec("DELETE FROM article_search WHERE id IN ?", ids).Error
}

func (r *articleSearchRepository) Search(keyword string) ([]int64, error) {
	splited := strings.Split(keyword, " ")
	for i, word := range splited {
		splited[i] = fmt.Sprintf("%s*", word)
	}
	joined := strings.Join(splited, " + ")

	var results []*searchedID
	if err := r.database.
		Raw("SELECT id FROM article_search WHERE article_search MATCH ? ORDER BY rank", joined).
		Scan(&results).Error; err != nil {
		return nil, err
	}

	ids := []int64{}
	for _, result := range results {
		id, err := strconv.ParseInt(result.ID, 10, 64)
		if err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	return ids, nil
}

type searchedID struct {
	ID string
}
