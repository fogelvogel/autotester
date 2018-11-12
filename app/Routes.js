/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import ToolsBar from './containers/ToolsBar';
// import Counter from './components/Counter';
import Home from './components/Home';

const Routes = () => {
  console.log('1111');
  return (
    <App>
      <Switch>
        <Route path={routes.TEST} component={ToolsBar} />
        {/* <Route path={routes.COUNTER} component={Counter} /> */}
        <Route path={routes.HOME} component={Home} />
      </Switch>
    </App>
  );
};

export default Routes;
