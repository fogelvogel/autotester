import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import createRootReducer from '../reducers';
import * as counterActions from '../actions/counter';
import * as toolsActions from '../actions/toolsBar';
import * as homeActions from '../actions/home';
import * as testBodyActions from '../actions/testBodyActions';
import type { autotesterStateType } from '../reducers/types';

const history = createHashHistory();

const rootReducer = createRootReducer(history);

const configureStore = (initialState?: autotesterStateType) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Skip redux logs in console during the tests
  // if (process.env.NODE_ENV !== 'test') {
  console.log('logger is active');
  middleware.push(logger);
  // }

  // Redux DevTools Configuration
  const actionCreators = {
    ...toolsActions,
    ...counterActions,
    ...routerActions,
    ...homeActions,
    ...testBodyActions
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept(
      '../reducers',
      () => store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }
  return store;
};

export default { configureStore, history };
