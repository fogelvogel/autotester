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

// глобальная переменная хранит полное имя текущего открытого файла
global.savingName = { name: path.join(__dirname, `/tmp/test1`) };

// global.lastTestedPages = [
//   'rtretrtawt',
//   'dhasjkdha',
//   'rtretrtawt',
//   'rtretrtawt',
//   'dhasjkdha'
// ];

// this keys are being toggled by webdriver function "keys"
// эти клавиши функция вебдрайвера "keys" тогглит а не просто нажимает
const keysArr = ['Meta', 'Control', 'Alt', 'Shift'];

// should testing page be navigated by clicks (also affects on writing some actions to test)
// должна ли быть включена навигация на тестируемой странице (также влияет на запись некоторых действий)
let navigationEnabled = true;

let currentURL = `file://${path.join(
  __dirname,
  `../../autotest-runner/App/demo.html`
)}`;

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
// эта функция применяется для конвертации открытого теста
function convertTest(event, args) {
  const allTest = [];
  const testsCount = args.length;
  for (let i = 0; i < testsCount; i += 1) {
    allTest[i] = convertOneString(args[i]);
  }
  saveConvertedTest(allTest);
}
// эта функция для конвертации не открытого теста
function convertTestWOSavedName(event, args, name) {
  const allTest = [];
  const testsCount = args.length;
  for (let i = 0; i < testsCount; i += 1) {
    allTest[i] = convertOneString(args[i]);
  }
  saveConvertedTestWOsavedName(allTest, name);
}
// функция делает строки, содержащие expect
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
    case 'checked': {
      if (attrib[1] === true) {
        return `expect(await app.client.getAttribute('${paths}', 'checked')).not.toBeNull();\n`;
      }
      return `expect(await app.client.getAttribute('${paths}', 'checked')).toBeNull();\n`;
    }
    case 'value': {
      return `expect(await app.client.getAttribute('${paths}', 'value')).toEqual('${
        attrib[1]
      }');\n`;
    }
    case 'option': {
      return `select = await app.client.element('${paths}').value;
      select.selectByAttribute('value', ${attrib[1]});
      expect(select.getValue()).toEqual(${attrib[1]});\n`;
    }
    case 'selectedOption': {
      return `select = await app.client.element('${paths}').value;
      selectedIndex = (await app.client.elementIdAttribute('${paths}', 'options')).selectedIndex;
      expect((await app.client.elementIdAttribute('${paths}', 'options'))[selectedIndex]).toEqual(${
        attrib[1]
      });\n`;
    }
    default:
      break;
  }
}

