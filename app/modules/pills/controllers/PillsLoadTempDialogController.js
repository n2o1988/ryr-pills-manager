(function(angular) {

  'use strict';

  function PillsLoadTempDialogController($mdDialog, meta) {
    this.dialog = $mdDialog;
    this.meta = meta;

    this.getNumOfModifiedKeys = () => {
      return meta && meta.data && meta.data.flatten ? meta.data.flatten.filter(e => e.touched).length : 0;
    }
  }

  module.exports = PillsLoadTempDialogController;

})(global.angular);
