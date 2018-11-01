// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

const ipc = require('electron').ipcRenderer;

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  input = null;

  seInput = el => {
    this.input = el;
  };

  saveTestingURl = () => {
    console.log(this.input.value);
    ipc.send('new-url-event', this.input.value);
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
