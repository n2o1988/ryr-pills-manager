(function() {
  'use strict';

  class NotificationsService {
    constructor($mdToast) {
      Object.assign(this, {
        $mdToast
      });
    }

    error(msg) {
      this.$mdToast.show(this.$mdToast.simple().textContent(msg));
    }
  }

  module.exports = NotificationsService;
})();
