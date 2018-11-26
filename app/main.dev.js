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
// import { app, BrowserWindow } from 'electron';
import { app, BrowserWindow, Menu } from 'electron';

import fs from 'fs';
import MenuBuilder from './menu';

const path = require('path');

const { ipcMain } = require('electron');

let mainWindow = null;
let toolsWindow = null;
let showAllWindow = null;

global.savingName = { name: path.join(__dirname, `/tmp/test1`) };
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

  showAllWindow = new BrowserWindow({
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

  showAllWindow.webContents.on('did-finish-load', () => {
    if (!showAllWindow) {
      throw new Error('"showAllWindow" is not defined');
    }
    showAllWindow.show();
    showAllWindow.focus();
    readDirectory();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  toolsWindow.on('closed', () => {
    toolsWindow = null;
  });

  showAllWindow.on('closed', () => {
    showAllWindow = null;
  });
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();

    fs.readFile(
      path.join(__dirname, 'script.js'),
      'utf8',
      (err: Error, data: string) => {
        const d = data
          .split('\n')
          .join('\\n ')
          .replace('"', '\\"');
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

    const menuBuilder = new MenuBuilder(mainWindow, toolsWindow, showAllWindow);
    const menu = menuBuilder.buildMenu();
    Menu.setApplicationMenu(menu);
  });

  // let argsToString;
  function buildTestString(type: string, params: string) {
    const splittedParams = params.split(' ');
    const newPaths = splittedParams[0].split('#');
    const newAttributes = [...splittedParams];
    newAttributes.shift();
    const newString = {
      actionName: type,
      paths: newPaths,
      attributes: newAttributes
    };
    return newString;
  }
  // function buildDelayTestString(params: string = '') {
  //   let atr = params;
  //   if (params === '') {
  //     atr = '1000';
  //   }
  //   const newString = {
  //     actionName: 'delay',
  //     paths: null,
  //     attributes: [atr]
  //   };
  //   return newString;
  // }

  function clickFunction(event, args) {
    toolsWindow.webContents.send('new test string available', args);
  }
  function keydownFunction(event, args) {
    const testString = buildTestString('keydown', args);
    toolsWindow.webContents.send('new test string available', testString);
  }
  function keyupFunction(event, args) {
    const testString = buildTestString('keyup', args);
    toolsWindow.webContents.send('new test string available', testString);
  }

  function doubleclickFunction(event, args) {
    toolsWindow.webContents.send('need to delete previous two');
    toolsWindow.webContents.send('new test string available', args);
  }

  function saveTest(event, args) {
    const saveStream = fs.createWriteStream(`${global.savingName.name}.txt`);

    const savingArr = JSON.stringify([...args]);
    saveStream.write(savingArr);
    saveStream.close();
    // for (let i = 0; i < savingArr.length; i += 1) {
    //   a.write(savingArr[i]);
    // }
  }
  function saveConvertedTest(event, args) {
    const fileNames = global.savingName.name.split('/');
    const last = fileNames.pop();
    const convertStream = fs.createWriteStream(
      `${fileNames.join('/')}/converted/${last}-converted.txt`
    );
    const savingArr = [...args];
    const arrLength = savingArr.length;
    for (let i = 0; i < arrLength; i += 1) {
      convertStream.write(savingArr[i]);
    }
  }

  function loadTestingPage(event, args) {
    // mainWindow.loadURL(args);
    mainWindow.loadURL(`http://ya.ru`);
    console.log('testing window opened', args);
  }
  function readDirectory() {
    fs.readdir(path.join(__dirname, '/tmp'), (err, dir) => {
      showAllWindow.webContents.send('all files from directory', dir);
    });
  }
  ipcMain.on('new-mouse-click-event', clickFunction);
  ipcMain.on('new-mouse-doubleclick-event', doubleclickFunction);

  ipcMain.on('keydown', keydownFunction);
  ipcMain.on('keyup', keyupFunction);

  ipcMain.on('new-url-event', loadTestingPage);
  ipcMain.on('save-test', saveTest);
  ipcMain.on('save-converted-test', saveConvertedTest);
  ipcMain.on('new-scroll', clickFunction);
  ipcMain.on('new-resize', clickFunction);
  ipcMain.on('need-to-reload', () => {
    mainWindow.reload();
  });
});
