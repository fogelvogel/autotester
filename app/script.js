// import electron from 'electron';

// window.nodeRequire = require;
// delete(window.require);
const ipc = require('electron').ipcRenderer;

console.log('this script was injected');

// const ipc = electron.ipcRenderer;
window.onclick = function(e) {
  ipc.send('new-mouse-click-event', e.target.className);
  console.log(e.target);
};
window.ondrag = function(e) {
  ipc.send('new-mouse-drag-event', e.target.class);
};
window.ondragend = function(e) {
  ipc.send('new-mouse-dragend-event', e.target.class);
};
window.onkeypress = function(e) {
  ipc.send('key-pressed', e.keyCode);
};
window.onkeydown = function(e) {
  ipc.send('keydown', e.key);
};
