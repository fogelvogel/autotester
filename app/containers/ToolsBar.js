import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as toolsActions from '../actions/toolsBar';
import * as testActions from '../actions/testBodyActions';
import ToolsBar from '../components/ToolsBar';
// import TestTable from '../components/TestTable';

// function mapStateToProps(state) {
//   return {
//     mode: state.mode,
//     testBody: state.testBody
//   };
// }
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, testActions, toolsActions),
    dispatch
  );
}

export default connect(
  () => ({}),
  // mapStateToProps,
  mapDispatchToProps
)(ToolsBar);
