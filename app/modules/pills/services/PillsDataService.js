(function() {

  'use strict';

  class PillsDataService {
    constructor($http, XliffService, IOService, $q) {
      Object.assign(this, {
        $http,
        $q,
        XliffService,
        IOService
      });
      this.NAVITAIRE_URL = '/apps/ryanair/i18n.frontend.navitaire.en-ie.json';
      this.KEY_PREFIX = 'navitaire.parking.provider.info';
      this.TEMP_DATA_KEY = 'ryr-pills-storage';
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

    get defaultEnv() {
      return this.environments.find(env => env.name === 'LIVE') || this.environments[0];
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
      const listItems = Array.from(element.getElementsByTagName('li') || []).map(item => {
        const iconValue = item.getAttribute('pill-icon') || '';
        const pillIcon = iconValue.replace(/“|”/g, '');

        return {
          value: item.innerHTML,
          text: item.innerText,
          isPill: item.classList.contains('pill'),
          pillIcon,
          touched: pillIcon !== iconValue
        };
      });

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
      const _this = this;
      return Object.keys(dict).map(key => {
        if (typeof dict[key] !== 'string') {
          return this._flattenDictionary(`${partKey}.${key}`, dict[key]);
        } else{
          return [this._addMetaData({
            key: `${partKey}.${key}`,
            value: dict[key],
            keyPart: key,
            get touched() {
              return (this.listItems || []).some(item => item.touched);
            },
            get updatedValue() {
              const element = document.createElement('div');
              element.innerHTML = this.value;
              const ul = element.getElementsByTagName('ul')[0];
              if (!ul) {
                return this.value;
              }
              ul.innerHTML = this.listItems.map(item => item.isPill ?
                `<li class="pill" pill-icon="${item.pillIcon}"><span>${item.text}</span></li>` :
                `<li><span>${item.text}</span></li>`).join('');

              return element.innerHTML;
            }
          })];
        }
      }).reduce((a1, a2) => a1.concat(a2), []);
    }

    loadFromHttp(env) {
      return this.$http.get(`${env.url}${this.NAVITAIRE_URL}`)
        .then(result => ({
          flatten: this._flattenDictionary(this.KEY_PREFIX,
            result.data.navitaire.parking.provider.info),
          hierarchical: result.data
        }));
    }

    loadFromXliff(file) {
      const defer = this.$q.defer();
      // get file content
      this.IOService.open(file).then(data => {
        // parse
        const rawEntries = this.XliffService.import(data).reduce((obj, entry) => {
          if (entry.key.indexOf(this.KEY_PREFIX) === 0) {
            obj[entry.key.substr(this.KEY_PREFIX.length + 1)] = entry.value;
          }
          return obj;
        }, {});

        const entries = this._flattenDictionary(this.KEY_PREFIX, rawEntries);

        // get meta information from live navitaire dictionary
        const liveInfo = this.environments.find(env => env.name === this.defaultEnv.name);
        this.$http.get(`${liveInfo.url}${this.NAVITAIRE_URL}`)
          .then(res => {
            defer.resolve({
              flatten: entries,
              hierarchical: res.data
            });
          }).catch(() => {
            // whatever error we just don't return hierarchical info
            defer.resolve({
              flatten: entries
            })
          });
      }).catch(err => {
        defer.reject(err);
      });
      return defer.promise;
    }

    loadFromTempData() {
      return this.IOService.retrieveTempData(this.TEMP_DATA_KEY);
    }

    isEntryDone(listItems) {
      const relevantPills = Object.keys(this.relevantPillIcons).map(key => this.relevantPillIcons[key].val);
      return relevantPills.every(icon => listItems.some(item => item.pillIcon === icon));
    }

    iconValueToObject(glyphIcon) {
      const pills = this.relevantPillIcons;
      const key = Object.keys(pills).find(key => pills[key].val === glyphIcon);
      return pills[key]
    }

    exportXliff(entries) {
      const content = this.XliffService.export(entries);
      return this.IOService.save(content, 'xliff');
    }

    saveTempData(selectedEnv, data) {
      return this.IOService.saveTempData({
        env: selectedEnv,
        timestamp: new Date().toUTCString(),
        data
      });
    }
  }

  module.exports = PillsDataService;

})();
