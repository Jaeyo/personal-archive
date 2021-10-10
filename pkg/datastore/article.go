package datastore

import (
	"github.com/jaeyo/personal-archive/dtos"
	"github.com/jaeyo/personal-archive/models"
)

type ArticleDatastore interface {
	SaveArticle(article *models.Article) error
	FindArticleMetaWithPage(offset, limit int) (dtos.ArticleMetas, int64, error)
	FindArticleMetaByIDsWithPage(ids []int64, offset, limit int) (dtos.ArticleMetas, int64, error)
	FindArticleMetaByIDs(ids []int64) (dtos.ArticleMetas, error)
	GetArticleMetaByID(id int64) (*dtos.ArticleMeta, error)
	GetArticleByID(id int64) (*models.Article, error)
	FindArticleMetaByTagWithPage(tag string, offset, limit int) (dtos.ArticleMetas, int64, error)
	FindArticleMetaUntaggedWithPage(offset, limit int) (dtos.ArticleMetas, int64, error)
	GetArticleContentByID(id int64) (string, error)
	GetArticleUntaggedCount() (int64, error)
	GetArticleAllCount() (int64, error)
	ExistArticleByTitle(title string) (bool, error)
	ExistArticleByIDs(ids []int64) (bool, error)
	DeleteArticleByIDs(ids []int64) error
}

func (d *Datastore) SaveArticle(article *models.Article) error {
	isInsert := article.ID == 0

	if err := d.database.Save(article).Error; err != nil {
		return err
	}

	if isInsert {
		return d.InsertArticleSearch(article)
	} else {
		return d.UpdateArticleSearch(article)
	}
}

func (d *Datastore) FindArticleMetaWithPage(offset, limit int) (dtos.ArticleMetas, int64, error) {
	var articleMetas []*dtos.ArticleMeta
	if err := d.database.
		Preload("Tags").
		Order("created DESC").
		Offset(offset).
		Limit(limit).
		Find(&articleMetas).Error; err != nil {
		return nil, -1, err
	}

	var cnt int64
	if err := d.database.
		Model(&dtos.ArticleMeta{}).
		Count(&cnt).Error; err != nil {
		return nil, -1, err
	}

	ensureArticleMetaAssociationNotNil(articleMetas)
	return articleMetas, cnt, nil
}

func (d *Datastore) FindArticleMetaByIDsWithPage(ids []int64, offset, limit int) (dtos.ArticleMetas, int64, error) {
	if len(ids) == 0 {
		return []*dtos.ArticleMeta{}, 0, nil
	}

	var articleMetas []*dtos.ArticleMeta
	if err := d.database.
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

func (d *Datastore) FindArticleMetaByIDs(ids []int64) (dtos.ArticleMetas, error) {
	if len(ids) == 0 {
		return []*dtos.ArticleMeta{}, nil
	}

	var articleMetas []*dtos.ArticleMeta
	if err := d.database.
		Preload("Tags").
		Where("id IN ?", ids).
		Find(&articleMetas).Error; err != nil {
		return nil, err
	}

	ensureArticleMetaAssociationNotNil(articleMetas)
	return articleMetas, nil
}

func (d *Datastore) GetArticleMetaByID(id int64) (*dtos.ArticleMeta, error) {
	var articleMeta dtos.ArticleMeta
	err := d.database.
		Preload("Tags").
		First(&articleMeta, id).Error
	ensureArticleMetaAssociationNotNil([]*dtos.ArticleMeta{&articleMeta})
	return &articleMeta, err
}

func (d *Datastore) GetArticleByID(id int64) (*models.Article, error) {
	var article models.Article
	err := d.database.
		Preload("Tags").
		First(&article, id).Error
	ensureArticleAssociationNotNil([]*models.Article{&article})
	return &article, err
}

func (d *Datastore) FindArticleMetaByTagWithPage(tag string, offset, limit int) (dtos.ArticleMetas, int64, error) {
	var articleMetas []*dtos.ArticleMeta
	if err := d.database.
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
	if err := d.database.
		Model(&dtos.ArticleMeta{}).
		Joins("JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.tag = ?", tag).
		Count(&cnt).Error; err != nil {
		return nil, -1, err
	}

	ensureArticleMetaAssociationNotNil(articleMetas)
	return articleMetas, cnt, nil
}

func (d *Datastore) FindArticleMetaUntaggedWithPage(offset, limit int) (dtos.ArticleMetas, int64, error) {
	var articleMetas []*dtos.ArticleMeta
	if err := d.database.
		Joins("LEFT JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.id IS NULL").
		Order("article.created DESC").
		Offset(offset).
		Limit(limit).
		Find(&articleMetas).Error; err != nil {
		return nil, -1, err
	}

	var cnt int64
	if err := d.database.
		Model(&dtos.ArticleMeta{}).
		Joins("LEFT JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.id IS NULL").
		Count(&cnt).Error; err != nil {
		return nil, -1, err
	}

	ensureArticleMetaAssociationNotNil(articleMetas)
	return articleMetas, cnt, nil
}

func (d *Datastore) GetArticleContentByID(id int64) (string, error) {
	type Result struct {
		Content string
	}
	var result Result

	if err := d.database.
		Model(&models.Article{}).
		Where("id = ?", id).
		Select("content").
		Find(&result).Error; err != nil {
		return "", err
	}

	return result.Content, nil
}

func (d *Datastore) GetArticleUntaggedCount() (int64, error) {
	var cnt int64
	err := d.database.
		Model(&dtos.ArticleMeta{}).
		Joins("LEFT JOIN article_tag ON article_tag.article_id = article.id").
		Where("article_tag.id IS NULL").
		Count(&cnt).Error
	return cnt, err
}

func (d *Datastore) GetArticleAllCount() (int64, error) {
	var cnt int64
	err := d.database.
		Model(&dtos.ArticleMeta{}).
		Count(&cnt).Error
	return cnt, err
}

func (d *Datastore) ExistArticleByTitle(title string) (bool, error) {
	var cnt int64
	err := d.database.
		Model(&dtos.ArticleMeta{}).
		Where("title = ?", title).
		Count(&cnt).Error
	return cnt > 0, err
}

func (d *Datastore) ExistArticleByIDs(ids []int64) (bool, error) {
	var cnt int64
	err := d.database.
		Model(&dtos.ArticleMeta{}).
		Where("id IN ?", ids).
		Count(&cnt).Error
	return cnt == int64(len(ids)), err
}

func (d *Datastore) DeleteArticleByIDs(ids []int64) error {
	if err := d.database.Where("id IN ?", ids).Delete(&models.Article{}).Error; err != nil {
		return err
	}

	return d.DeleteArticleSearches(ids)
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

