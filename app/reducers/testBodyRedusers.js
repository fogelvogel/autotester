import {
  ADD_TEST_STRING,
  DELETE_PREVIOUS,
  CLEAR_TEST
} from '../actions/testBodyActions';
import type { Action } from './types';
import initialState from '../initialState';

export default function addStringReduser(state = initialState, action: Action) {
  switch (action.type) {
    case ADD_TEST_STRING: {
      console.log('test string was added');
      const newTestBody = state.testBody;
      newTestBody.push(action.newString);
      return Object.assign({}, state, {
        testBody: newTestBody
      });
    }
    case DELETE_PREVIOUS: {
      console.log('test string was deleted');
      const newTestBody = state.testBody;
      newTestBody.pop();
      newTestBody.pop();
      return Object.assign({}, state, {
        testBody: newTestBody
      });
    }
    case CLEAR_TEST: {
      console.log('test was deleted');
      const newTestBody = [];
      return Object.assign({}, state, {
        testBody: newTestBody
      });
    }
    default:
      return state;
  }
}
