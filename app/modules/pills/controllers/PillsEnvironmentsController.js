(function(angular) {

  'use strict';

  function PillsEnvironmentsController($state, stateParams, PillsDataService) {
    const defaultEnv = stateParams.selectedEnv ? stateParams.selectedEnv.name : 'LIVE';
    this.environments = PillsDataService.environments;
    this.selectedEnv = this.environments.find(env => env.name === defaultEnv);
    this.state = $state.current;
  }

  module.exports = PillsEnvironmentsController;

})(global.angular);
