package services

import (
	"github.com/jaeyo/personal-archive/common/pocket"
	"github.com/jaeyo/personal-archive/repositories"
	"github.com/pkg/errors"
	"gorm.io/gorm"
	"strconv"
	"sync"
	"time"
)

const (
	PocketConsumerKey  = "pocket.consumer_key"
	PocketRequestToken = "pocket.request_token"
	PocketAccessToken  = "pocket.access_token"
	PocketUsername     = "pocket.username"
	PocketSync         = "pocket.sync"
	PocketLastOffset   = "pocket.last_offset"
	PocketLastSyncTime = "pocket.last_sync_time"
)

type PocketService interface {
	ObtainRequestToken(consumerKey, redirectURI string) (string, error)
	Auth() (bool, error)
	Unauth() error
	GetAuth() (bool, string, bool, error)
	ToggleSync(isSyncOn bool) error
	GetLastSyncTime() (*time.Time, error)
	SetLastSyncTime(tm time.Time) error
	SetSyncable(isSyncable bool) error
	GetSyncable() (bool, error)
	GetLastOffset() (int, error)
	SetLastOffset(offset int) error
	GetConsumerKey() (string, error)
	GetAccessToken() (string, error)
}

type pocketService struct {
	miscRepository repositories.MiscRepository
}

var GetPocketService = func() func() PocketService {
	var once sync.Once
	var instance PocketService
	return func() PocketService {
		once.Do(func() {
			instance = &pocketService{
				miscRepository: repositories.GetMiscRepository(),
			}
		})
		return instance
	}
}()

func (s *pocketService) ObtainRequestToken(consumerKey, redirectURI string) (string, error) {
	requestToken, err := pocket.ObtainRequestToken(consumerKey, redirectURI)
	if err != nil {
		return "", errors.Wrap(err, "failed to obtain request token")
	}

	if err := s.miscRepository.CreateOrUpdate(PocketConsumerKey, consumerKey); err != nil {
		return "", errors.Wrap(err, "failed to create/update pocket consumer key")
	}
	if err := s.miscRepository.CreateOrUpdate(PocketRequestToken, requestToken); err != nil {
		return "", errors.Wrap(err, "failed to create/update pocket consumer key")
	}

	return requestToken, nil
}

func (s *pocketService) Auth() (bool, error) {
	consumerKey, err := s.GetConsumerKey()
	if err != nil {
		return false, errors.Wrap(err, "failed to get pocket consumer key")
	}
	requestToken, err := s.miscRepository.GetValue(PocketRequestToken)
	if err != nil {
		return false, errors.Wrap(err, "failed to get pocket request token")
	}

	isAllowed, accessToken, username, err := pocket.ObtainAccessTokenAndUsername(consumerKey, requestToken)
	if err != nil {
		return false, errors.Wrap(err, "failed to obtain access token / username")
	} else if !isAllowed {
		return false, nil
	}

	if err := s.miscRepository.CreateOrUpdate(PocketUsername, username); err != nil {
		return false, errors.Wrap(err, "failed to create/update pocket username")
	}
	if err := s.miscRepository.CreateOrUpdate(PocketAccessToken, accessToken); err != nil {
		return false, errors.Wrap(err, "failed to create/update pocket access token")
	}
	if err := s.miscRepository.CreateOrUpdate(PocketSync, "1"); err != nil {
		return false, errors.Wrap(err, "failed to create/update pocket sync")
	}

	return true, nil
}

func (s *pocketService) Unauth() error {
	if err := s.miscRepository.DeleteByKeys([]string{
		PocketConsumerKey,
		PocketRequestToken,
		PocketAccessToken,
		PocketUsername,
		PocketSync,
		PocketLastOffset,
		PocketLastSyncTime,
	}); err != nil {
		return errors.Wrap(err, "failed to delete by keys")
	}
	return nil
}

func (s *pocketService) GetAuth() (bool, string, bool, error) {
	username, err := s.miscRepository.GetValue(PocketUsername)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, "", false, nil
		}
		return false, "", false, errors.Wrap(err, "failed to get pocket username")
	}

	pocketSync, err := s.miscRepository.GetValue(PocketSync)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, "", false, nil
		}
		return false, "", false, errors.Wrap(err, "failed to get pocket username")
	}

	return true, username, pocketSync == "1", nil
}

func (s *pocketService) ToggleSync(isSyncOn bool) error {
	isAuthenticated, _, _, err := s.GetAuth()
	if err != nil {
		return errors.Wrap(err, "failed to get auth")
	} else if !isAuthenticated {
		return errors.New("not authenticated")
	}

	return s.SetSyncable(isSyncOn)
}

func (s *pocketService) GetLastSyncTime() (*time.Time, error) {
	value, err := s.miscRepository.GetValue(PocketLastSyncTime)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "failed to get value")
	}
	lastSyncTimeUnix, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return nil, errors.Wrap(err, "failed to parse last sync time value")
	}

	lastSyncTime := time.Unix(lastSyncTimeUnix, 0)
	return &lastSyncTime, nil
}

func (s *pocketService) SetLastSyncTime(tm time.Time) error {
	lastSyncTime := strconv.FormatInt(tm.Unix(), 10)
	if err := s.miscRepository.CreateOrUpdate(PocketLastSyncTime, lastSyncTime); err != nil {
		return errors.Wrap(err, "failed to create / update last sync time")
	}
	return nil
}

func (s *pocketService) GetLastOffset() (int, error) {
	value, err := s.miscRepository.GetValue(PocketLastOffset)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, nil
		}
		return -1, errors.Wrap(err, "failed to get value")
	}
	offset, err := strconv.Atoi(value)
	if err != nil {
		return -1, errors.Wrap(err, "failed to convert last offset")
	}
	return offset, nil
}

func (s *pocketService) SetSyncable(isSyncable bool) error {
	pocketSync := "0"
	if isSyncable {
		pocketSync = "1"
	}

	if err := s.miscRepository.CreateOrUpdate(PocketSync, pocketSync); err != nil {
		return errors.Wrap(err, "failed to create/update pocket sync")
	}
	return nil
}

func (s *pocketService) GetSyncable() (bool, error) {
	if pocketSync, err := s.miscRepository.GetValue(PocketSync); err != nil {
		return false, errors.Wrap(err, "failed to get pocket sync value")
	} else {
		return pocketSync == "1", nil
	}
}

func (s *pocketService) SetLastOffset(offset int) error {
	return s.miscRepository.CreateOrUpdate(PocketLastOffset, strconv.Itoa(offset))
}

func (s *pocketService) GetConsumerKey() (string, error) {
	return s.miscRepository.GetValue(PocketConsumerKey)
}

func (s *pocketService) GetAccessToken() (string, error) {
	return s.miscRepository.GetValue(PocketAccessToken)
}
