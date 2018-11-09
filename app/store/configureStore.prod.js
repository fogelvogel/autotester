// @flow
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import type { autotesterStateType } from '../reducers/types';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
// Logging Middleware
const logger = createLogger({
  level: 'info',
  collapsed: true
});
const enhancer = applyMiddleware(thunk, router, logger);

function configureStore(initialState?: autotesterStateType) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
