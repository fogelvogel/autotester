/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import ToolsBar from './containers/ToolsBar';
// import FindTestsPage from './components/FindTests';
// import Counter from './components/Counter';
import Home from './components/Home';

const Routes = () => (
  <App>
    <Switch>
      <Route path={routes.TEST} component={ToolsBar} />
      {/* <Route path={routes.FINDTESTS} component={FindTestsPage} /> */}
      <Route path={routes.HOME} component={Home} />
    </Switch>
  </App>
);

export default Routes;
