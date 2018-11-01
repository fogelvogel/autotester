export const WAIT_FOR_ELEMENT = 'WAIT_FOR_ELEMENT';
export const FIX_DATA = 'FIX_DATA';
export const DO_TEST_ACTION = 'DO_TEST_ACTION';
export const RESIZE_WINDOW = 'RESIZE_WINDOW';

export function waitForElement() {
  return {
    type: WAIT_FOR_ELEMENT
  };
}

export function fixData() {
  return {
    type: FIX_DATA
  };
}
export function doTestAction() {
  return {
    type: DO_TEST_ACTION
  };
}
export function resizeWindow() {
  return {
    type: RESIZE_WINDOW
  };
}
