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

    get environments() {
      return [
        { name: 'Test06', url: 'http://choaemtst06:4503' },
        { name: 'DEV', url: 'https://dev-aem.ryanair.com' },
        { name: 'SIT', url: 'https://sit-aem.ryanair.com' },
        { name: 'UAT', url: 'https://uat-aem.ryanair.com' },
        { name: 'LIVE', url: 'https://www.ryanair.com' }
      ];
    }

    get relevantPillIcons() {
      return {
        PILL_BUS: { val: 'glyphs.transport', materialVal: 'directions_bus', label: 'Transport' },
        PILL_CLOCK: { val: 'glyphs.clock', materialVal: 'access_time', label: 'Time' }
      };
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

      // list items
      const listItems = Array.from(element.getElementsByTagName('li') || []).map(item => ({
        value: item.innerHTML,
        text: item.innerText,
        isPill: item.classList.contains('pill'),
        pillIcon: (item.getAttribute('pill-icon') || '').replace(/“|”/g, '')
      }));

      const relevantPills = Object.keys(this.relevantPillIcons).map(key => this.relevantPillIcons[key].val);

      return Object.assign(entry, {
        title: (element.getElementsByTagName('h1')[0] || {}).innerText,
        providerCode,
        locationCode,
        logo: providerCode && locationCode ?
          `https://www.ryanair.com/content/dam/ryanair/parking-pdfs-and-logos/logosparking/${providerCode}_${locationCode}.jpg` :
          null,
        listItems,
        done: this.isEntryDone(listItems)
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

    loadFromHttp(env) {
      return this.$http.get(`${env.url}${this.NAVITAIRE_URL}`)
        .then(result => ({
          flatten: this._flattenDictionary('navitaire.parking.provider.info',
            result.data.navitaire.parking.provider.info),
          hierarchical: result.data
        }));
    }

    isEntryDone(listItems) {
      const relevantPills = Object.keys(this.relevantPillIcons).map(key => this.relevantPillIcons[key].val);
      return relevantPills.every(icon => listItems.some(item => item.pillIcon === icon));
    }
  }

  module.exports = PillsDataService;

})();
