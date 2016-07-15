(function() {
  'use strict';

  class NotificationsService {
    constructor($mdToast, $mdDialog) {
      Object.assign(this, {
        $mdToast,
        $mdDialog
      });
    }

    error(msg) {
      this.$mdToast.show(this.$mdToast.simple().textContent(msg));
    }

    dialog(title, msg) {
      this.$mdDialog.show(this.$mdDialog.alert({
        title: msg && title ? title : 'Alert',
        textContent: msg || title,
        ok: 'Close'
      }));
    }

    confirm(title, msg, ok = 'Yes', cancel = 'No') {
      const confirm = this.$mdDialog.confirm()
        .title(msg && title ? title : 'Confirm')
        .textContent(msg || title)
        .ariaLabel('Confirm')
        .ok(ok)
        .cancel(cancel);
      return this.$mdDialog.show(confirm);
    }
  }

  module.exports = NotificationsService;
})();
