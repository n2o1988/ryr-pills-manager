(function() {

  'use strict';

  class IOService {
    constructor() {
      const electron = require('electron').remote;
      this.dialog = electron.dialog;
      this.fs = require('fs');
    }

    save(data, ext, cb) {
      this.dialog.showSaveDialog(fileName => {
        if (fileName !== undefined) {
          if (!~fileName.indexOf('.')) {
            fileName = `${fileName}.${ext}`;
          }
          this.fs.writeFile(fileName, data, cb);
        }
      });
    }
  }

  module.exports = IOService;

})();
