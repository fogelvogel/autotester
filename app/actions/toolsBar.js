export const WAIT_FOR_ELEMENT = 'WAIT_FOR_ELEMENT';
export const FIX_DATA = 'FIX_DATA';
export const DO_TEST_ACTION = 'DO_TEST_ACTION';

const ipc = require('electron').ipcRenderer;

export function waitForElement() {
  ipc.send('do not navigate');
  return {
    type: WAIT_FOR_ELEMENT
  };
}

export function fixData() {
  ipc.send('navigate');
  return {
    type: FIX_DATA
  };
}
export function doTestAction() {
  ipc.send('do not navigate');
  return {
    type: DO_TEST_ACTION
  };
}
