import fs from 'fs';
import { autotesterStateType } from './reducers/types';

const path = require('path');

// const a = fs.createWriteStream(path.join(__dirname, '/tmp/clicks.txt'));
// const myPath = path.join(__dirname, '/tmp/clicks.txt');
// fs.writeFile(myPath, 'test', (err) => {
//   if (err) {
//     return console.log('file was not written');
//   }
//     console.log('file was written successfully');
// });

export default function checkField(value: string) {
  let isValid = true;
  if (value === '') {
    isValid = false;
  }
  return isValid;
}
export function saveTestToFile(state: autotesterStateType) {
  const a = fs.createWriteStream(path.join(__dirname, '/tmp/clicks.txt'));

  for (let i = 0; i < state.testBody.length; i += 1) {
    saveOneString(state.testBody[i], a);
  }
  console.log('test saved');
}
function saveOneString(testString, stream) {
  let paths;
  if (testString.paths !== null) {
    paths = `#${testString.paths.join('#')}`;
  }
  const attributes = `${testString.attributes.join(' ')}`;

  console.log(`${testString.actionName} ${attributes} ${paths}`);
  stream.write(`${testString.actionName} ${attributes} ${paths}`);
}
