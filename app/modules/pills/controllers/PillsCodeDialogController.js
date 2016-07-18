(function(angular) {

  'use strict';

  function PillsCodeDialogController(entry, $mdDialog) {
    this.title = entry.key;
    this.code = entry.value;

    this.cancel = $mdDialog.hide;
    this.copy = (id) => {
      var copyTextarea = document.getElementById(id);
      copyTextarea.select();

      try {
        var successful = document.execCommand('copy');
        $mdDialog.hide(true);
      } catch (err) {
        $mdDialog.hide(false);
      }
    };
  }

  module.exports = PillsCodeDialogController;

})(global.angular);
