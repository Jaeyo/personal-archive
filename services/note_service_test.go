package services

import (
	"github.com/golang/mock/gomock"
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/pkg/datastore/mock"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestCreate(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	articleDatastore := mock.NewMockArticleDatastore(ctrl)
	articleDatastore.
		EXPECT().
		ExistArticleByIDs(gomock.Any()).
		Return(false, nil)

	svc := &noteService{
		articleDatastore: articleDatastore,
	}

	notExistIDs := []int64{1, 2}

	_, err := svc.Create("", "", notExistIDs, []string{})

	require.NotNil(t, err)
}

func TestSwapParagraphs(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	paragraphA := &models.Paragraph{
		Seq: 100,
	}
	paragraphB := &models.Paragraph{
		Seq: 101,
	}

	paragraphDatastore := mock.NewMockParagraphDatastore(ctrl)
	paragraphDatastore.
		EXPECT().
		FindParagraphByIDsAndNoteID(gomock.Any(), gomock.Any()).
		Return(models.Paragraphs{paragraphA, paragraphB}, nil)
	paragraphDatastore.
		EXPECT().
		SaveParagraph(gomock.Any()).
		AnyTimes().
		Return(nil)

	svc := NewNoteService(nil, nil, nil, paragraphDatastore, nil, nil)
	err := svc.SwapParagraphs(-1, -1, -1)
	require.NoError(t, err)
	require.Equal(t, 101, paragraphA.Seq)
	require.Equal(t, 100, paragraphB.Seq)
}
