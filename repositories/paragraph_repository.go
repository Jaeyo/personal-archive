package repositories

import (
	"github.com/jaeyo/personal-archive/internal"
	"github.com/jaeyo/personal-archive/models"
	"sync"
)

type ParagraphRepository interface {
	Save(paragraph *models.Paragraph) error
	GetByIDAndNoteID(id, noteID int64) (*models.Paragraph, error)
	FindByIDsAndNoteID(ids []int64, noteID int64) (models.Paragraphs, error)
	DeleteByIDs(ids []int64) error
	DeleteByIDAndNoteID(id, noteID int64) error
}

type paragraphRepository struct {
	database *internal.DB
}

var GetParagraphRepository = func() func() ParagraphRepository {
	var instance ParagraphRepository
	var once sync.Once

	return func() ParagraphRepository {
		once.Do(func() {
			instance = &paragraphRepository{
				database: internal.GetDatabase(),
			}
		})
		return instance
	}
}()

func (r *paragraphRepository) Save(paragraph *models.Paragraph) error {
	return r.database.Save(paragraph).Error
}

func (r *paragraphRepository) GetByIDAndNoteID(id, noteID int64) (*models.Paragraph, error) {
	var paragraph models.Paragraph
	if err := r.database.
		Preload("ReferenceArticles").
		Preload("ReferenceWebs").
		Where("id = ? AND note_id = ?", id, noteID).
		First(&paragraph).Error; err != nil {
		return nil, err
	}
	return &paragraph, nil
}

func (r *paragraphRepository) FindByIDsAndNoteID(ids []int64, noteID int64) (models.Paragraphs, error) {
	var paragraphs []*models.Paragraph
	if err := r.database.
		Preload("ReferenceArticles").
		Preload("ReferenceWebs").
		Where("id IN ? AND note_id = ?", ids, noteID).
		Find(&paragraphs).Error; err != nil {
		return nil, err
	}
	return paragraphs, nil
}

func (r *paragraphRepository) DeleteByIDs(ids []int64) error {
	return r.database.Where("id IN ?", ids).Delete(&models.Paragraph{}).Error
}

func (r *paragraphRepository) DeleteByIDAndNoteID(id, noteID int64) error {
	return r.database.Where("note_id = ? AND id = ?", noteID, id).Delete(&models.Paragraph{}).Error
}
