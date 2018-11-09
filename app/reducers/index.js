// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import toolsBar from './toolsBar';
import testBody from './testBodyRedusers';

export default function createRootReducer(history: {}) {
  const routerReducer = connectRouter(history)(() => {});

  return connectRouter(history)(
    combineReducers({
      router: routerReducer,
      mode: toolsBar,
      testBody
    })
  );
}
