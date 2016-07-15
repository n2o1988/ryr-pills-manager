(function(angular) {

  'use strict';

  function PillsViewController($scope, $stateParams, PillsDataService, NotificationsService, dictionary) {
    // pill icons
    this.PILLS = PillsDataService.relevantPillIcons;
    this.dictionary = dictionary;

    this.selectKey = (entry) => {
      this.selectedKey = entry;
    };
    this.selectFirstUndone = () => {
      this.selectKey(this.dictionary.flatten.find(entry => !entry.done));
    };

    this.isPrevDisabled = () => !this.selectedKey || this.dictionary.flatten.indexOf(this.selectedKey) === 0;
    this.isNextDisabled = () => !this.selectedKey || this.dictionary.flatten.indexOf(this.selectedKey) ===
      this.dictionary.flatten.length - 1;

    this.prevKey = () => {
      if (!this.isPrevDisabled()) {
        const currentIndex = this.dictionary.flatten.indexOf(this.selectedKey);
        this.selectKey(this.dictionary.flatten[currentIndex - 1]);
      }
    };
    this.nextKey = () => {
      if (!this.isNextDisabled()) {
        const currentIndex = this.dictionary.flatten.indexOf(this.selectedKey);
        this.selectKey(this.dictionary.flatten[currentIndex + 1]);
      }
    };

    this.getPill = (entry, pillIcon) => ((entry.listItems || []).find(item => item.pillIcon === pillIcon) || {}).text;

    this.showAlert = (title, msg) => {
      NotificationsService.dialog(title, msg);
    };

    this.assignPillIcon = (listItem, pillIcon) => {
      listItem.isPill = true;
      listItem.pillIcon = pillIcon;
      this.onPillStatusChanged(listItem);
    };

    this.onPillStatusChanged = (listItem) => {
      this.selectedKey.done = PillsDataService.isEntryDone(this.selectedKey.listItems);
      if (!listItem.isPill) {
        listItem.pillIcon = null;
      }
    };

    this.doneOverride = (entry) => {
      const msg = 'Not all the pills have been set up for this key. Do you really want to set it as "done"?';
      NotificationsService.confirm('Confirm operation', msg)
      .then(() => {
        entry.done = true;
      });
    };
  }

  module.exports = PillsViewController;

})(global.angular);
