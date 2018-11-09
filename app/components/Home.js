// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';
import * as URLAction from '../actions/home';
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
    URLAction.saveTestingURl(this.input.value);
    // } else {
    //   console.log('value in field is invalid');
    // }
  };

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <input
          ref={this.seInput}
          type="text"
          placeholder="Paste your link here"
        />
        <button type="submit" onClick={this.saveTestingURl}>
          <Link to={routes.TEST}>GO!</Link>
        </button>
      </div>
    );
  }
}
