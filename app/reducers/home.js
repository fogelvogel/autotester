import { SAVE_TESTING_URL } from '../actions/home';
import type { Action } from './types';
import initialState from '../initialState';

export default function home(state = initialState, action: Action) {
  switch (action.type) {
    case SAVE_TESTING_URL: {
      console.log('URL saved');
      return Object.assign({}, state, {
        url: action.url
      });
    }
    default:
      return state;
  }
}
