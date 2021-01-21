package repositories

import (
	"github.com/jaeyo/personal-archive/internal"
	"github.com/jaeyo/personal-archive/models"
	"sync"
)

type ArticleRepository interface {
	Save(article *models.Article) error
	FindAll() ([]*models.Article, error)
	FindAllWithPage(offset, limit int) ([]*models.Article, int64, error)
	FindByIDsWithPage(ids []int64, offset, limit int) ([]*models.Article, int64, error)
	GetByID(id int64) (*models.Article, error)
	FindByTagWithPage(tag string, offset, limit int) ([]*models.Article, int64, error)
	FindUntaggedWithPage(offset, limit int) ([]*models.Article, int64, error)
	GetUntaggedCount() (int64, error)
	GetAllCount() (int64, error)
	ExistByTitle(title string) (bool, error)
	DeleteByID(id int64) error
	DeleteByIDs(ids []int64) error
}

type articleRepository struct {
	database                *internal.DB
	articleSearchRepository ArticleSearchRepository
}

var GetArticleRepository = func() func() ArticleRepository {
	var instance ArticleRepository
	var once sync.Once

	return func() ArticleRepository {
		once.Do(func() {
			instance = &articleRepository{
				database:                internal.GetDatabase(),
				articleSearchRepository: GetArticleSearchRepository(),
			}
		})
		return instance
	}
}()

func (r *articleRepository) Save(article *models.Article) error {
	isInsert := article.ID == 0

	if err := r.database.Save(article).Error; err != nil {
		return err
	}

	if isInsert {
		return r.articleSearchRepository.Insert(article)
	} else {
		return r.articleSearchRepository.Update(article)
	}

}

func (r *articleRepository) FindAll() ([]*models.Article, error) {
	var articles []*models.Article
	if err := r.database.
		Preload("Tags").
		Order("created DESC").
		Find(&articles).Error; err != nil {
		return nil, err
	}

	return articles, nil
}

func (r *articleRepository) FindAllWithPage(offset, limit int) ([]*models.Article, int64, error) {
	var articles []*models.Article
	if err := r.database.
		Preload("Tags").
		Order("created DESC").
		Offset(offset).
		Limit(limit).
		Find(&articles).Error; err != nil {
		return nil, -1, err
	}

	var cnt int64
	if err := r.database.
		Model(&models.Article{}).
		Count(&cnt).Error; err != nil {
		return nil, -1, err
	}

	ensureTagsNotNil(articles)
	return articles, cnt, nil
}

func (r *articleRepository) FindByIDsWithPage(ids []int64, offset, limit int) ([]*models.Article, int64, error) {
	var articles []*models.Article
	if err := r.database.
		Preload("Tags").
		Where("id IN ?", ids).
		Offset(offset).
		Limit(limit).
		Find(&articles).Error; err != nil {
		return nil, -1, err
	}

	return articles, int64(len(ids)), nil
}

func (r *articleRepository) GetByID(id int64) (*models.Article, error) {
	var article models.Article
	err := r.database.
		Preload("Tags").
		First(&article, id).Error
	ensureTagsNotNil([]*models.Article{&article})
	return &article, err
}

func (r *articleRepository) FindByTagWithPage(tag string, offset, limit int) ([]*models.Article, int64, error) {
	var articles []*models.Article
	if err := r.database.
		Preload("Tags").
		Joins("JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.tag = ?", tag).
		Order("article.created DESC").
		Offset(offset).
		Limit(limit).
		Find(&articles).Error; err != nil {
		return nil, -1, err
	}

	var cnt int64
	if err := r.database.
		Model(&models.Article{}).
		Joins("JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.tag = ?", tag).
		Count(&cnt).Error; err != nil {
		return nil, -1, err
	}

	ensureTagsNotNil(articles)
	return articles, cnt, nil
}

func (r *articleRepository) FindUntaggedWithPage(offset, limit int) ([]*models.Article, int64, error) {
	var articles []*models.Article
	if err := r.database.
		Joins("LEFT JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.id IS NULL").
		Order("article.created DESC").
		Offset(offset).
		Limit(limit).
		Find(&articles).Error; err != nil {
		return nil, -1, err
	}

	var cnt int64
	if err := r.database.
		Model(&models.Article{}).
		Joins("LEFT JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.id IS NULL").
		Count(&cnt).Error; err != nil {
		return nil, -1, err
	}

	ensureTagsNotNil(articles)
	return articles, cnt, nil
}

func (r *articleRepository) GetUntaggedCount() (int64, error) {
	var cnt int64
	err := r.database.
		Model(&models.Article{}).
		Joins("LEFT JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.id IS NULL").
		Count(&cnt).Error
	return cnt, err
}

func (r *articleRepository) GetAllCount() (int64, error) {
	var cnt int64
	err := r.database.
		Model(&models.Article{}).
		Count(&cnt).Error
	return cnt, err
}

func (r *articleRepository) ExistByTitle(title string) (bool, error) {
	var cnt int64
	err := r.database.
		Model(&models.Article{}).
		Where("title = ?", title).
		Count(&cnt).Error
	return cnt > 0, err
}

func (r *articleRepository) DeleteByID(id int64) error {
	if err := r.database.Delete(&models.Article{}, id).Error; err != nil {
		return err
	}

	return r.articleSearchRepository.Delete(id)
}

func (r *articleRepository) DeleteByIDs(ids []int64) error {
	if err := r.database.Where("id IN ?", ids).Delete(&models.Article{}).Error; err != nil {
		return err
	}

	return r.articleSearchRepository.Deletes(ids)
}

func ensureTagsNotNil(articles []*models.Article) {
	for _, article := range articles {
		if article.Tags == nil {
			article.Tags = models.ArticleTags{}
		}
	}
}
