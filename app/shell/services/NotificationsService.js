(function(angular) {
  'use strict';

  class NotificationsService {
    constructor($mdToast, $mdDialog) {
      Object.assign(this, {
        $mdToast,
        $mdDialog,
        customDialogs: {}
      });
    }

    error(msg) {
      this.$mdToast.show(this.$mdToast.simple().textContent(msg));
    }

    toast(msg) {
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

    registerCustomDialog(key, options) {
      this.customDialogs[key] = angular.extend({
        clickOutsideToClose:true
      }, options);
    }

    customDialog(key, overrides) {
      return this.$mdDialog.show(angular.extend({},
        this.customDialogs[key],
        overrides
      ));
    }
  }

  module.exports = NotificationsService;
})(global.angular);
