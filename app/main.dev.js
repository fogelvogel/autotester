/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

import { app, BrowserWindow, Menu, dialog } from 'electron';

import fs, { existsSync } from 'fs';
import MenuBuilder from './menu';

const path = require('path');

const { ipcMain } = require('electron');

// in this window you will see page which is being tested
// в этом окне отображается тестируемая страница
let mainWindow = null;

// in this window you can choose mode to build your test
// в этом окне отображается панель инструментов для создания теста
let toolsWindow = null;

// in this page you can see all your tests and convert them
// в этом окне вы можете посмотреть все написанные тесты
let showAllWindow = null;

global.savingName = { name: path.join(__dirname, `/tmp/test1`) };

// this keys are being toggled by webdriver function "keys"
// эти клавиши функция вебдрайвера "keys" тогглит а не просто нажимает
const keysArr = ['Meta', 'Control', 'Alt', 'Shift'];

// should testing page be navigated by clicks (also affects on writing some actions to test)
// должна ли быть включена навигация на тестируемой странице (также влияет на запись некоторых действий)
let navigationEnabled = true;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

function convertTest(event, args) {
  const allTest = [];
  const testsCount = args.length;
  for (let i = 0; i < testsCount; i += 1) {
    allTest[i] = convertOneString(args[i]);
  }
  saveConvertedTest(allTest);
}

function makeTestingString(attribute, paths) {
  const attrib = attribute.split('=');
  const sizes = attrib[1].split(' ');

  switch (attrib[0]) {
    case 'text': {
      return `expect(await app.client.getText('${paths}')).toEqual('${replaceNBSPs(
        attrib[1]
      ).trim()}');\n`;
    }
    case 'size': {
      return `expect(await app.client.getElementSize('${paths}')).toEqual({height: ${
        sizes[0]
      }, width: ${sizes[1]}});\n`;
    }
    case 'classes': {
      return `expect(await app.client.getAttribute('${paths}', 'class')).toEqual('${
        attrib[1]
      }');\n`;
    }
    default:
      break;
  }
}

function replaceNBSPs(str) {
  const re = new RegExp(String.fromCharCode(160), 'g');
  return str.replace(re, ' ');
}

function convertOneString(testString) {
  switch (testString.actionName) {
    case 'wait': {
      if (testString.attributes.length > 1) {
        return `await app.client.waitForExist('${testString.paths[0]}', ${
          testString.attributes[1]
        }, ${testString.attributes[0]});\n`;
      }
      return `await new Promise((resolve) => setTimeout(resolve, ${
        testString.attributes[0]
      }));\n`;
    }
    case 'click': {
      if (testString.attributes.length > 1) {
        return `await app.client.doubleClick('${testString.paths[0]}');\n`;
      }
      return `await app.client.click('${testString.paths[0]}');\n`;
    }
    case 'test': {
      let testingStrings = '';
      for (let i = 0; i < testString.attributes.length; i += 1) {
        testingStrings += makeTestingString(
          testString.attributes[i],
          testString.paths
        );
      }
      if (testingStrings === '') {
        return `expect((await app.client.element('${
          testString.paths
        }')).value).not.toBeNull();\n`;
      }
      return testingStrings;
    }
    case 'keyup': {
      const index = keysArr.findIndex(
        element => element === testString.attributes[0]
      );
      if (index === -1) {
        return '';
      }
      return `await app.client.keys('${testString.attributes[0]}').then();\n`;
    }
    case 'keydown': {
      return `await app.client.keys('${testString.attributes[0]}').then();\n`;
    }
    default:
      break;
  }
  return '';
}
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

function clickFunction(event, args) {
  if (!navigationEnabled) {
    if (args.actionName === 'scroll' || args.actionName === 'resize') {
      return;
    }
  }
  toolsWindow.webContents.send('new test string available', args);
}
function keydownFunction(event, args) {
  if (navigationEnabled) {
    const testString = buildTestString('keydown', args);
    toolsWindow.webContents.send('new test string available', testString);
  }
}
function keyupFunction(event, args) {
  if (navigationEnabled) {
    const testString = buildTestString('keyup', args);
    toolsWindow.webContents.send('new test string available', testString);
  }
}

function doubleclickFunction(event, args) {
  if (navigationEnabled) {
    toolsWindow.webContents.send('need to delete previous two');
    toolsWindow.webContents.send('new test string available', args);
  }
}

