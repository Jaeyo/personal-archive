package services

import (
	"fmt"
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/pkg/datastore"
	"github.com/pkg/errors"
)

type NoteService interface {
	Initialize()
	Create(title, content string, referenceArticleIDs []int64, referenceWebURLs []string) (*models.Note, error)
	CreateParagraph(id int64, content string, referenceArticleIDs []int64, referenceWebURLs []string) (*models.Note, error)
	Search(keyword string, offset, limit int) ([]*models.Note, int64, error)
	UpdateTitle(id int64, newTitle string) error
	UpdateParagraph(id, paragraphID int64, content string, referenceArticleIDs common.Int64s, referenceWebURLs common.Strings) error
	DeleteByIDs(ids []int64) error
	SwapParagraphs(id, paragraphAID, paragraphBID int64) error
}

type noteService struct {
	noteDatastore             datastore.NoteDatastore
	noteSearchDatastore       datastore.NoteSearchDatastore
	articleDatastore          datastore.ArticleDatastore
	paragraphDatastore        datastore.ParagraphDatastore
	referenceArticleDatastore datastore.ReferenceArticleDatastore
	referenceWebDatastore     datastore.ReferenceWebDatastore
}

func NewNoteService(
	noteDatastore datastore.NoteDatastore,
	noteSearchDatastore datastore.NoteSearchDatastore,
	articleDatastore datastore.ArticleDatastore,
	paragraphDatastore datastore.ParagraphDatastore,
	referenceArticleDatastore datastore.ReferenceArticleDatastore,
	referenceWebDatastore datastore.ReferenceWebDatastore,
) NoteService {
	return &noteService{
		noteDatastore:             noteDatastore,
		noteSearchDatastore:       noteSearchDatastore,
		articleDatastore:          articleDatastore,
		paragraphDatastore:        paragraphDatastore,
		referenceArticleDatastore: referenceArticleDatastore,
		referenceWebDatastore:     referenceWebDatastore,
	}
}

func (s *noteService) Initialize() {
	if err := s.noteSearchDatastore.InitializeNoteSearch(); err != nil {
		panic(err)
	}
}

func (s *noteService) Create(title, content string, refArticleIDs []int64, refWebURLs []string) (*models.Note, error) {
	exists, err := s.articleDatastore.ExistArticleByIDs(refArticleIDs)
	if err != nil {
		return nil, errors.Wrap(err, "failed to check reference article ids exist")
	} else if !exists {
		return nil, fmt.Errorf("invalid reference article ids: %v", refArticleIDs)
	}

	refArticles := common.Map(refArticleIDs, func(refArticleID int64) *models.ReferenceArticle {
		return &models.ReferenceArticle{ArticleID: refArticleID}
	})

	refWebs := common.Map(refWebURLs, func(refWebURL string) *models.ReferenceWeb {
		return &models.ReferenceWeb{URL: refWebURL}
	})

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

	if err := s.noteDatastore.SaveNote(note); err != nil {
		return nil, errors.Wrap(err, "failed to save note")
	}
	return note, nil
}

func (s *noteService) CreateParagraph(id int64, content string, refArticleIDs []int64, refWebURLs []string) (*models.Note, error) {
	exists, err := s.articleDatastore.ExistArticleByIDs(refArticleIDs)
	if err != nil {
		return nil, errors.Wrap(err, "failed to check reference article ids exist")
	} else if !exists {
		return nil, fmt.Errorf("invalid reference article ids: %v", refArticleIDs)
	}

	refArticles := common.Map(refArticleIDs, func(refArticleID int64) *models.ReferenceArticle {
		return &models.ReferenceArticle{ArticleID: refArticleID}
	})

	refWebs := common.Map(refWebURLs, func(refWebURL string) *models.ReferenceWeb {
		return &models.ReferenceWeb{URL: refWebURL}
	})

	note, err := s.noteDatastore.GetNoteByID(id)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get note")
	}

	note.Paragraphs = append(note.Paragraphs, &models.Paragraph{
		Seq:               note.Paragraphs.MaxSeq() + 1,
		Content:           content,
		ReferenceArticles: refArticles,
		ReferenceWebs:     refWebs,
	})

	if err := s.noteDatastore.SaveNote(note); err != nil {
		return nil, errors.Wrap(err, "failed to save note")
	}

	return note, nil
}

func (s *noteService) Search(keyword string, offset, limit int) ([]*models.Note, int64, error) {
	ids, err := s.noteSearchDatastore.SearchNote(keyword)
	if err != nil {
		return nil, -1, errors.Wrap(err, "failed to search")
	}

	notes, cnt, err := s.noteDatastore.FindNoteByIDsWithPage(ids, offset, limit)
	if err != nil {
		return nil, -1, errors.Wrap(err, "failed to find notes by ids")
	}

	return notes, cnt, nil
}

