import {
  WAIT_FOR_ELEMENT,
  FIX_DATA,
  DO_TEST_ACTION
} from '../actions/toolsBar';
import type { Action } from './types';
import initialState from '../initialState';

export default function toolBar(state = initialState, action: Action) {
  switch (action.type) {
    case WAIT_FOR_ELEMENT: {
      return state;
    }

    case FIX_DATA: {
      return state;
    }
    case DO_TEST_ACTION: {
      return state;
    }
    default:
      return state;
  }
}
