(function(angular) {

  'use strict';

  function PillsEnvironmentsController($state, stateParams, PillsDataService, IOService, NotificationsService) {
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

    this.deleteTempEnv = (env) => {
      NotificationsService.confirm('Deleting temp data', 'All the progress will be lost. Do you want to proceed?')
        .then(() => {
          const isSelected = this.selectedEnv === env;
          this.environments.splice(this.environments.indexOf(env), 1);
          PillsDataService.deleteTempData();
          if (isSelected) {
            this.selectedEnv = this.environments.find(env => env.name === PillsDataService.defaultEnv.name);
          }
        });
    };

    // Init
    const tempData = PillsDataService.getTempData();
    if (tempData) {
      // Temporary data
      if (!stateParams.selectedEnv) {
        NotificationsService.customDialog('pills-load-temp-dialog', {
          meta: tempData
        }).then(res => {
          switch (res) {
            case 'discard':
              this.deleteTempEnv();
              break;
            case 'load':
              this.load();
              break;
          }
        });
      }

      this.environments.push({
        origName: tempData.env.origName || tempData.env.name,
        name: `Temp data - ${tempData.env.origName || tempData.env.name} (${tempData.timestamp})`,
        temp: true
      });

      if (!stateParams.selectedEnv || stateParams.selectedEnv.temp) {
        this.selectedEnv = this.environments[this.environments.length - 1];
      }
    }
  }

  module.exports = PillsEnvironmentsController;

})(global.angular);
