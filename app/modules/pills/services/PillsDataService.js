(function() {

  'use strict';

  class PillsDataService {
    constructor(PouchDBService, $http) {
      Object.assign(this, {
        PouchDBService,
        $http
      });
      this.NAVITAIRE_URL = '/apps/ryanair/i18n.frontend.navitaire.en-ie.json';
    }

    _addMetaData(entry) {
      const element = document.createElement('div');
      element.innerHTML = entry.value;
      var providerCode, locationCode;
      [providerCode, locationCode] = entry.keyPart.split('_');


      // normalizations
      switch(providerCode) {
        case 'DAA':
          locationCode = 'DUB';
      }


      return Object.assign(entry, {
        title: element.getElementsByTagName('h1')[0].innerText,
        providerCode,
        locationCode,
        logo: providerCode && locationCode ?
          `https://www.ryanair.com/content/dam/ryanair/parking-pdfs-and-logos/logosparking/${providerCode}_${locationCode}.jpg` :
          null
      });
    }

    _flattenDictionary(partKey, dict) {
      return Object.keys(dict).map(key => {
        if (typeof dict[key] !== 'string') {
          return this._flattenDictionary(`${partKey}.${key}`, dict[key]);
        } else{
          return [this._addMetaData({
            key: `${partKey}.${key}`,
            value: dict[key],
            keyPart: key
          })];
        }
      }).reduce((a1, a2) => a1.concat(a2), []);
    }

    get environments() {
      return [
        { name: 'Test06', url: 'http://choaemtst06:4503' },
        { name: 'DEV', url: 'https://dev-aem.ryanair.com' },
        { name: 'SIT', url: 'https://sit-aem.ryanair.com' },
        { name: 'UAT', url: 'https://uat-aem.ryanair.com' },
        { name: 'LIVE', url: 'https://www.ryanair.com' }
      ];
    }

    loadFromHttp(env) {
      return this.$http.get(`${env.url}${this.NAVITAIRE_URL}`)
        .then(result => ({
          flatten: this._flattenDictionary('navitaire.parking.provider.info',
            result.data.navitaire.parking.provider.info),
          hierarchical: result.data
        }));
    }
  }

  module.exports = PillsDataService;

})();
