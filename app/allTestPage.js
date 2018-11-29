const ReactDOM = require('react-dom');
const React = require('react');
const ipc = require('electron').ipcRenderer;

let arrayOfNames = [];

// const myElectron = require('electron');

// const choice = myElectron.dialog.showMessageBox(
//     myElectron.remote.getCurrentWindow(),
//     {
//     type: 'question',
//     buttons: ['Yes', 'No'],
//     title: 'Confirm',
//     message: 'Are you sure you want to delete all files?'
// });

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
function deleteThisFile(number) {
  ipc.send('delete file', arrayOfNames[number]);
}

function editThisFile(number) {
  ipc.send('edit file', arrayOfNames[number]);
}

function convertThisFile(number) {
  ipc.send('convert file', arrayOfNames[number]);
}

function convertAll() {}

function deleteAll() {
  ipc.send('delete all files');
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

  //   componentDidUpdate(prevProps, prevState) {
  //     if (prevState.filenames !== arrayOfNames) {
  //       this.onUpdate();
  //     }
  //   }

  componentWillUnmount() {
    // clearInterval(this.timerId);
  }

  //   onUpdate() {
  //     this.setState({ filenames: arrayOfNames });
  //   }

  setInput(el) {
    this.setState({ input: el });
  }

  filterRes() {
    const { input } = this.state;
    this.setState({ filenames: matchingNames(arrayOfNames, input.value) });
  }

  render() {
    // this.state = this.props;
    const { filenames } = this.state;
    return React.createElement(
      'div',
      null,
      React.createElement('input', {
        type: 'text',
        ref: this.setInput
      }),
      React.createElement(
        'button',
        {
          'data-tclass': 'btn',
          type: 'button',
          onClick: this.filterRes
        },
        'filter'
      ),
      React.createElement(
        'table',
        { border: '1' },
        React.createElement(
          'tr',
          null,
          React.createElement('td', null, '\u2116'),
          React.createElement('td', null, 'file name'),
          React.createElement('td', null, 'edit'),
          React.createElement('td', null, 'convert'),
          React.createElement('td', null, 'delete')
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
                  onClick: () => editThisFile(index)
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
                  onClick: () => convertThisFile(index)
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
                  onClick: () => deleteThisFile(index)
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
          onClick: () => convertAll()
        },
        'convert all'
      ),
      React.createElement(
        'button',
        {
          'data-tclass': 'btn',
          type: 'button',
          onClick: () => deleteAll()
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
