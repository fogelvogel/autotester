import {
  ADD_TEST_STRING,
  DELETE_PREVIOUS,
  CLEAR_TEST
} from '../actions/testBodyActions';
import type { Action } from './types';

export default function addStringReduser(state = [], action: Action) {
  switch (action.type) {
    case ADD_TEST_STRING: {
      return [...state, action.newString];
    }
    case DELETE_PREVIOUS: {
      const newState = [...state];
      newState.pop();
      return newState;
    }
    case CLEAR_TEST: {
      return [];
    }
    default:
      return state;
  }
}
