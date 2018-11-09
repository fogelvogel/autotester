import type { testingString } from '../reducers/types';

export const ADD_TEST_STRING = 'ADD_TEST_STRING';
export const DELETE_PREVIOUS = 'DELETE_PREVIOUS';
export const CLEAR_TEST = 'CLEAR_TEST';
export const SAVE_TEST = 'SAVE_TEST';

export function addTestString(newString: testingString) {
  return {
    type: ADD_TEST_STRING,
    newString
  };
}
export function deletePrevious() {
  return {
    type: DELETE_PREVIOUS
  };
}
export function clearTest() {
  return {
    type: CLEAR_TEST
  };
}
