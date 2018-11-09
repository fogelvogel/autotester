import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as toolsActions from '../actions/toolsBar';
import * as testActions from '../actions/testBodyActions';
import * as homeActions from '../actions/home';
import ToolsBar from '../components/ToolsBar';
import TestTable from '../components/TestTable';
import Home from '../components/Home';

function mapStateToProps(state) {
  return {
    mode: state.mode
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, toolsActions, testActions, homeActions),
    dispatch
  );
}

export default connect(
  mapDispatchToProps,
  mapStateToProps
)(ToolsBar, TestTable, Home);

// const mapDispatchToProps = {
//   ...toolsActions,
//   ...testActions
// };
// export default mapDispatchToProps;
