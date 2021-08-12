package repositories

import (
	"github.com/jaeyo/personal-archive/dtos"
	"github.com/jaeyo/personal-archive/internal"
	"github.com/jaeyo/personal-archive/models"
	"sync"
)

type ArticleRepository interface {
	Save(article *models.Article) error
	FindMetaWithPage(offset, limit int) (dtos.ArticleMetas, int64, error)
	FindMetaByIDsWithPage(ids []int64, offset, limit int) (dtos.ArticleMetas, int64, error)
	FindMetaByIDs(ids []int64) (dtos.ArticleMetas, error)
	GetMetaByID(id int64) (*dtos.ArticleMeta, error)
	GetByID(id int64) (*models.Article, error)
	FindMetaByTagWithPage(tag string, offset, limit int) (dtos.ArticleMetas, int64, error)
	FindMetaUntaggedWithPage(offset, limit int) (dtos.ArticleMetas, int64, error)
	GetContentByID(id int64) (string, error)
	GetUntaggedCount() (int64, error)
	GetAllCount() (int64, error)
	ExistByTitle(title string) (bool, error)
	ExistByIDs(ids []int64) (bool, error)
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

func (r *articleRepository) FindMetaWithPage(offset, limit int) (dtos.ArticleMetas, int64, error) {
	var articleMetas []*dtos.ArticleMeta
	if err := r.database.
		Preload("Tags").
		Order("created DESC").
		Offset(offset).
		Limit(limit).
		Find(&articleMetas).Error; err != nil {
		return nil, -1, err
	}

	var cnt int64
	if err := r.database.
		Model(&dtos.ArticleMeta{}).
		Count(&cnt).Error; err != nil {
		return nil, -1, err
	}

	ensureArticleMetaAssociationNotNil(articleMetas)
	return articleMetas, cnt, nil
}

func (r *articleRepository) FindMetaByIDsWithPage(ids []int64, offset, limit int) (dtos.ArticleMetas, int64, error) {
	if len(ids) == 0 {
		return []*dtos.ArticleMeta{}, 0, nil
	}

	var articleMetas []*dtos.ArticleMeta
	if err := r.database.
		Preload("Tags").
		Order("created DESC").
		Where("id IN ?", ids).
		Offset(offset).
		Limit(limit).
		Find(&articleMetas).Error; err != nil {
		return nil, -1, err
	}

	ensureArticleMetaAssociationNotNil(articleMetas)
	return articleMetas, int64(len(ids)), nil
}

func (r *articleRepository) FindMetaByIDs(ids []int64) (dtos.ArticleMetas, error) {
	if len(ids) == 0 {
		return []*dtos.ArticleMeta{}, nil
	}

	var articleMetas []*dtos.ArticleMeta
	if err := r.database.
		Preload("Tags").
		Where("id IN ?", ids).
		Find(&articleMetas).Error; err != nil {
		return nil, err
	}

	ensureArticleMetaAssociationNotNil(articleMetas)
	return articleMetas, nil
}

func (r *articleRepository) GetMetaByID(id int64) (*dtos.ArticleMeta, error) {
	var articleMeta dtos.ArticleMeta
	err := r.database.
		Preload("Tags").
		First(&articleMeta, id).Error
	ensureArticleMetaAssociationNotNil([]*dtos.ArticleMeta{&articleMeta})
	return &articleMeta, err
}

func (r *articleRepository) GetByID(id int64) (*models.Article, error) {
	var article models.Article
	err := r.database.
		Preload("Tags").
		First(&article, id).Error
	ensureArticleAssociationNotNil([]*models.Article{&article})
	return &article, err
}

func (r *articleRepository) FindMetaByTagWithPage(tag string, offset, limit int) (dtos.ArticleMetas, int64, error) {
	var articleMetas []*dtos.ArticleMeta
	if err := r.database.
		Preload("Tags").
		Joins("JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.tag = ?", tag).
		Order("article.created DESC").
		Offset(offset).
		Limit(limit).
		Find(&articleMetas).Error; err != nil {
		return nil, -1, err
	}

	var cnt int64
	if err := r.database.
		Model(&dtos.ArticleMeta{}).
		Joins("JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.tag = ?", tag).
		Count(&cnt).Error; err != nil {
		return nil, -1, err
	}

	ensureArticleMetaAssociationNotNil(articleMetas)
	return articleMetas, cnt, nil
}

func (r *articleRepository) FindMetaUntaggedWithPage(offset, limit int) (dtos.ArticleMetas, int64, error) {
	var articleMetas []*dtos.ArticleMeta
	if err := r.database.
		Joins("LEFT JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.id IS NULL").
		Order("article.created DESC").
		Offset(offset).
		Limit(limit).
		Find(&articleMetas).Error; err != nil {
		return nil, -1, err
	}

	var cnt int64
	if err := r.database.
		Model(&dtos.ArticleMeta{}).
		Joins("LEFT JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.id IS NULL").
		Count(&cnt).Error; err != nil {
		return nil, -1, err
	}

	ensureArticleMetaAssociationNotNil(articleMetas)
	return articleMetas, cnt, nil
}

func (r *articleRepository) GetContentByID(id int64) (string, error) {
	type Result struct {
		Content string
	}
	var result Result

	if err := r.database.
		Model(&models.Article{}).
		Where("id = ?", id).
		Select("content").
		Find(&result).Error; err != nil {
		return "", err
	}

	return result.Content, nil
}

func (r *articleRepository) GetUntaggedCount() (int64, error) {
	var cnt int64
	err := r.database.
		Model(&dtos.ArticleMeta{}).
		Joins("LEFT JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.id IS NULL").
		Count(&cnt).Error
	return cnt, err
}

func (r *articleRepository) GetAllCount() (int64, error) {
	var cnt int64
	err := r.database.
		Model(&dtos.ArticleMeta{}).
		Count(&cnt).Error
	return cnt, err
}

func (r *articleRepository) ExistByTitle(title string) (bool, error) {
	var cnt int64
	err := r.database.
		Model(&dtos.ArticleMeta{}).
		Where("title = ?", title).
		Count(&cnt).Error
	return cnt > 0, err
}

func (r *articleRepository) ExistByIDs(ids []int64) (bool, error) {
	var cnt int64
	err := r.database.
		Model(&dtos.ArticleMeta{}).
		Where("id IN ?", ids).
		Count(&cnt).Error
	return cnt == int64(len(ids)), err
}

func (r *articleRepository) DeleteByIDs(ids []int64) error {
	if err := r.database.Where("id IN ?", ids).Delete(&models.Article{}).Error; err != nil {
		return err
	}

	return r.articleSearchRepository.Deletes(ids)
}

func ensureArticleMetaAssociationNotNil(articleMetas []*dtos.ArticleMeta) {
	for _, articleMeta := range articleMetas {
		if articleMeta.Tags == nil {
			articleMeta.Tags = models.ArticleTags{}
		}
	}
}

func ensureArticleAssociationNotNil(articles []*models.Article) {
	for _, article := range articles {
		if article.Tags == nil {
			article.Tags = models.ArticleTags{}
		}
	}
}
