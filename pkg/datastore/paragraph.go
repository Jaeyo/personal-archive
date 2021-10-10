package datastore

import "github.com/jaeyo/personal-archive/models"

type ParagraphDatastore interface {
	SaveParagraph(paragraph *models.Paragraph) error
	GetParagraphByIDAndNoteID(id, noteID int64) (*models.Paragraph, error)
	FindParagraphByIDsAndNoteID(ids []int64, noteID int64) (models.Paragraphs, error)
	DeleteParagraphByIDs(ids []int64) error
	DeleteParagraphByIDAndNoteID(id, noteID int64) error
}

func (d *Datastore) SaveParagraph(paragraph *models.Paragraph) error {
	return d.database.Save(paragraph).Error
}

func (d *Datastore) GetParagraphByIDAndNoteID(id, noteID int64) (*models.Paragraph, error) {
	var paragraph models.Paragraph
	if err := d.database.
		Preload("ReferenceArticles").
		Preload("ReferenceWebs").
		Where("id = ? AND note_id = ?", id, noteID).
		First(&paragraph).Error; err != nil {
		return nil, err
	}
	return &paragraph, nil
}

func (d *Datastore) FindParagraphByIDsAndNoteID(ids []int64, noteID int64) (models.Paragraphs, error) {
	var paragraphs []*models.Paragraph
	if err := d.database.
		Preload("ReferenceArticles").
		Preload("ReferenceWebs").
		Where("id IN ? AND note_id = ?", ids, noteID).
		Find(&paragraphs).Error; err != nil {
		return nil, err
	}
	return paragraphs, nil
}

func (d *Datastore) DeleteParagraphByIDs(ids []int64) error {
	return d.database.Where("id IN ?", ids).Delete(&models.Paragraph{}).Error
}

func (d *Datastore) DeleteParagraphByIDAndNoteID(id, noteID int64) error {
	return d.database.Where("note_id = ? AND id = ?", noteID, id).Delete(&models.Paragraph{}).Error
}
