(function(angular) {

  'use strict';

  function PillsEnvironmentsController($state, stateParams, PillsDataService, IOService) {
    const defaultEnv = stateParams.selectedEnv ? stateParams.selectedEnv.name : PillsDataService.defaultEnv.name;
    this.environments = PillsDataService.environments;
    this.selectedEnv = this.environments.find(env => env.name === defaultEnv);
    this.state = $state.current;

    this.loadFile = () => {
      IOService.showOpenDialog().then(filePath => {
        this.selectedEnv = { name: `file: ${filePath}`, path: filePath };
        this.load();
      });
    };

    this.load = () => {
      this.loading = true;
      $state.go('app.pills.view', { selectedEnv: this.selectedEnv });
    };
  }

  module.exports = PillsEnvironmentsController;

})(global.angular);
