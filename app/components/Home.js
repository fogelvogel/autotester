// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
// import styles from './Home.css';
// import * as URLAction from '../actions/home';
// import * as Helper from '../helpers';

const ipc = require('electron').ipcRenderer;

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
      </div>
    );
  }
}
