/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow } from 'electron';

import fs from 'fs';
import { addTestString, deletePrevious } from './actions/testBodyActions';
// import getPath from './helpers';

const path = require('path');

const { ipcMain } = require('electron');

let mainWindow = null;
let toolsWindow = null;

// const a = fs.createWriteStream(path.join(__dirname, '/tmp/clicks.txt'));

// if (process.env.NODE_ENV === 'production') {
//   const sourceMapSupport = require('source-map-support');
//   sourceMapSupport.install();
// }

// if (
//   process.env.NODE_ENV === 'development' ||
//   process.env.DEBUG_PROD === 'true'
// ) {
//   require('electron-debug')();
//   const path = require('path');
//   const p = path.join(__dirname, '..', 'app', 'node_modules');
//   require('module').globalPaths.push(p);
// }

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

//   return Promise.all(
//     extensions.map(name => installer.default(installer[name], forceDownload))
//   ).catch(console.log);
// };

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  // if (
  //   process.env.NODE_ENV === 'development' ||
  //   process.env.DEBUG_PROD === 'true'
  // ) {
  //   await installExtensions();
  // }

  // mainWindow.loadURL('https://ormatek.dev.sibirix.ru');
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  // mainWindow.loadURL('https://ormatek.dev.sibirix.ru');

  toolsWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  toolsWindow.loadURL(`file://${__dirname}/tools.html`);
  // mainWindow.loadURL(`http://ya.ru`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  toolsWindow.webContents.on('did-finish-load', () => {
    if (!toolsWindow) {
      throw new Error('"toolsWindow" is not defined');
    }
    // if (process.env.START_MINIMIZED) {
    //     toolsWindow.minimize();
    // } else {
    toolsWindow.show();
    toolsWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    toolsWindow = null;
  });
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();

    console.log('main window loaded');

    fs.readFile(
      path.join(__dirname, 'script.js'),
      'utf8',
      (err: Error, data: string) => {
        const d = data
          .split('\n')
          .join('\\n ')
          .replace('"', '\\"');
        console.log(d);
        mainWindow.webContents.executeJavaScript(
          'const script = document.createElement("script")'
        );
        mainWindow.webContents.executeJavaScript(
          'script.setAttribute("type", "text/javascript")'
        );
        mainWindow.webContents.executeJavaScript(`script.innerHTML = "${d}"`);
        // mainWindow.webContents.executeJavaScript(`script.innerHTML = "require('${path.join(__dirname, 'script.js')}')"`);
        mainWindow.webContents.executeJavaScript(
          'document.body.appendChild(script)'
        );
      }
    );
  });

  // let argsToString;
  function buildTestString(type: string, params: string) {
    const splittedParams = params.split(' ');
    const newPaths = splittedParams[0].split('#');
    const newAttributes = splittedParams.shift();
    const newString = {
      actionName: type,
      paths: newPaths,
      attributes: newAttributes
    };
    return newString;
  }

  function clickFunction(event, args) {
    console.log('click', args);
    console.log('delay 1000');
    buildTestString('click', args);
    addTestString();
    // a.write(`click ${args}\n`);
  }
  function doubleclickFunction(event, args) {
    deletePrevious();
    console.log('click', args);
    console.log('delay 1000');

    // a.write(`click ${args}\n`);
  }

  function loadTestingPage(event, args) {
    // mainWindow.loadURL(args);
    mainWindow.loadURL(`http://ya.ru`);
    console.log('testing window opened', args);
  }

  ipcMain.on('new-mouse-click-event', clickFunction);
  ipcMain.on('new-mouse-doubleclick-event', doubleclickFunction);

  ipcMain.on('keydown', clickFunction);

  ipcMain.on('new-url-event', loadTestingPage);
  //   ipcMain.on('give-me-the-function', () => {
  //       mainWindow.webContents.send('ready-to-write-clicks', getPath);
  //   });
});
