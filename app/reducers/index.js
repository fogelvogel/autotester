// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import toolsBar from './toolsBar';
import home from './home';

export default function createRootReducer(history: {}) {
  const routerReducer = connectRouter(history)(() => {});

  return connectRouter(history)(
    combineReducers({ router: routerReducer, toolsBar, home })
  );
}
