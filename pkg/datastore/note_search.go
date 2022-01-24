package datastore

import (
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/models"
	"github.com/pkg/errors"
)

type NoteSearchDatastore interface {
	InitializeNoteSearch() error
	InsertNoteSearch(note *models.Note) error
	UpdateNoteSearch(note *models.Note) error
	DeleteNoteSearch(id int64) error
	DeleteNoteSearches(ids []int64) error
	SearchNote(keyword string) ([]int64, error)
}

func (d *Datastore) InitializeNoteSearch() error {
	tables, err := d.database.Tables()
	if err != nil {
		return errors.Wrap(err, "failed to find tables")
	}

	if common.Strings(tables).Contains("note_search") {
		return nil
	}

	sqlDB, err := d.database.DB.DB()
	if err != nil {
		return err
	}
	if _, err := sqlDB.Exec("CREATE VIRTUAL TABLE note_search USING FTS5 (id, title, content)"); err != nil {
		return err
	}

	return nil
}

func (d *Datastore) InsertNoteSearch(note *models.Note) error {
	return d.database.Exec("INSERT INTO note_search (id, title, content) VALUES (?, ?, ?)", note.ID, note.Title, note.GetContent()).Error
}

func (d *Datastore) UpdateNoteSearch(note *models.Note) error {
	return d.database.Exec("UPDATE note_search SET title = ?, content = ? WHERE id = ?", note.Title, note.GetContent(), note.ID).Error
}

func (d *Datastore) DeleteNoteSearch(id int64) error {
	return d.database.Exec("DELETE FROM note_search WHERE id = ?", id).Error
}

func (d *Datastore) DeleteNoteSearches(ids []int64) error {
	return d.database.Exec("DELETE FROM note_search WHERE id IN ?", ids).Error
}

func (d *Datastore) SearchNote(keyword string) ([]int64, error) {
	return d.database.SearchIDs("note_search", keyword)
}
