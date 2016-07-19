(function(angular) {

  'use strict';

  function PillsPreviewDialogController(title, content, $mdDialog) {
    Object.assign(this, {
      title,
      content
    });
    this.cancel = $mdDialog.hide;
  }

  module.exports = PillsPreviewDialogController;

})(global.angular);
