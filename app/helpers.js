import { autotesterStateType } from './reducers/types';
// import * as initial from './initialState';

const ipc = require('electron').ipcRenderer;

// const a = fs.createWriteStream(path.join(__dirname, '/tmp/clicks.txt'));
// const myPath = path.join(__dirname, '/tmp/clicks.txt');
// fs.writeFile(myPath, 'test', (err) => {
//   if (err) {
//     return console.log('file was not written');
//   }
//     console.log('file was written successfully');
// });
// const keysArr = ['Meta', 'Control', 'Alt', 'Shift'];
// const webdriverKeys = ['command', 'ControlLeft', 'AltLeft', 'ShiftLeft'];

export default function checkField(value: string) {
  let isValid = true;
  if (value === '') {
    isValid = false;
  }
  return isValid;
}
export function saveTestToFile(state: autotesterStateType) {
  const allTest = [];

  for (let i = 0; i < state.testBody.length; i += 1) {
    allTest[i] = saveOneString(state.testBody[i]);
  }
  ipc.send('save-test', allTest);
}
function saveOneString(testString) {
  let paths;
  if (testString.paths !== null) {
    paths = `#${testString.paths.join('#')}`;
  }
  const attributes = `${testString.attributes.join(' ')}`;

  return `${testString.actionName} ${attributes} ${paths}\n`;
}

export function convertTest(state: autotesterStateType) {
  ipc.send('save-converted-test', state.testBody);
}
