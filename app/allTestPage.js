const ReactDOM = require('react-dom');
const React = require('react');
const ipc = require('electron').ipcRenderer;

let arrayOfNames = ['qwe', 'qweqwe'];

ipc.on('all files from directory', (event, args) => {
  // const len = args.lenght;
  arrayOfNames = [...args];
  ReactDOM.render(
    React.createElement(FindTestsPage, []),
    document.querySelector('#findroot')
  );
  // console.log(args);
  // for (let i = 0; i < len; i += 1) {
  //     arrayOfNames[i] = args[i];
  //     console.log('qwe', args[i]);
  // }
});
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
function matchingNames(arrayOfFiles, sub) {
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
class FindTestsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filenames: arrayOfNames };
    this.setInput = this.setInput.bind(this);
    this.filterRes = this.filterRes.bind(this);
  }

  componentDidMount() {
    // this.filenames = [Math.random().toString(36).substring(7), 'name2', 'name3', 'name4', Math.random().toString(36).substring(7)];
    // this.timerId = setInterval(() => this.tick(), 1000);
    this.setState({ filenames: arrayOfNames });
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
    console.log(input);
    this.setState({ filenames: matchingNames(arrayOfNames, input.value) });
  }

  render() {
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
                  type: 'button'
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
                  type: 'button'
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
                  type: 'button'
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
          type: 'button'
        },
        'convert all'
      ),
      React.createElement(
        'button',
        {
          'data-tclass': 'btn',
          type: 'button'
        },
        'delete all'
      )
    );
  }
}