// функция превращает nbsp в пробелы
function replaceNBSPs(str) {
  const re = new RegExp(String.fromCharCode(160), 'g');
  return str.replace(re, ' ');
}
// функция переводит одну строку теста в виде объекта в строку, пригодную для запуска в spectron и jest
function convertOneString(testString) {
  switch (testString.actionName) {
    case 'url': {
      return ` await app.client.url('${testString.attributes[0]}');
      await app.client.waitUntilWindowLoaded();
      `;
    }
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
// подпрограмма помогает собирать строку теста из объекта, приходящего из тест. страницы
// практически не используется
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
// отправляется сообщение что произошел клик в тестируемую страницу
function clickFunction(event, args) {
  if (!navigationEnabled) {
    if (args.actionName === 'scroll' || args.actionName === 'resize') {
      return;
    }
  }
  toolsWindow.webContents.send('new test string available', args);
}
// отправляется сообщение о том что произошло событие нажатия клавиши на тест. странице
function keydownFunction(event, args) {
  if (navigationEnabled) {
    const testString = buildTestString('keydown', args);
    toolsWindow.webContents.send('new test string available', testString);
  }
}
// отправляется сообщение о том что произошло событие отпускания клавиши на тест. странице
function keyupFunction(event, args) {
  if (navigationEnabled) {
    const testString = buildTestString('keyup', args);
    toolsWindow.webContents.send('new test string available', testString);
  }
}
// сообщение о том, что произошел даблклик в тестуруемую страницу
// отправляется в окно с инструментами
function doubleclickFunction(event, args) {
  if (navigationEnabled) {
    // сообщение что надо удалить два пердыдущих клика т.к. даблклик генерирует три события,
    // два из которых (два обычных клика) надо проигнорировать
    toolsWindow.webContents.send('need to delete previous two');
    toolsWindow.webContents.send('new test string available', args);
  }
}
// сохранение текущего открытого теста
function saveTest(event, args) {
  const saveStream = fs.createWriteStream(`${global.savingName.name}.txt`);

  const savingArr = JSON.stringify([...args]);
  saveStream.write(savingArr);
  saveStream.close();
  readDirectory();
  dialog.showMessageBox({
    message: `Test was saved to ${global.savingName.name}.txt`,
    buttons: ['Ok']
  });
}
// конвертировать текущий открытый тест
// в аргументах - строки теста
function saveConvertedTest(args) {
  const fileNames = global.savingName.name.split('/');
  const last = fileNames.pop();
  const convertStream = fs.createWriteStream(
    path.join(__dirname, `../../autotest-runner/__tests__/${last}-converted.js`)
  );
  const savingArr = [...args];
  const arrLength = savingArr.length;
  convertStream.write(`var Application = require('spectron').Application;
  var electronPath = require('electron');
  const path = require('path');
  const fs = require('fs');
  jest.setTimeout(40000);
  const createApp = async () => {

  var app = new Application({
      path: electronPath,
      args: [
          path.join(__dirname, '..')
      ],
  });
      
  await app.start();
  return app;
}
test('${last}', async () => {
const app = await createApp();
let select = null;
let selectedIndex = null;
`);
  for (let i = 0; i < arrLength; i += 1) {
    convertStream.write(savingArr[i]);
  }
  convertStream.write(`await app.stop();
});`);
  dialog.showMessageBox({
    message: `Test was converted to ${path.join(
      __dirname,
      `../../autotest-runner/__tests__/${last}-converted.js`
    )}`,
    buttons: ['Ok']
  });
}
// сохранить тест не используя глобальную переменную имени файла
function saveConvertedTestWOsavedName(args, name) {
  const fileNames = global.savingName.name.split('/');
  fileNames.pop();
  const testName = name.split('.');
  const convertStream = fs.createWriteStream(
    // `${fileNames.join('/')}../../../autotest-runner/__tests__/${testName[0]}-converted.txt`
    path.join(
      __dirname,
      `../../autotest-runner/__tests__/${testName[0]}-converted.js`
    )
  );
  const savingArr = [...args];
  const arrLength = savingArr.length;

  convertStream.write(`var Application = require('spectron').Application;
    var electronPath = require('electron');
    const path = require('path');
    const fs = require('fs');
    jest.setTimeout(40000);
    const createApp = async () => {

    var app = new Application({
        path: electronPath,
        args: [
            path.join(__dirname, '..')
        ],
    });
        
    await app.start();
    return app;
}
test('${testName[0]}', async () => {
  const app = await createApp();
  let select = null;
  let selectedIndex = null;
  `);
  for (let i = 0; i < arrLength; i += 1) {
    convertStream.write(savingArr[i]);
  }
  convertStream.write(`await app.stop();
});`);
  dialog.showMessageBox({
    message: `Test was converted to ${path.join(
      __dirname,
      `../../autotest-runner/__tests__/${testName[0]}-converted.js`
    )}`,
    buttons: ['Ok']
  });
}
// тестируемая страница загружается в главное окно
function loadTestingPage(event, args) {
  if (args === null || args === '') {
    mainWindow.loadURL(
      `file://${path.join(__dirname, `../../autotest-runner/App/demo.html`)}`
    );
  } else {
    mainWindow.loadURL(args);
    currentURL = args;
  }
}
// функция стчитывает тестовые файлы и отправляет их в окно файлов
function readDirectory() {
  fs.readdir(path.join(__dirname, '/tmp'), (err, dir) => {
    const files = dir.filter(el => el.match(/.*\.(txt)/gi));

    showAllWindow.webContents.send('all files from directory', files);
  });
}

function readSettings() {
  const filePath = path.join(__dirname, '/settings.txt');

  fs.readFile(filePath, 'utf-8', (err, data) => {
    global.lastTestedPages = [...JSON.parse(data).visited];
  });
}

// удаление выбранного файла из директории
function deleteFile(event, args) {
  const filePath = `${path.join(__dirname, '/tmp/')}${args}`;
  // если файл существует
  if (existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  readDirectory();
}
// открытие ранее сохраненного файла на редактирование
function editFile(event, args) {
  const filePath = `${path.join(__dirname, '/tmp/')}${args}`;
  const nameWithoutExtension = args.split('.');

  // если файл существует
  if (existsSync(filePath)) {
    global.savingName.name = `${path.join(__dirname, '/tmp/')}${
      nameWithoutExtension[0]
    }`;
    // считать файл из папки
    fs.readFile(filePath, 'utf-8', (err, data) => {
      toolsWindow.webContents.send('new test available', JSON.parse(data));
    });
  }
  readDirectory();
  toolsWindow.focus();
}

// конвертация файла без использования глобальной переменной текущего открытого файла
// нужна чтобы конвертировать любой выбранный файл, а не только тот, который открыт
function convertFileWOSavedName(event, args) {
  const filePath = `${path.join(__dirname, '/tmp/')}${args}`;
  if (existsSync(filePath)) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      convertTestWOSavedName(null, JSON.parse(data), args);
    });
  }
}
// функция вызывается из окна с файлами тестов и удаляет все файлы ПОКАЗАННЫЕ В ЭТОМ ОКНЕ
function deleteAllFiles(event, args) {
  // окошко подтверждения удаления всех тестов
  dialog.showMessageBox(
    {
      message: 'Do you want to delete all test files?',
      buttons: ['Ok', 'Cancel']
    },
    button => {
      // если нажата "Ок"
      if (button === 0) {
        const filePath = path.join(__dirname, '/tmp');
        const quantity = args.length;
        // удалить все
        for (let i = 0; i < quantity; i += 1) {
          fs.unlinkSync(`${filePath}/${args[i]}`);
        }

        fs.readdir(path.join(__dirname, '/tmp'), (err, dir) => {
          const files = dir.filter(el => el.match(/.*\.(txt)/gi));
          // отправить обратно в окно файлы, оставшиеся в папке
          showAllWindow.webContents.send('all files from directory', files);
        });
      }
    }
  );
}

