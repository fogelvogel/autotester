import {
  WAIT_FOR_ELEMENT,
  FIX_DATA,
  DO_TEST_ACTION
} from '../actions/toolsBar';
import type { Action } from './types';
import initialState from '../initialState';

export default function toolBar(state = initialState, action: Action) {
  console.log(state);
  switch (action.type) {
    case WAIT_FOR_ELEMENT: {
      console.log('waitForElement');
      return state;
    }

    case FIX_DATA: {
      console.log('fixData');
      return state;
    }
    case DO_TEST_ACTION: {
      console.log('doTestAction');
      return state;
    }
    default:
      return state;
  }
}
