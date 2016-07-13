(function() {

  module.exports = {
    defaultModule: 'pills',
    modules: {
      pills: {
        path: 'modules/pills',
        name: 'PillsModule',
        url: '/app/pills/view',
        state: 'app.pills',
        label: 'Pills',
        tooltip: 'Change your pills',
        icon: 'toc'
      }
    }
  };

})();
