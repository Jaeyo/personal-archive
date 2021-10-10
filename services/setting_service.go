package services

import (
	"github.com/jaeyo/personal-archive/pkg/datastore"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

const (
	EditorKeyboardHandler = "editor.keyboard_handler"
)

const (
	EditorDefaultKeyboardHandler = "vim"
)

type SettingService interface {
	GetEditorKeyboardHandler() (string, error)
	SetEditorKeyboardHandler(keyboardHandler string) error
}

type settingService struct {
	miscDatastore datastore.MiscDatastore
}

func NewSettingService(miscDatastore datastore.MiscDatastore) SettingService {
	return &settingService{
		miscDatastore: miscDatastore,
	}
}

func (s *settingService) GetEditorKeyboardHandler() (string, error) {
	value, err := s.miscDatastore.GetValue(EditorKeyboardHandler)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return EditorDefaultKeyboardHandler, nil
		}
		return "", errors.Wrap(err, "failed to get value")
	}

	return value, nil
}

func (s *settingService) SetEditorKeyboardHandler(keyboardHandler string) error {
	if err := s.miscDatastore.CreateOrUpdateKeyValue(EditorKeyboardHandler, keyboardHandler); err != nil {
		return errors.Wrap(err, "failed to create/update editor keyboard handler")
	}
	return nil
}
