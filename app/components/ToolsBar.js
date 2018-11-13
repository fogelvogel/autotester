import React, { Component } from 'react';
import styles from './Counter.css';
import { saveTestToFile } from '../helpers';
// import * as confStore from '../store/configureStore';
import { addTestString, deletePrevious } from '../actions/testBodyActions';
import * as initial from '../initialState';

const ipc = require('electron').ipcRenderer;

ipc.on('need to delete previous two', deletePreviousTwo);
ipc.on('new test string available', addString);
type Props = {
  waitForElement: () => void,
  fixData: () => void,
  doTestAction: () => void,
  clearTest: () => void,
  testBody: []
};
// // const store = confStore.configureStore();
const store = initial.getStore();

let state = null;
function helpingFunction() {
  state = store.getState();
  saveTestToFile(state);
}
function deletePreviousTwo() {
  store.dispatch(deletePrevious());
  store.dispatch(deletePrevious());
}
function addString(event, args) {
  store.dispatch(addTestString(args));
}

export default class ToolsBar extends Component<Props> {
  props: Props;

  render() {
    const {
      waitForElement,
      fixData,
      doTestAction,
      clearTest,
      testBody
    } = this.props;

    return (
      <div>
        <div>
          <div id="testField">Your test is here:</div>
        </div>
        <ul>
          {testBody.map(v => (
            <li>{`${v.actionName} | ${v.attributes}`}</li>
          ))}
        </ul>
        <div>
          <div className={styles.btnGroup}>
            <button
              className={styles.btn}
              onClick={waitForElement}
              data-tclass="btn"
              type="button"
            >
              wait
            </button>
            <button
              className={styles.btn}
              onClick={fixData}
              data-tclass="btn"
              type="button"
            >
              fix
            </button>
            <button
              className={styles.btn}
              onClick={doTestAction}
              data-tclass="btn"
              type="button"
            >
              test
            </button>
          </div>
          <div>
            <button
              className={styles.btn}
              onClick={clearTest}
              data-tclass="btn"
              type="button"
            >
              clear test
            </button>
            <button
              className={styles.btn}
              onClick={helpingFunction}
              data-tclass="btn"
              type="button"
            >
              save test
            </button>
          </div>
        </div>
      </div>
    );
  }
}
