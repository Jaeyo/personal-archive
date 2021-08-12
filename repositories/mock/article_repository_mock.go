package mock

import (
	"github.com/jaeyo/personal-archive/dtos"
	"github.com/jaeyo/personal-archive/models"
)

type ArticleRepositoryMock struct {
	OnSave                     func(article *models.Article) error
	OnFindMetaWithPage         func(offset, limit int) (dtos.ArticleMetas, int64, error)
	OnFindMetaByIDsWithPage    func(ids []int64, offset, limit int) (dtos.ArticleMetas, int64, error)
	OnFindMetaByIDs            func(ids []int64) (dtos.ArticleMetas, error)
	OnGetByID                  func(id int64) (*models.Article, error)
	OnGetMetaByID              func(id int64) (*dtos.ArticleMeta, error)
	OnFindMetaByTagWithPage    func(tag string, offset, limit int) (dtos.ArticleMetas, int64, error)
	OnFindMetaUntaggedWithPage func(offset, limit int) (dtos.ArticleMetas, int64, error)
	OnGetContentByID           func(id int64) (string, error)
	OnGetUntaggedCount         func() (int64, error)
	OnGetAllCount              func() (int64, error)
	OnExistByTitle             func(title string) (bool, error)
	OnExistByIDs               func(ids []int64) (bool, error)
	OnDeleteByIDs              func(ids []int64) error
}

func (m *ArticleRepositoryMock) Save(article *models.Article) error {
	return m.OnSave(article)
}

func (m *ArticleRepositoryMock) FindMetaWithPage(offset, limit int) (dtos.ArticleMetas, int64, error) {
	return m.OnFindMetaWithPage(offset, limit)
}

func (m *ArticleRepositoryMock) FindMetaByIDsWithPage(ids []int64, offset, limit int) (dtos.ArticleMetas, int64, error) {
	return m.OnFindMetaByIDsWithPage(ids, offset, limit)
}

func (m *ArticleRepositoryMock) FindMetaByIDs(ids []int64) (dtos.ArticleMetas, error) {
	return m.OnFindMetaByIDs(ids)
}

func (m *ArticleRepositoryMock) GetMetaByID(id int64) (*dtos.ArticleMeta, error) {
	return m.OnGetMetaByID(id)
}

func (m *ArticleRepositoryMock) GetByID(id int64) (*models.Article, error) {
	return m.OnGetByID(id)
}

func (m *ArticleRepositoryMock) FindMetaByTagWithPage(tag string, offset, limit int) (dtos.ArticleMetas, int64, error) {
	return m.OnFindMetaByTagWithPage(tag, offset, limit)
}

func (m *ArticleRepositoryMock) FindMetaUntaggedWithPage(offset, limit int) (dtos.ArticleMetas, int64, error) {
	return m.OnFindMetaUntaggedWithPage(offset, limit)
}

func (m *ArticleRepositoryMock) GetContentByID(id int64) (string, error) {
	return m.OnGetContentByID(id)
}

func (m *ArticleRepositoryMock) GetUntaggedCount() (int64, error) {
	return m.OnGetUntaggedCount()
}

func (m *ArticleRepositoryMock) GetAllCount() (int64, error) {
	return m.OnGetAllCount()
}

func (m *ArticleRepositoryMock) ExistByTitle(title string) (bool, error) {
	return m.OnExistByTitle(title)
}

func (m *ArticleRepositoryMock) ExistByIDs(ids []int64) (bool, error) {
	return m.OnExistByIDs(ids)
}

func (m *ArticleRepositoryMock) DeleteByIDs(ids []int64) error {
	return m.OnDeleteByIDs(ids)
}
