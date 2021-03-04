package mock

import "github.com/jaeyo/personal-archive/models"

type ArticleRepositoryMock struct {
	OnSave                 func(article *models.Article) error
	OnFindAllWithPage      func(offset, limit int) (models.Articles, int64, error)
	OnFindByIDsWithPage    func(ids []int64, offset, limit int) (models.Articles, int64, error)
	OnFindByIDs            func(ids []int64) (models.Articles, error)
	OnGetByID              func(id int64) (*models.Article, error)
	OnFindByTagWithPage    func(tag string, offset, limit int) (models.Articles, int64, error)
	OnFindUntaggedWithPage func(offset, limit int) (models.Articles, int64, error)
	OnGetUntaggedCount     func() (int64, error)
	OnGetAllCount          func() (int64, error)
	OnExistByTitle         func(title string) (bool, error)
	OnExistByIDs           func(ids []int64) (bool, error)
	OnDeleteByIDs          func(ids []int64) error
}

func (m *ArticleRepositoryMock) Save(article *models.Article) error {
	return m.OnSave(article)
}

func (m *ArticleRepositoryMock) FindAllWithPage(offset, limit int) (models.Articles, int64, error) {
	return m.OnFindAllWithPage(offset, limit)
}

func (m *ArticleRepositoryMock) FindByIDsWithPage(ids []int64, offset, limit int) (models.Articles, int64, error) {
	return m.OnFindByIDsWithPage(ids, offset, limit)
}

func (m *ArticleRepositoryMock) FindByIDs(ids []int64) (models.Articles, error) {
	return m.OnFindByIDs(ids)
}

func (m *ArticleRepositoryMock) GetByID(id int64) (*models.Article, error) {
	return m.OnGetByID(id)
}

func (m *ArticleRepositoryMock) FindByTagWithPage(tag string, offset, limit int) (models.Articles, int64, error) {
	return m.OnFindByTagWithPage(tag, offset, limit)
}

func (m *ArticleRepositoryMock) FindUntaggedWithPage(offset, limit int) (models.Articles, int64, error) {
	return m.OnFindUntaggedWithPage(offset, limit)
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
