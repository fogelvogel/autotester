import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as toolsActions from '../actions/toolsBar';
import * as testActions from '../actions/testBodyActions';
import ToolsBar from '../components/ToolsBar';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, toolsActions, testActions),
    dispatch
  );
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(ToolsBar);
// const mapDispatchToProps = {
//   ...toolsActions,
//   ...testActions
// };
// export default mapDispatchToProps;
