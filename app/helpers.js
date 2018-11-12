import { autotesterStateType } from './reducers/types';

export default function checkField(value: string) {
  let isValid = true;
  if (value === '') {
    isValid = false;
  }
  return isValid;
}
export function saveTestToFile(state: autotesterStateType) {
  console.log('test saved', state);
}
