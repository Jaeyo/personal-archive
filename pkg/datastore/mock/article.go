package mock

import (
	"github.com/jaeyo/personal-archive/dtos"
	"github.com/jaeyo/personal-archive/models"
)

type ArticleDatastoreMock struct {
	OnSaveArticle                     func(article *models.Article) error
	OnFindArticleMetaWithPage         func(offset, limit int) (dtos.ArticleMetas, int64, error)
	OnFindArticleMetaByIDsWithPage    func(ids []int64, offset, limit int) (dtos.ArticleMetas, int64, error)
	OnFindArticleMetaByIDs            func(ids []int64) (dtos.ArticleMetas, error)
	OnGetArticleByID                  func(id int64) (*models.Article, error)
	OnGetArticleMetaByID              func(id int64) (*dtos.ArticleMeta, error)
	OnFindArticleMetaByTagWithPage    func(tag string, offset, limit int) (dtos.ArticleMetas, int64, error)
	OnFindArticleMetaUntaggedWithPage func(offset, limit int) (dtos.ArticleMetas, int64, error)
	OnGetArticleContentByID           func(id int64) (string, error)
	OnGetArticleUntaggedCount         func() (int64, error)
	OnGetArticleAllCount              func() (int64, error)
	OnExistArticleByTitle             func(title string) (bool, error)
	OnExistArticleByIDs               func(ids []int64) (bool, error)
	OnDeleteArticleByIDs              func(ids []int64) error
}

func (m *ArticleDatastoreMock) SaveArticle(article *models.Article) error {
	return m.OnSaveArticle(article)
}

func (m *ArticleDatastoreMock) FindArticleMetaWithPage(offset, limit int) (dtos.ArticleMetas, int64, error) {
	return m.OnFindArticleMetaWithPage(offset, limit)
}

func (m *ArticleDatastoreMock) FindArticleMetaByIDsWithPage(ids []int64, offset, limit int) (dtos.ArticleMetas, int64, error) {
	return m.OnFindArticleMetaByIDsWithPage(ids, offset, limit)
}

func (m *ArticleDatastoreMock) FindArticleMetaByIDs(ids []int64) (dtos.ArticleMetas, error) {
	return m.OnFindArticleMetaByIDs(ids)
}

func (m *ArticleDatastoreMock) GetArticleMetaByID(id int64) (*dtos.ArticleMeta, error) {
	return m.OnGetArticleMetaByID(id)
}

func (m *ArticleDatastoreMock) GetArticleByID(id int64) (*models.Article, error) {
	return m.OnGetArticleByID(id)
}

func (m *ArticleDatastoreMock) FindArticleMetaByTagWithPage(tag string, offset, limit int) (dtos.ArticleMetas, int64, error) {
	return m.OnFindArticleMetaByTagWithPage(tag, offset, limit)
}

func (m *ArticleDatastoreMock) FindArticleMetaUntaggedWithPage(offset, limit int) (dtos.ArticleMetas, int64, error) {
	return m.OnFindArticleMetaUntaggedWithPage(offset, limit)
}

func (m *ArticleDatastoreMock) GetArticleContentByID(id int64) (string, error) {
	return m.OnGetArticleContentByID(id)
}

func (m *ArticleDatastoreMock) GetArticleUntaggedCount() (int64, error) {
	return m.OnGetArticleUntaggedCount()
}

func (m *ArticleDatastoreMock) GetArticleAllCount() (int64, error) {
	return m.OnGetArticleAllCount()
}

func (m *ArticleDatastoreMock) ExistArticleByTitle(title string) (bool, error) {
	return m.OnExistArticleByTitle(title)
}

func (m *ArticleDatastoreMock) ExistArticleByIDs(ids []int64) (bool, error) {
	return m.OnExistArticleByIDs(ids)
}

func (m *ArticleDatastoreMock) DeleteArticleByIDs(ids []int64) error {
	return m.OnDeleteArticleByIDs(ids)
}
