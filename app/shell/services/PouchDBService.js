(function() {

  'use strict';

  function PouchDBService() {

    // initialize pouch db adapter
    var PouchDB = require('pouchdb');
    PouchDB.plugin(require('geopouch'));
    PouchDB.plugin(require('pouchdb-find'));
    PouchDB.plugin(require('pouchdb-quick-search'));
    PouchDB.plugin(require('transform-pouch'));

    var app = require('electron').remote.app;

    var sysCfg = app.sysConfig();
    var settings = { adapter: 'leveldb', prefix: sysCfg.paths.data };

    function DataService(dbName) {

      var promise = new Promise((resolve, reject) => {

        new PouchDB(dbName, settings).then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log('leveldb-adapter is not working, fallback to SQLite (websql)');
          console.log(err);
          require('pouchdb/extras/websql');
          settings.adapter = 'websql';
          new PouchDB(dbName, settings)
          .then((result2) => {
            resolve(result2);
          })
          .catch((err2) => {
            console.log('websql-adapter is also not working. have to stop!');
            console.log(err2);
            reject(err2);
          });
        });
      });

      return promise;
    }

    return {

      initialize: function(dbName) {
        return new DataService(dbName);
      }
    };
  }

  module.exports = PouchDBService;

})();
