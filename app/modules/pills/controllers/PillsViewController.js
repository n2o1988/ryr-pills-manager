(function(angular) {

  'use strict';

  function PillsViewController($scope, $state, $q, $mdDialog, PillsDataService, NotificationsService) {

    this.environments = PillsDataService.environments;
    this.selectedEnv = this.environments.find(env => env.name === 'LIVE');

    this.load = () => {
      PillsDataService.loadFromHttp(this.selectedEnv)
        .then(result => {
          this.dictionary = result;
        })
        .catch(error => {
          console.error('error: ', error);
          NotificationsService.error('Cannot load the dictionary');
        });
    };

    this.selectKey = (entry) => {
      this.selectedKey = entry;
    };

    this.isPrevDisabled = () => !this.selectedKey || this.dictionary.flatten.indexOf(this.selectedKey) === 0;
    this.isNextDisabled = () => !this.selectedKey || this.dictionary.flatten.indexOf(this.selectedKey) ===
      this.dictionary.flatten.length - 1;

    this.prevKey = () => {
      const currentIndex = this.dictionary.flatten.indexOf(this.selectedKey);
      this.selectKey(this.dictionary.flatten[currentIndex - 1]);
    };
    this.nextKey = () => {
      const currentIndex = this.dictionary.flatten.indexOf(this.selectedKey);
      this.selectKey(this.dictionary.flatten[currentIndex + 1]);
    };
  }

  module.exports = PillsViewController;

})(global.angular);
