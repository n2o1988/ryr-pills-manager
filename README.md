# ryr-pills-manager
A tool to help content team to maintain pills in the Parking drawer
based on elelctron-boilerplate

## Included modules
* [Electron](http://electron.atom.io)
* [AngularJS 1.5](https://angularjs.org/)
* [Angular Material Design](https://material.angularjs.org/)
* [Angular UI Router](http://angular-ui.github.io/ui-router/site)
* [PouchDB](https://pouchdb.com/) + Plugins (geo-spatial, MongoDB-style query language and full-text search engine support)

## Getting started
* install node.js (at least Node 4.4.x+ and NPM 2.14.x+ required) from [here](http://www.nodejs.org)
* install Git from [here](https://git-scm.com/)
* install Python 2.7 from [here](http://www.python.org) and add the installation directory to your system path variable
* For Windows, install Windows SDK for Windows Server 2008 and .NET Framework 3.5 from [here](http://www.microsoft.com/en-us/download/details.aspx?id=11310)
* For Windows, install Visual Studio 2013/2015 (Express for Desktop is sufficient).
* clone git repository (```git clone -b angularjs https://github.com/appelgriebsch/electron-boilerplate.git ./myproject```)
* open terminal and run ```npm install``` to install dependencies
* start application in debug by executing ```npm start``` in terminal

## Screenshot

![screenshot](screenshot.png)

## Build Distributable Packages

**PLEASE NOTE: you will need a virtual machine with the actual operating system and development tools installed to build the native packages for it**


* on OS X (10.9+): creates application bundle and distributable disk image (x64 only, Mac AppStore compatible variant incl.)

  ```bash
  npm run build:osx             // will execute sub-tasks npm run build:osx-app (standalone) and npm run build:osx-mas (Mac AppStore version)
  ```
* on Windows (7+): creates application .exe and distributable setup.exe (x86 and x64)

  ```bash
  npm run build:win32         // will execute sub-tasks npm run build:win32-ia32 and npm run build:win32-x64
  ```
* on Linux (Ubuntu/Fedora): creates application and distributable packages for deb-style and rpm-style distributions (x86 and x64)

  ```bash
  npm run build:linux       // will execute sub-tasks npm run build:linux-ia32 and npm run build:linux-x64
  ```
