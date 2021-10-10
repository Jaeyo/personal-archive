package mock

import "github.com/jaeyo/personal-archive/models"

type ParagraphDatastoreMock struct {
	OnSaveParagraph                func(paragraph *models.Paragraph) error
	OnGetParagraphByIDAndNoteID    func(id, noteID int64) (*models.Paragraph, error)
	OnFindParagraphByIDsAndNoteID  func(ids []int64, noteID int64) (models.Paragraphs, error)
	OnDeleteParagraphByIDs         func(ids []int64) error
	OnDeleteParagraphByIDAndNoteID func(id, noteID int64) error
}

func (m *ParagraphDatastoreMock) SaveParagraph(paragraph *models.Paragraph) error {
	return m.OnSaveParagraph(paragraph)
}

func (m *ParagraphDatastoreMock) GetParagraphByIDAndNoteID(id, noteID int64) (*models.Paragraph, error) {
	return m.OnGetParagraphByIDAndNoteID(id, noteID)
}

func (m *ParagraphDatastoreMock) FindParagraphByIDsAndNoteID(ids []int64, noteID int64) (models.Paragraphs, error) {
	return m.OnFindParagraphByIDsAndNoteID(ids, noteID)
}

func (m *ParagraphDatastoreMock) DeleteParagraphByIDs(ids []int64) error {
	return m.OnDeleteParagraphByIDs(ids)
}

func (m *ParagraphDatastoreMock) DeleteParagraphByIDAndNoteID(id, noteID int64) error {
	return m.OnDeleteParagraphByIDAndNoteID(id, noteID)
}
