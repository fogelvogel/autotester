import React, { Component } from 'react';
import styles from './Counter.css';

type Props = {
  waitForElement: () => void,
  fixData: () => void,
  doTestAction: () => void,
  resizeWindow: () => void
};

export default class ToolsBar extends Component<Props> {
  props: Props;

  render() {
    const { waitForElement, fixData, doTestAction, resizeWindow } = this.props;

    return (
      <div>
        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={waitForElement}
            data-tclass="btn"
            type="button"
          >
            <i className="button wait" />
          </button>
          <button
            className={styles.btn}
            onClick={fixData}
            data-tclass="btn"
            type="button"
          >
            <i className="button fix" />
          </button>
          <button
            className={styles.btn}
            onClick={doTestAction}
            data-tclass="btn"
            type="button"
          >
            <i className="button test" />
          </button>

          <button
            className={styles.btn}
            onClick={resizeWindow}
            data-tclass="btn"
            type="button"
          >
            <i className="button resize" />
          </button>
        </div>
      </div>
    );
  }
}
