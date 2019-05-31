/* eslint-disable no-script-url */
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

  constructor(props) {
    super(props);

    this.state = {
      inputValue: ''
    };
  }

  input = null;

  seInput = el => {
    this.input = el;
  };

  saveTestingURl = () => {
    const { inputValue } = this.state;
    // if (Helper.checkField(this.input.value)) {
    ipc.send('first-url-event', inputValue);
    // } else {
    //   console.log('value in field is invalid');
    // }
  };

  render() {
    const { inputValue } = this.state;

    const onTodoChange = value => {
      this.setState({
        inputValue: value
      });
    };

    return (
      <div className="wrapper-center">
        <div className="wrapper">
          <div className="paste-url-text">Вставьте адрес в поле</div>
          <div className="input-group">
            <input
              className="input-url"
              // ref={this.seInput}
              type="text"
              placeholder="Paste your link here"
              value={inputValue}
              onChange={e => onTodoChange(e.target.value)}
            />
            <button
              type="button"
              className="go-button"
              onClick={this.saveTestingURl}
            >
              <Link to={routes.TEST}>GO</Link>
            </button>
          </div>
          <div className="middle-text">
            {' '}
            или выберите одну из предыдущих страниц
          </div>

          <table className="w3-table w3-bordered w3-margin-top w3-margin-bottom to-scroll3">
            <tr className="first-tr">
              <td>№</td>
              <td>URL</td>
              <td />
            </tr>

            {lastTestedPages.map((v, index) => (
              <tr>
                <td>{index + 1}</td>
                <td className="to-scroll4">
                  <a href="javascript:void(0)" onClick={() => onTodoChange(v)}>
                    {v}
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => {
                      console.log('deleted', v);
                    }}
                    className="button-icon"
                    type="button"
                  />
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    );
  }
}
