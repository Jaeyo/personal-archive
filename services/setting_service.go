package services

import (
	"github.com/jaeyo/personal-archive/repositories"
	"github.com/pkg/errors"
	"gorm.io/gorm"
	"sync"
)

const (
	EditorKeyboardHandler = "editor.keyboard_handler"
)

const EditorDefaultKeyboardHandler = "vim"

type SettingService interface {
	GetEditorKeyboardHandler() (string, error)
	SetEditorKeyboardHandler(keyboardHandler string) (error)
}

type settingService struct {
	miscRepository repositories.MiscRepository
}

var GetSettingService = func() func() SettingService {
	var once sync.Once
	var instance SettingService
	return func() SettingService {
		once.Do(func() {
			instance = &settingService{
				miscRepository: repositories.GetMiscRepository(),
			}
		})
		return instance
	}
}()

func (s *settingService) GetEditorKeyboardHandler() (string, error) {
	value, err := s.miscRepository.GetValue(EditorKeyboardHandler)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return EditorDefaultKeyboardHandler, nil
		}
		return "", errors.Wrap(err, "failed to get value")
	}

	return value, nil
}

func (s *settingService) SetEditorKeyboardHandler(keyboardHandler string) error {
	if err := s.miscRepository.CreateOrUpdate(EditorKeyboardHandler, keyboardHandler); err != nil {
		return errors.Wrap(err, "failed to create/update editor keyboard handler")
	}
	return nil
}
