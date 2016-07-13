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
          .state(`${moduleConfig.state}.view`, {
            url: '/view',
            views: {
              'content': {
                templateUrl: `${moduleConfig.path}/views/pills.view.html`,
                controller: 'PillsViewController as $ctrl'
              },
              //'actions@app': {
              //  templateUrl: `${moduleConfig.path}/views/pills.actions.html`
              //}
            }
          });
      });

    var PillsDataService = require('./services/PillsDataService');
    var PillsViewController = require('./controllers/PillsViewController');

    angular.module('electron-app').service('PillsDataService', ['PouchDBService', '$http', PillsDataService]);
    angular.module('electron-app').controller('PillsViewController', ['$scope', '$state', '$q', '$mdDialog',
      'PillsDataService', 'NotificationsService', PillsViewController]);

    // directives
    require('./directives/full-height.js');
    require('./directives/scroll-to-element.js');
  }

  module.exports = PillsModule;

})(global.angular);
