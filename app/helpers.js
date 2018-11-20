import { autotesterStateType } from './reducers/types';

const ipc = require('electron').ipcRenderer;

// const a = fs.createWriteStream(path.join(__dirname, '/tmp/clicks.txt'));
// const myPath = path.join(__dirname, '/tmp/clicks.txt');
// fs.writeFile(myPath, 'test', (err) => {
//   if (err) {
//     return console.log('file was not written');
//   }
//     console.log('file was written successfully');
// });
const keysArr = ['Meta', 'Control', 'Alt', 'Shift'];
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
      const index = keysArr.findIndex;
      if (index === -1) {
        return;
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
function makeTestingString(attribute, paths) {
  const attrib = attribute.split('=');
  const sizes = attrib[1].split(' ');

  switch (attrib[0]) {
    case 'text': {
      return `expect((await app.client.getText('${paths}')).value).toEqual('${
        attrib[1]
      }');\n`;
    }
    case 'size': {
      return `expect(await app.client.getElementSize('${paths}')).toEqual({width: ${
        sizes[0]
      }, height: ${sizes[1]}});\n`;
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
export function convertTest(state: autotesterStateType) {
  const allTest = [];

  for (let i = 0; i < state.testBody.length; i += 1) {
    allTest[i] = convertOneString(state.testBody[i]);
  }
  ipc.send('save-converted-test', allTest);
}
