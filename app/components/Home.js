// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
// import styles from './Home.css';
// import * as URLAction from '../actions/home';
// import * as Helper from '../helpers';

const ipc = require('electron').ipcRenderer;

const { remote } = require('electron');

const lastTestedPages = remote.getGlobal('lastTestedPages');

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  input = null;

  seInput = el => {
    this.input = el;
  };

  saveTestingURl = () => {
    // if (Helper.checkField(this.input.value)) {
    ipc.send('new-url-event', this.input.value);
    // } else {
    //   console.log('value in field is invalid');
    // }
  };

  render() {
    return (
      <div className="w3-row w3-display-middle">
        <input
          className="w3-input"
          ref={this.seInput}
          type="text"
          placeholder="Paste your link here"
        />
        <button
          type="button"
          className="w3-bar w3-pink"
          onClick={this.saveTestingURl}
        >
          <Link to={routes.TEST}>GO!</Link>
        </button>
        <div className="middle-text"> or choose one of the saved pages</div>

        <table className="w3-table w3-bordered w3-margin-top w3-margin-bottom">
          <tr className="w3-pink">
            <td>№</td>
            <td>URL</td>
            <td>delete</td>
          </tr>

          {lastTestedPages.map((v, index) => (
            <tr>
              <td>{index + 1}</td>
              <td className="to-scroll">{v}</td>
              <td>
                <button
                  onClick={() => {
                    console.log('deleted', v);
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
      </div>
    );
  }
}
