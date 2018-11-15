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
  deleteOneString: () => void,
  testBody: [],
  mode: 0
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
  state = store.getState();
  if (state.mode === 2) {
    store.dispatch(addTestString(args));
  } else if (state.mode === 3) {
    const newArgs = Object.assign({}, args, {
      actionName: 'test',
      attributes: ['text']
    });
    store.dispatch(addTestString(newArgs));
  } else if (state.mode === 1) {
    const newArgs = Object.assign({}, args, {
      actionName: 'wait',
      attributes: ['notexists', '5000']
    });
    store.dispatch(addTestString(newArgs));
  }
}

export default class ToolsBar extends Component<Props> {
  props: Props;

  currentDeleting = null;

  render() {
    const {
      waitForElement,
      fixData,
      doTestAction,
      clearTest,
      deleteOneString,
      testBody,
      mode
    } = this.props;

    return (
      <div>
        <div>
          <h2 id="testField">Your test is here:</h2>
        </div>
        <table border="1">
          <tr>
            <td>№</td>
            <td>action</td>
            <td>atribute</td>
            <td>paths</td>
            <td>delete</td>
          </tr>
          {testBody.map((v, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{`${v.actionName}`}</td>
              <td>{`${v.attributes}`}</td>
              <td>{`${v.paths}`}</td>
              <td>
                <button
                  className={styles.btn}
                  onClick={() => {
                    deleteOneString(index + 1);
                  }}
                  data-tclass="btn"
                  type="button"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </table>

        <div>
          <div className={styles.btnGroup}>
            <button
              className={styles.btn}
              onClick={waitForElement}
              data-tclass="btn"
              type="button"
            >
              wait for smth
            </button>
            <button
              className={styles.btn}
              onClick={fixData}
              data-tclass="btn"
              type="button"
            >
              write action
            </button>
            <button
              className={styles.btn}
              onClick={doTestAction}
              data-tclass="btn"
              type="button"
            >
              test element
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
            <button className={styles.btn} data-tclass="btn" type="button">
              run test
            </button>
            <button className={styles.btn} data-tclass="btn" type="button">
              convert test
            </button>
          </div>
        </div>
        <DrawAdditionalFields mode={mode} />
      </div>
    );
  }
}
function DrawAdditionalFields(props) {
  const currMode = props.mode;

  let input = null;

  const setDelay = el => {
    input = el;
  };

  const addDelayString = () => {
    let delayValue = input.value;
    console.log('aaaaaaa', input.value);
    if (!delayValue) {
      delayValue = '1000';
    }
    store.dispatch(
      addTestString({
        actionName: 'wait',
        attributes: [delayValue],
        paths: []
      })
    );
  };
  switch (currMode) {
    case 1: {
      return (
        <div>
          <h3>
            Type delay in milliseconds or pick element, that needs to be wated
          </h3>
          <input type="text" placeholder="1000" ref={setDelay} />
          <button type="button" onClick={addDelayString}>
            Add delay
          </button>
          <h3>or</h3>
          <label htmlFor="isExisting">
            <input type="checkbox" name="isExisting" />
            element exists
          </label>
          <input type="text" placeholder="5000" />
          <div>
            <p>
              if you want to wait for some element to exist pick an element by
              your cursor
            </p>
          </div>
        </div>
      );
    }
    case 2: {
      return (
        <div>
          <h3>Do something witn your page</h3>
          <p>click anythere, type something or resize testing page window</p>
        </div>
      );
    }
    case 3: {
      return (
        <div>
          <h3>Test some values</h3>
          <label htmlFor="text">
            <input type="checkbox" name="text" checked="checked" />
            Text
          </label>
          <label htmlFor="size">
            <input type="checkbox" name="size" />
            Size
          </label>
          <label htmlFor="classes">
            <input type="checkbox" name="classes" />
            Classes
          </label>
          <label htmlFor="quantity">
            <input type="checkbox" name="quantity" />
            Quantity
          </label>
          <label htmlFor="focus">
            <input type="checkbox" name="focus" />
            Focus
          </label>
          <label htmlFor="attribute">
            <input type="checkbox" name="attribute" />
            Attribute
          </label>
          <p>
            pick the characteristics, that you want to be tested, then pick an
            element by your cursor
          </p>
        </div>
      );
    }
    default:
      return <h3>Select mode please</h3>;
  }
}
