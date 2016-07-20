(function() {

  'use strict';

  class XliffService {
    constructor() {
      this.metadata = {
        'tool-id': 'com.ficheral.ryr.pills',
        'tool-name': 'Ryanair Pills Manager',
        'tool-version': '0.0.1',
        'tool-company': 'Ryanair Ltd'
      }
      this.lang = 'en';
      this.version = '1.1';
    }

    // function that adds attributes to a node
    _setAttributes(node, attrs) {
      Object.keys(attrs).filter(attr => attr !== 'type').forEach(key => {
        node.setAttribute(key, attrs[key]);
      });
      return node;
    }

    // function that creates the XML structure
    _build() {
      let node, child;
      if (typeof arguments[0] === 'string') {
        node = this.xmlDoc.createElement(arguments[0]);
      } else {
        node = this.xmlDoc.createElement(arguments[0].type);
        this._setAttributes(node, arguments[0]);
      }

      for(var i = 1; i < arguments.length; i++) {
        child = arguments[i];
        if (typeof child == 'string') {
          child = this.xmlDoc.createTextNode(child);
        } else if (typeof child === 'object' && (child.text || child.cdata)) {
          const attrs = child.attrs;
          if (child.cdata) {
            child = this.xmlDoc.createCDATASection(child.cdata)
          } else {
            child = this.xmlDoc.createTextNode(child.text);
          }
          if (attrs) {
            this._setAttributes(child, attrs);
          }
        }
        node.appendChild(child);
      }

      return node;
    };

    import(content) {
      const xmlDoc = new DOMParser().parseFromString(content, 'application/xml');

      const entries = xmlDoc.getElementsByTagName('trans-unit');
      if (entries.length) {
        return Array.from(entries).map(entry => ({
          key: entry.getElementsByTagName('source')[0].childNodes[0].data,
          value: entry.getElementsByTagName('target')[0].childNodes[0].data
        }));
      }

      return [];
    }

    export(entries) {
      this.xmlDoc = document.implementation.createDocument(null, null);
      // header
      this.xmlDoc.appendChild(
        this._build({ type: 'xliff', version: this.version },
          this._build({
            type: 'file',
            original: '/libs/cq/i18n/default',
            'source-language': this.lang,
            'target-language': 'default',
            datatype: 'x-javaresourcebundle',
            'tool-id': this.metadata['tool-id'],
            date: new Date().toString()
          },
            this._build('header',
              this._build(Object.assign({
                type: 'tool'
              }, this.metadata))
            ),
            this._build('body')
          )
        )
      );

      const body = this.xmlDoc.getElementsByTagName('body')[0];
      entries.forEach((entry, index) => {
        body.appendChild(
          this._build({ type: 'trans-unit', id: index},
            this._build({ type: 'source', 'xml:lang': this.lang }, { cdata: entry.key }),
            this._build({ type: 'target', 'xml:lang': 'default' }, { cdata: entry.updatedValue })
          )
        );
      });

      const result = `<?xml version="1.0" encoding="utf-8" ?>${(new XMLSerializer()).serializeToString(this.xmlDoc)}`;
      //dispose
      this.xmlDoc = null;
      return result;
    }
  }

  module.exports = XliffService;

})();
