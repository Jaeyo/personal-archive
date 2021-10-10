package app

import (
	"github.com/jaeyo/personal-archive/controllers"
	"github.com/jaeyo/personal-archive/pkg/datastore"
	"github.com/jaeyo/personal-archive/services"
	"github.com/jaeyo/personal-archive/services/generators"
)

type App struct {
	*datastoreApp
	*serviceApp
	*controllerApp
}

func NewApp() *App {
	datastoreApp := newDatastoreApp()
	serviceApp := newServiceApp(datastoreApp)
	controllerApp := newControllerApp(serviceApp, datastoreApp)

	return &App{
		datastoreApp,
		serviceApp,
		controllerApp,
	}
}

type datastoreApp struct {
	Datastore *datastore.Datastore
}

func newDatastoreApp() *datastoreApp {
	return &datastoreApp{
		Datastore: datastore.New(),
	}
}

type serviceApp struct {
	AppService        services.AppService
	ArticleService    services.ArticleService
	NoteService       services.NoteService
	PocketService     services.PocketService
	PocketSyncService services.PocketSyncService
	SettingService    services.SettingService
}

func newServiceApp(dsApp *datastoreApp) *serviceApp {
	articleGen := generators.NewArticleGenerator(dsApp.Datastore)
	pocketService := services.NewPocketService(dsApp.Datastore)
	articleService := services.NewArticleService(articleGen, dsApp.Datastore, dsApp.Datastore, dsApp.Datastore)

	return &serviceApp{
		AppService:        services.NewAppService(dsApp.Datastore),
		ArticleService:    articleService,
		NoteService:       services.NewNoteService(dsApp.Datastore, dsApp.Datastore, dsApp.Datastore, dsApp.Datastore, dsApp.Datastore, dsApp.Datastore),
		PocketService:     pocketService,
		PocketSyncService: services.NewPocketSyncService(pocketService, articleService),
		SettingService:    services.NewSettingService(dsApp.Datastore),
	}
}

type controllerApp struct {
	ArticleController    *controllers.ArticleController
	ArticleTagController *controllers.ArticleTagController
	NoteController       *controllers.NoteController
	SettingController    *controllers.SettingController
}

func newControllerApp(svcApp *serviceApp, dsApp *datastoreApp) *controllerApp {
	return &controllerApp{
		ArticleController:    controllers.NewArticleController(svcApp.ArticleService, dsApp.Datastore),
		ArticleTagController: controllers.NewArticleTagController(dsApp.Datastore, dsApp.Datastore),
		NoteController:       controllers.NewNoteController(svcApp.NoteService, dsApp.Datastore, dsApp.Datastore, dsApp.Datastore),
		SettingController:    controllers.NewSettingController(svcApp.PocketService, svcApp.SettingService),
	}
}

func (a *controllerApp) Controllers() []controllers.Controller {
	return []controllers.Controller{
		a.ArticleController,
		a.ArticleTagController,
		a.NoteController,
		a.SettingController,
	}
}
