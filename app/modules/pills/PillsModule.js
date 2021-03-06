(function(angular) {

  'use strict';

  function PillsModule(config) {

    var moduleConfig = config;

    angular.module('electron-app')
      .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
          .state(`${moduleConfig.state}`, {
            url: '/pills',
            views: {
              'module': {
                templateUrl: `${moduleConfig.path}/pills.html`
              },
              'header@app': {
                template: `${moduleConfig.label}`
              }
            }
          })
          .state(`${moduleConfig.state}.environments`, {
            url: '/environments',
            params: {
              selectedEnv: null
            },
            views: {
              'content': {
                templateUrl: `${moduleConfig.path}/views/pills.environments.html`,
                controller: 'PillsEnvironmentsController as $ctrl'
              }
            }
          })
          .state(`${moduleConfig.state}.view`, {
            url: '/view',
            params: {
              selectedEnv: null
            },
            views: {
              'content': {
                templateUrl: `${moduleConfig.path}/views/pills.view.html`,
                controller: 'PillsViewController as $ctrl'
              },
              'header@app': {
                template: `${moduleConfig.label} - {{$stateParams.selectedEnv.name}}`
              }
              //'actions@app': {
              //  templateUrl: `${moduleConfig.path}/views/pills.actions.html`
              //}
            },
            resolve: {
              dictionary: ['$stateParams', 'PillsDataService', 'NotificationsService', '$state',
                function ($stateParams, PillsDataService, NotificationsService, $state) {
                if ($stateParams.selectedEnv) {
                  let promise;
                  if ($stateParams.selectedEnv.path) {
                    // load from file
                    promise = PillsDataService.loadFromXliff($stateParams.selectedEnv.path);
                  } else if ($stateParams.selectedEnv.url) {
                    promise = PillsDataService.loadFromHttp($stateParams.selectedEnv.url);
                  } else {
                    promise = PillsDataService.loadFromTempData();
                  }

                  return promise.catch(error => {
                    console.error('error: ', error);
                    NotificationsService.error('Cannot load the dictionary');
                    $state.go(`${moduleConfig.state}.environments`);
                  });
                }
                return null;
              }]
            },
            onEnter($state, $stateParams) {
              if (!$stateParams.selectedEnv) {
                $state.go(`${moduleConfig.state}.environments`);
              }
            }
          });
      });

    angular.module('electron-app')
      .run((NotificationsService) => {
        // Registering custom dialogs

        NotificationsService.registerCustomDialog('pills-code-dialog', {
          templateUrl: `${moduleConfig.path}/views/pills.code.dialog.html`,
          controller: 'PillsCodeDialogController as $ctrl'
        });

        NotificationsService.registerCustomDialog('pills-preview-dialog', {
          templateUrl: `${moduleConfig.path}/views/pills.preview.dialog.html`,
          controller: 'PillsPreviewDialogController as $ctrl'
        });

        NotificationsService.registerCustomDialog('pills-save-temp-dialog', {
          templateUrl: `${moduleConfig.path}/views/pills.save.temp.dialog.html`,
          controller: 'PillsSaveTempDialogController as $ctrl'
        });

        NotificationsService.registerCustomDialog('pills-load-temp-dialog', {
          templateUrl: `${moduleConfig.path}/views/pills.load.temp.dialog.html`,
          controller: 'PillsLoadTempDialogController as $ctrl'
        });
      });

    var PillsDataService = require('./services/PillsDataService');
    var XliffService = require('./services/XliffService');
    var IOService = require('./services/IOService');
    var PillsViewController = require('./controllers/PillsViewController');
    var PillsEnvironmentsController = require('./controllers/PillsEnvironmentsController');
    var PillsCodeDialogController = require('./controllers/PillsCodeDialogController');
    var PillsPreviewDialogController = require('./controllers/PillsPreviewDialogController');
    var PillsSaveTempDialogController = require('./controllers/PillsSaveTempDialogController');
    var PillsLoadTempDialogController = require('./controllers/PillsLoadTempDialogController');

    angular.module('electron-app').service('PillsDataService', ['$http', 'XliffService', 'IOService', '$q', PillsDataService]);
    angular.module('electron-app').service('XliffService', XliffService);
    angular.module('electron-app').service('IOService', ['$q', IOService]);
    angular.module('electron-app').controller('PillsEnvironmentsController', ['$state', '$stateParams', 'PillsDataService',
      'IOService', 'NotificationsService', PillsEnvironmentsController]);
    angular.module('electron-app').controller('PillsViewController', PillsViewController);
    angular.module('electron-app').controller('PillsCodeDialogController', PillsCodeDialogController);
    angular.module('electron-app').controller('PillsPreviewDialogController', PillsPreviewDialogController);
    angular.module('electron-app').controller('PillsSaveTempDialogController', PillsSaveTempDialogController);
    angular.module('electron-app').controller('PillsLoadTempDialogController', PillsLoadTempDialogController);

    // directives
    require('./directives/ng-html-compile');
    require('./directives/full-height');
    require('./directives/scroll-to-element');
    require('./directives/loading-button');
    require('./directives/pill-icon');
  }

  module.exports = PillsModule;

})(global.angular);
