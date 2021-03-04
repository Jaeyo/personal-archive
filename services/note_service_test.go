package services

import (
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/repositories/mock"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestSwapParagraphs(t *testing.T) {
	paragraphA := &models.Paragraph{
		Seq: 100,
	}
	paragraphB := &models.Paragraph{
		Seq: 101,
	}

	paragraphRepo := &mock.ParagraphRepositoryMock{
		OnFindByIDsAndNoteID: func(ids []int64, noteID int64) (models.Paragraphs, error) {
			return models.Paragraphs{paragraphA, paragraphB}, nil
		},
		OnSave: func(paragraph *models.Paragraph) error {
			return nil
		},
	}
	svc := &noteService{ paragraphRepository: paragraphRepo }
	err := svc.SwapParagraphs(-1, -1, -1)
	require.NoError(t, err)
	require.Equal(t, 101, paragraphA.Seq)
	require.Equal(t, 100, paragraphB.Seq)
}