// функция вызывается из окна с файлами тестов и конвертирует все файлы в папке
function convertAllFiles() {
  let quantity = null;
  fs.readdir(path.join(__dirname, '/tmp'), (err, dir) => {
    const files = dir.filter(el => el.match(/.*\.(txt)/gi));
    quantity = files.length;

    for (let i = 0; i < quantity; i += 1) {
      convertFileWOSavedName(null, files[i]);
    }
    let mess;

    if (quantity !== null && quantity !== 0) {
      mess = 'All tests were converted';
    } else {
      mess = 'No tests were converted';
    }

    dialog.showMessageBox({
      message: mess,
      buttons: ['Ok']
    });
  });
}

app.on('window-all-closed', () => {
  mainWindow = null;
  toolsWindow = null;
  showAllWindow = null;
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

  // создаются экземпляры окон с заданными размерами
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  toolsWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768
  });

  showAllWindow = new BrowserWindow({
    show: false,
    width: 469,
    height: 665
  });
  readSettings();
  toolsWindow.loadURL(`file://${__dirname}/tools.html`);
  // после того как загрузится окно с инструментами
  // показать его и меню приложения
  toolsWindow.webContents.on('did-finish-load', () => {
    if (!toolsWindow) {
      throw new Error('"toolsWindow" is not defined');
    }

    toolsWindow.show();
    toolsWindow.focus();
    toolsWindow.toggleDevTools();

    const menuBuilder = new MenuBuilder(mainWindow, toolsWindow, showAllWindow);
    const menu = menuBuilder.buildMenu();
    Menu.setApplicationMenu(menu);
  });

  // после того как страница со всеми файлами загрузится
  // показать ее и заполнить таблицу
  showAllWindow.webContents.on('did-finish-load', () => {
    if (!showAllWindow) {
      throw new Error('"showAllWindow" is not defined');
    }
    showAllWindow.show();
    showAllWindow.focus();
    showAllWindow.toggleDevTools();
    readDirectory();
  });

  // после того как тест.страница загрузится
  // показать ее и загрузить в нее скрипт, перехватывающий события
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();

    // const content = fs.readFileSync(path.join(__dirname, 'TestingPropertiesConfig.json'));
    // const confObject = JSON.parse(content);

    // ipcMain.send('config object', confObject);
    toolsWindow.webContents.send('new test string available', {
      actionName: 'url',
      attributes: [currentURL],
      paths: []
    });

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

  // реакция главного процесса на событыя
  // клик по тестируемой странице
  ipcMain.on('new-mouse-click-event', clickFunction);
  // даблклик по тестируемой странице
  ipcMain.on('new-mouse-doubleclick-event', doubleclickFunction);
  // нажатие клавиши на тест. странице
  ipcMain.on('keydown', keydownFunction);
  // отжатие клавиши
  ipcMain.on('keyup', keyupFunction);
  // загрузка url тест. страницы
  ipcMain.on('new-url-event', loadTestingPage);
  // сохранить открытый тест
  ipcMain.on('save-test', saveTest);
  // тест. стр. скролится
  ipcMain.on('new-scroll', clickFunction);
  // тест. стр. ресайзится
  ipcMain.on('new-resize', clickFunction);
  // сохраняется сконвертированный открытый тест
  ipcMain.on('save-converted-test', convertTest);
  // удалить все тестовые файлы из папки
  ipcMain.on('delete all files', deleteAllFiles);
  // сконвертировать все тесты в папке
  ipcMain.on('convert all files', convertAllFiles);
  // удалить выбранный файл
  ipcMain.on('delete file', deleteFile);
  // редактировать выбранный файл
  ipcMain.on('edit file', editFile);
  // конвертировать выбранный файл

  ipcMain.on('convert file', convertFileWOSavedName);
  // загрузка тест. страницы с новым url после перехода по ссылке
  ipcMain.on('path to go', (event, args) => {
    if (navigationEnabled) {
      currentURL = args;
      mainWindow.loadURL(args);
    }
  });
  // включить переход по ссылкам в тест. странице
  ipcMain.on('navigate', () => {
    navigationEnabled = true;
  });
  // выключить переход по ссылкам в тест. странице
  ipcMain.on('do not navigate', () => {
    navigationEnabled = false;
  });
  // тест. страницу необходимо обновить
  ipcMain.on('need-to-reload', () => {
    mainWindow.reload();
  });
});