function saveTest(event, args) {
  const saveStream = fs.createWriteStream(`${global.savingName.name}.txt`);

  const savingArr = JSON.stringify([...args]);
  saveStream.write(savingArr);
  saveStream.close();
  readDirectory();
  dialog.showMessageBox({
    message: `Test was saved to ${global.savingName.name}`,
    buttons: ['Ok']
  });
}
function saveConvertedTest(args) {
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
  if (args === null || args === '') {
    mainWindow.loadURL(`https://yandex.ru`);
  } else {
    mainWindow.loadURL(args);
  }
}
function readDirectory() {
  fs.readdir(path.join(__dirname, '/tmp'), (err, dir) => {
    const files = dir.filter(el => el.match(/.*\.(txt)/gi));

    showAllWindow.webContents.send('all files from directory', files);
  });
}

function deleteFile(event, args) {
  const filePath = `${path.join(__dirname, '/tmp/')}${args}`;
  if (existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  readDirectory();
}
function editFile(event, args) {
  const filePath = `${path.join(__dirname, '/tmp/')}${args}`;
  const nameWithoutExtension = args.split('.');

  if (existsSync(filePath)) {
    global.savingName.name = `${path.join(__dirname, '/tmp/')}${
      nameWithoutExtension[0]
    }`;

    fs.readFile(filePath, 'utf-8', (err, data) => {
      toolsWindow.webContents.send('new test available', JSON.parse(data));
    });
  }
  readDirectory();
  toolsWindow.focus();
}
function convertFile(event, args) {
  const filePath = `${path.join(__dirname, '/tmp/')}${args}`;

  if (existsSync(filePath)) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      convertTest(null, JSON.parse(data));
    });
  }
  readDirectory();
  dialog.showMessageBox({
    message: 'Test was converted',
    buttons: ['Ok']
  });
}
function deleteAllFiles(event, args) {
  dialog.showMessageBox(
    {
      message: 'Do you want to delete all test files?',
      buttons: ['Ok', 'Cancel']
    },
    button => {
      if (button === 0) {
        const filePath = path.join(__dirname, '/tmp');
        // fs.readdir(filePath, (err, dir) => {
        //   const files = dir.filter(el => el.match(/.*\.(txt)/gi));
        const quantity = args.length;

        for (let i = 0; i < quantity; i += 1) {
          fs.unlinkSync(`${filePath}/${args[i]}`);
        }
        // });
        fs.readdir(path.join(__dirname, '/tmp'), (err, dir) => {
          const files = dir.filter(el => el.match(/.*\.(txt)/gi));

          showAllWindow.webContents.send('all files from directory', files);
        });
      }
    }
  );
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences: {
      allowRunningInsecureContent: true,
      webSecurity: false
    }
  });

  toolsWindow = new BrowserWindow({
    show: false,
    width: 700,
    height: 700
  });

  showAllWindow = new BrowserWindow({
    show: false,
    width: 500,
    height: 700
  });

  toolsWindow.loadURL(`file://${__dirname}/tools.html`);

  toolsWindow.webContents.on('did-finish-load', () => {
    if (!toolsWindow) {
      throw new Error('"toolsWindow" is not defined');
    }

    toolsWindow.show();
    toolsWindow.focus();
    const menuBuilder = new MenuBuilder(mainWindow, toolsWindow, showAllWindow);
    const menu = menuBuilder.buildMenu();
    Menu.setApplicationMenu(menu);
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
        mainWindow.webContents.executeJavaScript(
          'document.body.appendChild(script)'
        );
      }
    );
  });

  ipcMain.on('new-mouse-click-event', clickFunction);
  ipcMain.on('new-mouse-doubleclick-event', doubleclickFunction);

  ipcMain.on('keydown', keydownFunction);
  ipcMain.on('keyup', keyupFunction);

  ipcMain.on('new-url-event', loadTestingPage);
  ipcMain.on('save-test', saveTest);
  ipcMain.on('new-scroll', clickFunction);
  ipcMain.on('new-resize', clickFunction);
  ipcMain.on('save-converted-test', convertTest);
  ipcMain.on('delete all files', deleteAllFiles);
  ipcMain.on('convert all files', deleteAllFiles);
  ipcMain.on('delete file', deleteFile);
  ipcMain.on('edit file', editFile);
  ipcMain.on('convert file', convertFile);
  ipcMain.on('path to go', (event, args) => {
    if (navigationEnabled) {
      mainWindow.loadURL(args);
    }
  });
  ipcMain.on('navigate', () => {
    navigationEnabled = true;
  });
  ipcMain.on('do not navigate', () => {
    navigationEnabled = false;
  });
  ipcMain.on('need-to-reload', () => {
    mainWindow.reload();
  });
});
