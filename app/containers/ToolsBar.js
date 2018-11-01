import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as toolsActions from '../actions/toolsBar';
import ToolsBar from '../components/ToolsBar';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(toolsActions, dispatch);
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(ToolsBar);
