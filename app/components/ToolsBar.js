import React, { Component } from 'react';
import styles from './Counter.css';
import { saveTestToFile } from '../helpers';
import * as confStore from '../store/configureStore';

type Props = {
  waitForElement: () => void,
  fixData: () => void,
  doTestAction: () => void,
  clearTest: () => void
};
const store = confStore.configureStore();
const state = store.getState();
function helpingFunction() {
  saveTestToFile(state);
}

export default class ToolsBar extends Component<Props> {
  props: Props;

  render() {
    const { waitForElement, fixData, doTestAction, clearTest } = this.props;

    return (
      <div>
        <div>
          <div id="testField">{console.log(this.props)}</div>
        </div>
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
