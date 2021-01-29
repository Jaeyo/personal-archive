package services

import (
	"fmt"
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/repositories"
	"github.com/pkg/errors"
	"sync"
)

type NoteService interface {
	Initialize()
	Create(title, content string, referenceArticleIDs []int64, referenceWebURLs []string) (*models.Note, error)
	Search(keyword string, offset, limit int) ([]*models.Note, int64, error)
	UpdateTitle(id int64, newTitle string) error
	DeleteByIDs(ids []int64) error
}

type noteService struct {
	noteRepository             repositories.NoteRepository
	noteSearchRepository       repositories.NoteSearchRepository
	articleRepository          repositories.ArticleRepository
	paragraphRepository        repositories.ParagraphRepository
	referenceArticleRepository repositories.ReferenceArticleRepository
	referenceWebRepository     repositories.ReferenceWebRepository
}

var GetNoteService = func() func() NoteService {
	var instance NoteService
	var once sync.Once

	return func() NoteService {
		once.Do(func() {
			instance = &noteService{
				noteRepository:             repositories.GetNoteRepository(),
				noteSearchRepository:       repositories.GetNoteSearchRepository(),
				articleRepository:          repositories.GetArticleRepository(),
				paragraphRepository:        repositories.GetParagraphRepository(),
				referenceArticleRepository: repositories.GetReferenceArticleRepository(),
				referenceWebRepository:     repositories.GetReferenceWebRepository(),
			}
		})
		return instance
	}
}()

func (s *noteService) Initialize() {
	if err := s.noteSearchRepository.Initialize(); err != nil {
		panic(err)
	}
}

func (s *noteService) Create(title, content string, refArticleIDs []int64, refWebURLs []string) (*models.Note, error) {
	exists, err := s.articleRepository.ExistByIDs(refArticleIDs)
	if err != nil {
		return nil, errors.Wrap(err, "failed to check reference article ids exist")
	} else if !exists {
		return nil, fmt.Errorf("invalid reference article ids: %v", refArticleIDs)
	}

	var refArticles []*models.ReferenceArticle
	for _, refArticleID := range refArticleIDs {
		refArticles = append(refArticles, &models.ReferenceArticle{ArticleID: refArticleID})
	}

	var refWebs []*models.ReferenceWeb
	for _, refWebURL := range refWebURLs {
		refWebs = append(refWebs, &models.ReferenceWeb{URL: refWebURL})
	}

	note := &models.Note{
		Title: title,
		Paragraphs: []*models.Paragraph{
			{
				Seq:               0,
				Content:           content,
				ReferenceArticles: refArticles,
				ReferenceWebs:     refWebs,
			},
		},
	}

	if err := s.noteRepository.Save(note); err != nil {
		return nil, errors.Wrap(err, "failed to save note")
	}
	return note, nil
}

func (s *noteService) Search(keyword string, offset, limit int) ([]*models.Note, int64, error) {
	ids, err := s.noteSearchRepository.Search(keyword)
	if err != nil {
		return nil, -1, errors.Wrap(err, "failed to search")
	}

	notes, cnt, err := s.noteRepository.FindByIDsWithPage(ids, offset, limit)
	if err != nil {
		return nil, -1, errors.Wrap(err, "failed to find notes by ids")
	}

	return notes, cnt, nil
}

func (s *noteService) UpdateTitle(id int64, newTitle string) error {
	exist, err := s.noteRepository.ExistByTitle(newTitle)
	if err != nil {
		return errors.Wrap(err, "failed to check exist by title")
	} else if exist {
		return fmt.Errorf("title %s already exists", newTitle)
	}

	note, err := s.noteRepository.GetByID(id)
	if err != nil {
		return errors.Wrap(err, "failed to get note")
	}

	note.Title = newTitle

	if err := s.noteRepository.Save(note); err != nil {
		return errors.Wrap(err, "failed to save note")
	}
	return nil
}

func (s *noteService) DeleteByIDs(ids []int64) error {
	notes, err := s.noteRepository.FindByIDs(ids)
	if err != nil {
		return errors.Wrap(err, "failed to find notes")
	} else if len(ids) != len(notes) {
		fmt.Errorf("invalid ids: %v", ids)
	}

	paragraphs := notes.ExtractParagraphs()
	paragraphIDs := paragraphs.ExtractIDs()
	refArticleIDs := paragraphs.ExtractReferenceArticleIDs()
	refWebIDs := paragraphs.ExtractReferenceWebIDs()

	if err := s.referenceArticleRepository.DeleteByIDs(refArticleIDs); err != nil {
		return errors.Wrap(err, "failed to delete reference article by ids")
	}
	if err := s.referenceWebRepository.DeleteByIDs(refWebIDs); err != nil {
		return errors.Wrap(err, "failed to delete reference web by ids")
	}
	if err := s.paragraphRepository.DeleteByIDs(paragraphIDs); err != nil {
		return errors.Wrap(err, "failed to delete paragraph by ids")
	}

	if err := s.noteRepository.DeleteByIDs(ids); err != nil {
		return errors.Wrap(err, "failed to delete note by ids")
	}
	return nil
}