func (s *noteService) UpdateTitle(id int64, newTitle string) error {
	exist, err := s.noteDatastore.ExistNoteByTitle(newTitle)
	if err != nil {
		return errors.Wrap(err, "failed to check exist by title")
	} else if exist {
		return fmt.Errorf("title %s already exists", newTitle)
	}

	note, err := s.noteDatastore.GetNoteByID(id)
	if err != nil {
		return errors.Wrap(err, "failed to get note")
	}

	note.Title = newTitle

	if err := s.noteDatastore.SaveNote(note); err != nil {
		return errors.Wrap(err, "failed to save note")
	}
	return nil
}

func (s *noteService) UpdateParagraph(id, paragraphID int64, content string, refArticleIDs common.Int64s, refWebURLs common.Strings) error {
	exists, err := s.articleDatastore.ExistArticleByIDs(refArticleIDs)
	if err != nil {
		return errors.Wrap(err, "failed to check reference article ids exist")
	} else if !exists {
		return fmt.Errorf("invalid reference article ids: %v", refArticleIDs)
	}

	paragraph, err := s.paragraphDatastore.GetParagraphByIDAndNoteID(paragraphID, id)
	if err != nil {
		return errors.Wrap(err, "failed to get paragraph")
	}

	var toBeRemovedRefArticles models.ReferenceArticles
	var toBeAddedRefArticles models.ReferenceArticles
	toBeAddedRefArticles, toBeRemovedRefArticles = common.SplitBy(paragraph.ReferenceArticles, func(refArticle *models.ReferenceArticle) bool {
		return refArticleIDs.Contains(refArticle.ArticleID)
	})

	for _, articleID := range refArticleIDs {
		if !toBeAddedRefArticles.ContainArticleID(articleID) {
			toBeAddedRefArticles = append(toBeAddedRefArticles, &models.ReferenceArticle{ArticleID: articleID})
		}
	}

	var toBeRemovedRefWebs models.ReferenceWebs
	var toBeAddedRefWebs models.ReferenceWebs
	toBeAddedRefWebs, toBeRemovedRefWebs = common.SplitBy(paragraph.ReferenceWebs, func(refWeb *models.ReferenceWeb) bool {
		return refWebURLs.Contains(refWeb.URL)
	})

	for _, url := range refWebURLs {
		if !toBeAddedRefWebs.ContainURL(url) {
			toBeAddedRefWebs = append(toBeAddedRefWebs, &models.ReferenceWeb{URL: url})
		}
	}

	if err := s.referenceArticleDatastore.DeleteReferenceArticleByIDs(toBeRemovedRefArticles.ExtractIDs()); err != nil {
		return errors.Wrap(err, "failed to delete reference articles by ids")
	}
	if err := s.referenceWebDatastore.DeleteReferenceWebByIDs(toBeRemovedRefWebs.ExtractIDs()); err != nil {
		return errors.Wrap(err, "failed to delete reference webs by ids")
	}

	paragraph.Content = content
	paragraph.ReferenceArticles = toBeAddedRefArticles
	paragraph.ReferenceWebs = toBeAddedRefWebs

	if err := s.paragraphDatastore.SaveParagraph(paragraph); err != nil {
		return errors.Wrap(err, "failed to save paragraph")
	}
	return nil
}

func (s *noteService) DeleteByIDs(ids []int64) error {
	notes, err := s.noteDatastore.FindNoteByIDs(ids)
	if err != nil {
		return errors.Wrap(err, "failed to find notes")
	} else if len(ids) != len(notes) {
		fmt.Errorf("invalid ids: %v", ids)
	}

	paragraphs := notes.ExtractParagraphs()
	paragraphIDs := paragraphs.ExtractIDs()
	refArticleIDs := paragraphs.ExtractReferenceArticleIDs()
	refWebIDs := paragraphs.ExtractReferenceWebIDs()

	if err := s.referenceArticleDatastore.DeleteReferenceArticleByIDs(refArticleIDs); err != nil {
		return errors.Wrap(err, "failed to delete reference article by ids")
	}
	if err := s.referenceWebDatastore.DeleteReferenceWebByIDs(refWebIDs); err != nil {
		return errors.Wrap(err, "failed to delete reference web by ids")
	}
	if err := s.paragraphDatastore.DeleteParagraphByIDs(paragraphIDs); err != nil {
		return errors.Wrap(err, "failed to delete paragraph by ids")
	}

	if err := s.noteDatastore.DeleteNoteByIDs(ids); err != nil {
		return errors.Wrap(err, "failed to delete note by ids")
	}
	return nil
}

func (s *noteService) SwapParagraphs(id, paragraphAID, paragraphBID int64) error {
	paragraphs, err := s.paragraphDatastore.FindParagraphByIDsAndNoteID([]int64{paragraphAID, paragraphBID}, id)
	if err != nil {
		return errors.Wrap(err, "failed to find paragraphs")
	} else if len(paragraphs) != 2 {
		return fmt.Errorf("failed to find 2 paragraphs (%d, %d)", paragraphAID, paragraphBID)
	}

	tmp := paragraphs[0].Seq
	paragraphs[0].Seq = paragraphs[1].Seq
	paragraphs[1].Seq = tmp

	for _, p := range paragraphs {
		if err := s.paragraphDatastore.SaveParagraph(p); err != nil {
			return errors.Wrap(err, "failed to save paragraph")
		}
	}
	return nil
}
