import React, { Component } from 'react';
import styles from './Counter.css';
// import { saveTestToFile } from '../helpers';
// import * as confStore from '../store/configureStore';
import { addTestString, deletePrevious } from '../actions/testBodyActions';
import * as initial from '../initialState';
import { convertTest } from '../helpers';

const ipc = require('electron').ipcRenderer;

let prevString;

let wait = null;
let exists = null;
const toTest = [];
const namesOfTestingAttributes = ['text', 'size', 'classes'];

ipc.on('need to delete previous two', deletePreviousTwo);
ipc.on('new test string available', addString);
ipc.on('new test available', loadTest);
ipc.on('need to save as', helpingFunction);
ipc.on('need to save', helpingFunction);

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
  ipc.send('save-test', state.testBody);
  // saveTestToFile(state);
}

function helpConvertTest() {
  state = store.getState();
  convertTest(state);
}
function deletePreviousTwo() {
  state = store.getState();
  if (state.mode === 2) {
    store.dispatch(deletePrevious());
    store.dispatch(deletePrevious());
  }
}
function loadTest(event, args) {
  state = store.getState();
  store.dispatch({ type: 'CLEAR_TEST' });
  const testBody = [...args];
  const testBodyLength = testBody.length;
  console.log(testBody);
  for (let i = 0; i < testBodyLength; i += 1) {
    store.dispatch(
      addTestString({
        actionName: testBody[i].actionName,
        attributes: testBody[i].attributes,
        paths: testBody[i].paths
      })
    );
  }
}

function addString(event, args) {
  state = store.getState();
  if (state.testBody.length > 0)
    prevString = state.testBody[state.testBody.length - 1];

  if (state.mode === 2) {
    if (prevString !== undefined) {
      if (
        prevString.actionName === args.actionName &&
        args.actionName === 'scroll' &&
        prevString.attributes[1] === args.attributes[1]
      ) {
        store.dispatch(deletePrevious());
      }
      if (
        prevString.actionName === args.actionName &&
        args.actionName === 'resize'
      ) {
        store.dispatch(deletePrevious());
      }
    }
    //   prevString = {
    //     actionName: args.actionName,
    //     attributes: args.attributes,
    //     paths: args.paths
    //   };
    store.dispatch(
      addTestString({
        actionName: args.actionName,
        attributes: args.attributes,
        paths: args.paths
      })
    );
  } else if (state.mode === 3) {
    if (args.actionName !== 'click') {
      return;
    }
    const arrToTest = [];
    let counter = 0;
    for (let i = 0; i < 3; i += 1) {
      if (toTest[i].checked) {
        arrToTest.push(namesOfTestingAttributes[i]);
        arrToTest[counter] += `=${args.testParams[i]}`;
        counter += 1;
      }
    }
    const newArgs = {
      actionName: 'test',
      attributes: arrToTest,
      paths: args.paths
    };
    // prevString = newArgs;
    store.dispatch(addTestString(newArgs));
  } else if (state.mode === 1) {
    let waitValue = wait.value;
    if (!waitValue) {
      waitValue = '5000';
    }
    const existValue = exists.checked;
    const newArgs = {
      actionName: 'wait',
      attributes: [existValue, waitValue],
      paths: args.paths
    };
    // prevString = newArgs;
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
        <table className="w3-table w3-bordered">
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
                  onClick={() => {
                    deleteOneString(index + 1);
                  }}
                  className="w3-btn w3-red"
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
              className="w3-btn w3-pink"
              onClick={waitForElement}
              type="button"
            >
              wait for smth
            </button>
            <button className="w3-btn w3-pink" onClick={fixData} type="button">
              write action
            </button>
            <button
              className="w3-btn w3-pink"
              onClick={doTestAction}
              type="button"
            >
              test element
            </button>
          </div>
          <div>
            <button
              className="w3-btn w3-sand"
              onClick={clearTest}
              type="button"
            >
              clear test
            </button>
            <button
              className="w3-btn w3-sand"
              onClick={helpingFunction}
              type="button"
            >
              save test
            </button>

            <button
              className="w3-btn w3-sand"
              data-tclass="btn"
              type="button"
              onClick={helpConvertTest}
            >
              convert test
            </button>
          </div>
          <button
            className="w3-btn w3-pink"
            type="button"
            onClick={() => ipc.send('show all tests in window')}
          >
            show all tests
          </button>
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
