import React, { Component } from 'react';
import styles from './Counter.css';
import { saveTestToFile } from '../helpers';
// import * as confStore from '../store/configureStore';
import { addTestString, deletePrevious } from '../actions/testBodyActions';
import * as initial from '../initialState';

const ipc = require('electron').ipcRenderer;

let wait = null;
let exists = null;
const toTest = [];
const namesOfTestingAttributes = [
  'text',
  'size',
  'classes',
  'quantity',
  'focus'
];

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
    const arrToTest = [];
    for (let i = 0; i < 5; i += 1) {
      if (toTest[i].checked) {
        arrToTest.push(namesOfTestingAttributes[i]);
      }
    }
    const newArgs = Object.assign({}, args, {
      actionName: 'test',
      attributes: arrToTest
    });
    store.dispatch(addTestString(newArgs));
  } else if (state.mode === 1) {
    let waitValue = wait.value;
    if (!waitValue) {
      waitValue = '5000';
    }
    const existValue = exists.checked;
    const newArgs = Object.assign({}, args, {
      actionName: 'wait',
      attributes: [existValue, waitValue]
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
  const setWait = el => {
    wait = el;
  };

  const setExists = el => {
    exists = el;
  };

  const setText = el => {
    toTest[0] = el;
  };

  const setSize = el => {
    toTest[1] = el;
  };

  const setClasses = el => {
    toTest[2] = el;
  };

  const setQuantity = el => {
    toTest[3] = el;
  };

  const setFocus = el => {
    toTest[4] = el;
  };
  const addDelayString = () => {
    let delayValue = input.value;
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
            <input type="checkbox" name="isExisting" ref={setExists} />
            element exists
          </label>
          <input type="text" placeholder="5000" ref={setWait} />
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
            <input type="checkbox" name="text" ref={setText} />
            Text
          </label>
          <label htmlFor="size">
            <input type="checkbox" name="size" ref={setSize} />
            Size
          </label>
          <label htmlFor="classes">
            <input type="checkbox" name="classes" ref={setClasses} />
            Classes
          </label>
          <label htmlFor="quantity">
            <input type="checkbox" name="quantity" ref={setQuantity} />
            Quantity
          </label>
          <label htmlFor="focus">
            <input type="checkbox" name="focus" ref={setFocus} />
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
