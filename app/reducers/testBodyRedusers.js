import {
  ADD_TEST_STRING,
  DELETE_PREVIOUS,
  DELETE_ONE_STRING,
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
    case DELETE_ONE_STRING: {
      const newState = [...state];
      delete newState[action.number - 1];
      return newState.filter(el => typeof el !== 'undefined');
    }
    case CLEAR_TEST: {
      return [];
    }
    default:
      return state;
  }
}
