(function(angular) {
  'use strict';

  function PillsViewController($scope, $state, $stateParams, PillsDataService, NotificationsService, $timeout,
     $mdSidenav, dictionary) {
    // pill icons
    let keysModified = false;
    this.PILLS = PillsDataService.relevantPillIcons;
    this.dictionary = dictionary;

    this.toggleSidenav = () => {
      $mdSidenav('left-sidenav').toggle();
    };

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
      if (listItem.isPill && listItem.pillIcon === pillIcon) {
        listItem.isPill = false;
      } else {
        listItem.isPill = true;
        listItem.pillIcon = pillIcon;
      }
      this.onPillStatusChanged(listItem);
    };

    this.onPillStatusChanged = (listItem) => {
      this.selectedKey.done = PillsDataService.isEntryDone(this.selectedKey.listItems);
      if (!listItem.isPill) {
        listItem.pillIcon = null;
      }
      listItem.touched = true;
      keysModified = true;
    };

    this.doneOverride = (entry) => {
      const msg = 'Not all the pills have been set up for this key. Do you really want to set it as "done"?';
      NotificationsService.confirm('Confirm operation', msg)
      .then(() => {
        entry.done = true;
      });
    };

    this.setEditMode = (listItem, editMode = true) => {
      if (!listItem._backupText && editMode && !listItem.editMode) {
        listItem._backupText = listItem.text;
        listItem.touched = true;
        keysModified = true;
      }

      listItem.editMode = editMode;
    };
    this.restoreListItemText = (listItem) => {
      if (listItem._backupText) {
        listItem.text = listItem._backupText;
      }
      this.setEditMode(listItem, false);
    };
    this.addListItem = (entry) => {
      if (!entry.listItems) {
        entry.listItems = [];
      }
      entry.listItems.push({
        text: '',
        editMode: true,
        touched: true
      });
      keysModified = true;
    };
    this.removeListItem = (entry, listItem) => {
      NotificationsService.confirm('Confirm delete', 'Are you sure you want to delete this item?')
      .then(() => {
        entry.listItems.splice(entry.listItems.indexOf(listItem), 1);
        if (entry.listItems.length) {
          entry.listItems[0].touched = true;
        }
        keysModified = true;
      });
    };

    this.showPreview = (entry) => {
      NotificationsService.customDialog('pills-preview-dialog', {
        title: entry.key,
        content: entry.updatedValue
      });
    };

    // Export options
    this.exportOptions = {
      code: (entry) => {
        NotificationsService.customDialog('pills-code-dialog', {
          locals: {
            entry
          }
        }).then(res => {
          if (res) {
            NotificationsService.toast('Copied to clipboard');
          } else if (res === false) {
            NotificationsService.toast('Cannot copy to clipboard');
          }
        });
      },
      xliff: (entry) => {
        const wholeDictionary = !entry;
        const targets = entry ? [entry] : this.dictionary.flatten.filter(item => item.touched);
        if (!targets.length) {
          NotificationsService.error('No keys have been modified');
        } else {
          NotificationsService.confirm('Confirm export', `The export will include ${targets.length} keys. Proceed?`)
          .then(() => {
            PillsDataService.exportXliff(targets)
              .then(() => {
                NotificationsService.toast('Your xliff has been successfully exported');
                if (wholeDictionary) {
                  keysModified = false;
                }
              }).catch(err => {
                if (err) {
                  NotificationsService.error('Oops, there was a problem: ', err);
                }
            });
          });
        }
      }
    };

    let _keylistenerTimeout;
    const handleWindowKeyPressed = (evt) => {

      const targetTag = (evt.target || evt.srcElement).tagName.toUpperCase();
      const targetsToSkip = ['INPUT', 'BUTTON', 'SELECT', 'MD-CHECKBOX'];
      const keyCode = (evt.which || evt.keyCode).toString();
      const handledKeys = {
        37: this.prevKey,
        38: this.prevKey,
        39: this.nextKey,
        40: this.nextKey
      };

      if (!~targetsToSkip.indexOf(targetTag) && !!~Object.keys(handledKeys).indexOf(keyCode)) {
        $timeout.cancel(_keylistenerTimeout);
        $timeout(() => {
          handledKeys[keyCode]();
        }, 100);
      }
    };
    document.addEventListener('keydown', handleWindowKeyPressed);

    let _forceCloseFlag = false;
    const forceClose = () => {
      _forceCloseFlag = true;
      window.close();
    };
    const forceChangePage = () => {
      _forceCloseFlag = true;
      $state.go('app.pills.environments', { selectedEnv: $stateParams.selectedEnv });
    };
    const onBeforeUnload = (e) => {
      console.log('onBeforeUnload: ', e);
      const callback = e.name === '$stateChangeStart' ? forceChangePage : forceClose;
      if (keysModified && !_forceCloseFlag) {
        e.returnValue = false;
        NotificationsService.customDialog('pills-save-temp-dialog')
          .then(res => {
            switch(res) {
              case 'close':
                callback();
                break;
              case 'save':
                this.dictionary.selectedKeyIndex = this.selectedKey ? this.selectedKey.key : null;
                PillsDataService.saveTempData($stateParams.selectedEnv, this.dictionary)
                  .then(callback)
                  .catch(NotificationsService.error);
                break;
            }
          });
        return false;
      }
      return true;
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    $scope.$on('$stateChangeStart', (event, toState) => {
      console.log('$stateChangeStart', event);
      if (toState.name === 'app.pills.environments' && !onBeforeUnload(event)) {
        event.preventDefault();
      }
    });

    $scope.$on('$destroy', () => {
      document.removeEventListener('keydown', handleWindowKeyPressed);
      window.removeEventListener('beforeunload', onBeforeUnload);
    });

    // init
    if (this.dictionary.selectedKeyIndex) {
      // pre-select key if coming from a temp save
      this.selectKey(this.dictionary.flatten.find(e => e.key === this.dictionary.selectedKeyIndex));
    }
  }

  module.exports = PillsViewController;

})(global.angular);
