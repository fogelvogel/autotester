import React, { Component } from 'react';
import styles from './Counter.css';

export default class ToolsBar extends Component<Props> {
  props: Props;

  currentDeleting = null;

  render() {
    return (
      <div>
        <div>
          <h2 id="testField">Your test is here:</h2>
        </div>

        <div>
          <div className={styles.btnGroup}>
            <button className={styles.btn} data-tclass="btn" type="button">
              wait for smth
            </button>
            <button className={styles.btn} data-tclass="btn" type="button">
              write action
            </button>
            <button className={styles.btn} data-tclass="btn" type="button">
              test element
            </button>
          </div>
          <div>
            <button className={styles.btn} data-tclass="btn" type="button">
              clear test
            </button>
            <button className={styles.btn} data-tclass="btn" type="button">
              save test
            </button>
            <button className={styles.btn} data-tclass="btn" type="button">
              run test
            </button>
            <button className={styles.btn} data-tclass="btn" type="button">
              convert test
            </button>
          </div>
        </div>
      </div>
    );
  }
}
