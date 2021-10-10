package datastore

import "github.com/jaeyo/personal-archive/models"

type NoteDatastore interface {
	SaveNote(note *models.Note) error
	FindNoteWithPage(offset, limit int) (models.Notes, int64, error)
	FindNoteByIDsWithPage(ids []int64, offset, limit int) (models.Notes, int64, error)
	FindNoteByIDs(ids []int64) (models.Notes, error)
	FindNoteTitles() (models.Notes, error)
	GetNoteByID(id int64) (*models.Note, error)
	ExistNoteByTitle(title string) (bool, error)
	DeleteNoteByIDs(ids []int64) error
}

func (d *Datastore) SaveNote(note *models.Note) error {
	isInsert := note.ID == 0

	if err := d.database.Save(note).Error; err != nil {
		return err
	}

	if isInsert {
		return d.InsertNoteSearch(note)
	} else {
		return d.UpdateNoteSearch(note)
	}
}

func (d *Datastore) FindNoteWithPage(offset, limit int) (models.Notes, int64, error) {
	var notes []*models.Note
	if err := d.database.
		Preload("Paragraphs").
		Preload("Paragraphs.ReferenceArticles").
		Preload("Paragraphs.ReferenceWebs").
		Order("created DESC").
		Offset(offset).
		Limit(limit).
		Find(&notes).Error; err != nil {
		return nil, -1, err
	}

	var cnt int64
	if err := d.database.
		Model(&models.Note{}).
		Count(&cnt).Error; err != nil {
		return nil, -1, err
	}

	ensureNoteAssociationNotNil(notes)
	return notes, cnt, nil
}

func (d *Datastore) FindNoteByIDsWithPage(ids []int64, offset, limit int) (models.Notes, int64, error) {
	var notes []*models.Note
	if err := d.database.
		Preload("Paragraphs").
		Preload("Paragraphs.ReferenceArticles").
		Preload("Paragraphs.ReferenceWebs").
		Where("id IN ?", ids).
		Offset(offset).
		Limit(limit).
		Find(&notes).Error; err != nil {
		return nil, -1, err
	}

	ensureNoteAssociationNotNil(notes)
	return notes, int64(len(ids)), nil
}

func (d *Datastore) FindNoteByIDs(ids []int64) (models.Notes, error) {
	var notes []*models.Note
	if err := d.database.
		Preload("Paragraphs").
		Preload("Paragraphs.ReferenceArticles").
		Preload("Paragraphs.ReferenceWebs").
		Where("id IN ?", ids).
		Find(&notes).Error; err != nil {
		return nil, err
	}

	ensureNoteAssociationNotNil(notes)
	return notes, nil
}

func (d *Datastore) FindNoteTitles() (models.Notes, error) {
	var notes []*models.Note
	if err := d.database.
		Select("id", "title").
		Find(&notes).Error; err != nil {
		return nil, err
	}

	ensureNoteAssociationNotNil(notes)
	return notes, nil
}

func (d *Datastore) GetNoteByID(id int64) (*models.Note, error) {
	var note models.Note
	err := d.database.
		Preload("Paragraphs").
		Preload("Paragraphs.ReferenceArticles").
		Preload("Paragraphs.ReferenceWebs").
		First(&note, id).Error

	ensureNoteAssociationNotNil(models.Notes{&note})
	return &note, err
}

func (d *Datastore) ExistNoteByTitle(title string) (bool, error) {
	var cnt int64
	err := d.database.
		Model(&models.Note{}).
		Where("title = ?", title).
		Count(&cnt).Error
	return cnt > 0, err
}

func (d *Datastore) DeleteNoteByIDs(ids []int64) error {
	if err := d.database.Where("id IN ?", ids).Delete(&models.Note{}).Error; err != nil {
		return err
	}

	return d.DeleteNoteSearches(ids)
}

func ensureNoteAssociationNotNil(notes models.Notes) {
	for _, note := range notes {
		if note.Paragraphs == nil {
			note.Paragraphs = models.Paragraphs{}
		}
		for _, paragraph := range note.Paragraphs {
			if paragraph.ReferenceArticles == nil {
				paragraph.ReferenceArticles = models.ReferenceArticles{}
			}
			if paragraph.ReferenceWebs == nil {
				paragraph.ReferenceWebs = models.ReferenceWebs{}
			}
		}
	}
}

