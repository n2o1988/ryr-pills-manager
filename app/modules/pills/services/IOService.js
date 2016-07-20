(function() {

  'use strict';

  class IOService {
    constructor($q) {
      const electron = require('electron').remote;
      this.dialog = electron.dialog;
      this.fs = require('fs');
      this.$q = $q;
    }

    showOpenDialog() {
      const defer = this.$q.defer();
      this.dialog.showOpenDialog(fileNames => {
        if (fileNames !== undefined) {
          defer.resolve(fileNames[0]);
        } else {
          defer.reject('No file selected');
        }
      });
      return defer.promise;
    }

    open(file) {
      const defer = this.$q.defer();
      this.fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error: ', err);
          defer.reject(err);
        } else {
          defer.resolve(data)
        }
      });
      return defer.promise;
    }

    save(data, ext = 'txt') {
      const defer = this.$q.defer();
      this.dialog.showSaveDialog(fileName => {
        if (fileName !== undefined) {
          if (!~fileName.indexOf('.')) {
            fileName = `${fileName}.${ext}`;
          }
          this.fs.writeFile(fileName, data, error => {
            if (error) {
              console.error('Error: ', error);
              defer.reject(error);
            } else {
              defer.resolve();
            }
          });
        } else {
          defer.reject();
        }
      });
      return defer.promise;
    }
  }

  module.exports = IOService;

})();
