package repositories

import (
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/internal"
	"github.com/jaeyo/personal-archive/models"
	"github.com/pkg/errors"
	"sync"
)

type NoteSearchRepository interface {
	Initialize() error
	Insert(note *models.Note) error
	Update(note *models.Note) error
	Delete(id int64) error
	Deletes(ids []int64) error
	Search(keyword string) ([]int64, error)
}

type noteSearchRepository struct {
	database *internal.DB
}

var GetNoteSearchRepository = func() func() NoteSearchRepository {
	var instance NoteSearchRepository
	var once sync.Once

	return func() NoteSearchRepository {
		once.Do(func() {
			instance = &noteSearchRepository{
				database: internal.GetDatabase(),
			}
		})
		return instance
	}
}()

func (r *noteSearchRepository) Initialize() error {
	tables, err := r.database.Tables()
	if err != nil {
		return errors.Wrap(err, "failed to find tables")
	}

	if common.Strings(tables).Contain("note_search") {
		return nil
	}

	sqlDB, err := r.database.DB.DB()
	if err != nil {
		return err
	}
	if _, err := sqlDB.Exec("CREATE VIRTUAL TABLE note_search USING FTS5 (id, title, content)"); err != nil {
		return err
	}

	return nil
}

func (r *noteSearchRepository) Insert(note *models.Note) error {
	return r.database.Exec("INSERT INTO note_search (id, title, content) VALUES (?, ?, ?)", note.ID, note.Title, note.GetContent()).Error
}

func (r *noteSearchRepository) Update(note *models.Note) error {
	return r.database.Exec("UPDATE note_search SET title = ?, content = ? WHERE id = ?", note.Title, note.GetContent(), note.ID).Error
}

func (r *noteSearchRepository) Delete(id int64) error {
	return r.database.Exec("DELETE FROM note_search WHERE id = ?", id).Error
}

func (r *noteSearchRepository) Deletes(ids []int64) error {
	return r.database.Exec("DELETE FROM note_search WHERE id IN ?", ids).Error
}

func (r *noteSearchRepository) Search(keyword string) ([]int64, error) {
	return r.database.SearchIDs("note_search", keyword)
}
