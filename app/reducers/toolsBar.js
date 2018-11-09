import {
  WAIT_FOR_ELEMENT,
  FIX_DATA,
  DO_TEST_ACTION
} from '../actions/toolsBar';
import type { Action } from './types';

export default function toolBar(state = 0, action: Action) {
  let newMode;
  switch (action.type) {
    case WAIT_FOR_ELEMENT: {
      newMode = 2;
      break;
    }
    case FIX_DATA: {
      newMode = 3;
      break;
    }
    case DO_TEST_ACTION: {
      newMode = 4;
      break;
    }
    default:
      return state;
  }
  return newMode;
}
