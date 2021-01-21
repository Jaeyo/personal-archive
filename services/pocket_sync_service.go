package services

import (
	"github.com/gammazero/workerpool"
	"github.com/jaeyo/personal-archive/common/pocket"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"sync"
	"time"
)

type PocketSyncService interface {
	Start()
}

type pocketSyncService struct {
	pocketService  PocketService
	articleService ArticleService
}

var GetPocketSyncService = func() func() PocketSyncService {
	var once sync.Once
	var instance PocketSyncService
	return func() PocketSyncService {
		once.Do(func() {
			instance = &pocketSyncService{
				pocketService:  GetPocketService(),
				articleService: GetArticleService(),
			}
		})
		return instance
	}
}()

func (s *pocketSyncService) Start() {
	// pocket api rate limit: 320 calls per hour
	go func() {
		ticker := time.NewTicker(14 * time.Second)
		for range ticker.C {
			s.sync()
		}
	}()
}

func (s *pocketSyncService) sync() {
	if isSyncable, err := s.pocketService.GetSyncable(); err != nil {
		logrus.Errorf("failed to get syncable: %s", err.Error())
		return
	} else if !isSyncable {
		return
	}

	logrus.Info("start to sync pocket")
	urls, err := s.retrieveURLs()
	if err != nil {
		logrus.Errorf("failed to retrieve urls: %s", err.Error())
		return
	}

	pool := workerpool.New(3)
	for _, url := range urls {
		url := url
		pool.Submit(func() {
			if _, err := s.articleService.CreateByURL(url, []string{"pocket"}); err != nil {
				logrus.Errorf("failed to create article by url (%s): %s", url, err.Error())
			}
		})
	}
	pool.StopWait()

	if err := s.pocketService.SetLastSyncTime(time.Now()); err != nil {
		logrus.Errorf("failed to set last sync time: %s", err.Error())
	}
}

func (s *pocketSyncService) retrieveURLs() ([]string, error) {
	consumerKey, err := s.pocketService.GetConsumerKey()
	if err != nil {
		return nil, errors.Wrap(err, "failed to get consumer key")
	}
	accessToken, err := s.pocketService.GetAccessToken()
	if err != nil {
		return nil, errors.Wrap(err, "failed to get access token")
	}
	lastOffset, err := s.pocketService.GetLastOffset()
	if err != nil {
		return nil, errors.Wrap(err, "failed to get last offset")
	}

	urls, err := pocket.Retrieve(consumerKey, accessToken, lastOffset, 30)
	if err != nil {
		return nil, errors.Wrap(err, "failed to retrieve urls")
	}

	if err := s.pocketService.SetLastOffset(lastOffset + len(urls)); err != nil {
		return nil, errors.Wrap(err, "failed to set last offset")
	}

	return urls, nil
}
