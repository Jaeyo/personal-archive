package mock

import "github.com/jaeyo/personal-archive/models"

type ParagraphRepositoryMock struct {
	OnSave                func(paragraph *models.Paragraph) error
	OnGetByIDAndNoteID    func(id, noteID int64) (*models.Paragraph, error)
	OnFindByIDsAndNoteID  func(ids []int64, noteID int64) (models.Paragraphs, error)
	OnDeleteByIDs         func(ids []int64) error
	OnDeleteByIDAndNoteID func(id, noteID int64) error
}

func (m *ParagraphRepositoryMock) Save(paragraph *models.Paragraph) error {
	return m.OnSave(paragraph)
}

func (m *ParagraphRepositoryMock) GetByIDAndNoteID(id, noteID int64) (*models.Paragraph, error) {
	return m.OnGetByIDAndNoteID(id, noteID)
}

func (m *ParagraphRepositoryMock) FindByIDsAndNoteID(ids []int64, noteID int64) (models.Paragraphs, error) {
	return m.OnFindByIDsAndNoteID(ids, noteID)
}

func (m *ParagraphRepositoryMock) DeleteByIDs(ids []int64) error {
	return m.OnDeleteByIDs(ids)
}

func (m *ParagraphRepositoryMock) DeleteByIDAndNoteID(id, noteID int64) error {
	return m.OnDeleteByIDAndNoteID(id, noteID)
}
