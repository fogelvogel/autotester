const ReactDOM = require('react-dom');
const React = require('react');
const ipc = require('electron').ipcRenderer;

let arrayOfNames = [];

function substringSearch(str, sub) {
  const len = str.length;
  const subLen = sub.length;

  for (let i = 0; i < len; i += 1) {
    for (let j = 0; j < subLen; j += 1) {
      if (str[i + j] !== sub[j]) {
        break;
      }

      if (j === subLen - 1) {
        return true;
      }
    }
  }
  return false;
}
function matchingNames(arrayOfFiles, sub = '') {
  if (sub === '') {
    return arrayOfFiles;
  }
  const namesLen = arrayOfFiles.length;
  const matching = [];

  for (let i = 0; i < namesLen; i += 1) {
    const filename = arrayOfFiles[i].split('.');
    const str = filename[0].split('');

    if (substringSearch(str, sub)) {
      matching.push(arrayOfFiles[i]);
    }
  }
  return matching;
}
function deleteThisFile(name) {
  ipc.send('delete file', name);
}

function editThisFile(name) {
  ipc.send('edit file', name);
}

function convertThisFile(name) {
  ipc.send('convert file', name);
}

class FindTestsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filenames: arrayOfNames };
    this.setInput = this.setInput.bind(this);
    this.filterRes = this.filterRes.bind(this);
  }

  componentDidMount() {
    ipc.on('all files from directory', (event, args) => {
      arrayOfNames = [...args];
      this.setState({ filenames: arrayOfNames });
    });
  }

  setInput(el) {
    this.setState({ input: el });
  }

  filterRes() {
    const { input } = this.state;
    this.setState({ filenames: matchingNames(arrayOfNames, input.value) });
  }

  deleteAll() {
    const { filenames } = this.state;
    ipc.send('delete all files', filenames);
  }

  convertAll() {
    const { filenames } = this.state;
    ipc.send('convert all files', filenames);
  }

  render() {
    const { filenames } = this.state;

    return React.createElement(
      'div',
      null,
      React.createElement('input', {
        type: 'text',
        className: 'input-url',
        placeholder: 'Search by file name',
        ref: this.setInput
      }),
      React.createElement(
        'button',
        {
          'data-tclass': 'btn',
          type: 'button',
          className: 'go-button',
          onClick: this.filterRes
        },
        'filter'
      ),
      React.createElement(
        'table',
        { className: 'w3-table w3-bordered w3-margin-top' },
        React.createElement(
          'tr',
          { className: 'first-tr' },
          React.createElement('td', null, '\u2116'),
          React.createElement('td', null, 'file name'),
          React.createElement('td', null),
          React.createElement('td', null),
          React.createElement('td', null)
        ),
        filenames.map((v, index) =>
          React.createElement(
            'tr',
            null,
            React.createElement('td', null, index + 1),
            React.createElement('td', null, `${v}`),
            React.createElement(
              'td',
              null,
              React.createElement(
                'button',
                {
                  'data-tclass': 'btn',
                  type: 'button',
                  className: 'mode-button',
                  onClick: () => editThisFile(v)
                },
                'edit'
              )
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'button',
                {
                  'data-tclass': 'btn',
                  type: 'button',
                  className: 'mode-button',
                  onClick: () => convertThisFile(v)
                },
                'convert'
              )
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'button',
                {
                  'data-tclass': 'btn',
                  type: 'button',
                  className: 'mode-button',
                  onClick: () => deleteThisFile(v)
                },
                'delete'
              )
            )
          )
        )
      ),
      React.createElement(
        'button',
        {
          'data-tclass': 'btn',
          type: 'button',
          className: 'mode-button',
          onClick: () => this.convertAll()
        },
        'convert all'
      ),
      React.createElement(
        'button',
        {
          'data-tclass': 'btn',
          type: 'button',
          className: 'mode-button',
          onClick: () => this.deleteAll()
        },
        'delete all'
      )
    );
  }
}
ReactDOM.render(
  React.createElement(FindTestsPage, { filenames: arrayOfNames }),
  document.querySelector('#findroot')
);
