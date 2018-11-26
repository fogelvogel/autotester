// @flow
import { app, Menu, shell, BrowserWindow, dialog } from 'electron';
// import fs from 'fs';
const fs = require('fs');
const path = require('path');
// import { saveTestToFile } from './helpers';
// import { getStore } from './initialState';

// const store = initial.getStore();

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  toolsWindow: BrowserWindow;

  showAllWindow: BrowserWindow;

  dialog = dialog;

  openFile() {
    this.dialog.showOpenDialog(
      {
        defaultPath: path.join(__dirname, '/tmp'),
        filters: [
          {
            name: 'text',
            extensions: ['txt']
          }
        ]
      },
      fileNames => {
        if (fileNames !== undefined) {
          const fileName = fileNames[0];
          const name = fileName.split('.');
          const index = 0;
          global.savingName.name = name[index];
          fs.readFile(fileName, 'utf-8', (err, data) => {
            this.toolsWindow.webContents.send(
              'new test available',
              JSON.parse(data)
            );
          });
        }
      }
    );
  }

  saveFile() {
    this.dialog.showSaveDialog(
      { filters: [{ name: 'text', extensions: ['txt'] }] },
      fileName => {
        if (fileName !== undefined) {
          const name = fileName.split('.');
          const index = 0;
          global.savingName.name = name[index];
          this.toolsWindow.webContents.send('need to save as', fileName);
          //   global.savingName.name = ;
          //     fs.writeFile(fileName, 'dadasd', (err) => {
          //     if (err !== null) console.log('file was not written', err);
          //   })
        }
      }
    );
  }

  save() {
    this.toolsWindow.webContents.send('need to save');
  }

  showAll() {
    this.showAllWindow.loadURL(`file://${__dirname}/findTests.html`);
  }

  constructor(
    mainWindow: BrowserWindow,
    toolsWindow: BrowserWindow,
    showAllWindow: BrowserWindow
  ) {
    this.mainWindow = mainWindow;
    this.toolsWindow = toolsWindow;
    this.showAllWindow = showAllWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(this.mainWindow);
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    };
    const subMenuFile = {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'Command+O',
          selector: 'open:',
          click: () => {
            this.openFile();
          }
        },
        {
          label: 'Save',
          accelerator: 'Command+S',
          selector: 'save:',
          click: () => {
            this.save();
          }
        },
        {
          label: 'Save as',
          accelerator: 'Shift+Command+S',
          selector: 'saveAs:',
          click: () => {
            this.saveFile();
          }
        },
        {
          label: 'Show all',
          selector: 'showAll:',
          click: () => {
            this.showAll();
          }
        }
      ]
    };
    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        }
      ]
    };
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.toggleDevTools();
            this.toolsWindow.toggleDevTools();
            this.showAllWindow.toggleDevTools();
          }
        }
      ]
    };
    // const subMenuViewProd = {
    //   label: 'View',
    //   submenu: [
    //     {
    //       label: 'Toggle Full Screen',
    //       accelerator: 'Ctrl+Command+F',
    //       click: () => {
    //         this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
    //       }
    //     }
    //   ]
    // };
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    };
    const subMenuHelp = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('http://electron.atom.io');
          }
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/atom/electron/tree/master/docs#readme'
            );
          }
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://discuss.atom.io/c/electron');
          }
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/atom/electron/issues');
          }
        }
      ]
    };

    const subMenuView = subMenuViewDev;
    // process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;

    return [
      subMenuAbout,
      subMenuFile,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuHelp
    ];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O'
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            }
          }
        ]
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  }
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.toggleDevTools();
                  }
                }
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                }
              ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('http://electron.atom.io');
            }
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/atom/electron/tree/master/docs#readme'
              );
            }
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://discuss.atom.io/c/electron');
            }
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/atom/electron/issues');
            }
          }
        ]
      }
    ];

    return templateDefault;
  }
}
