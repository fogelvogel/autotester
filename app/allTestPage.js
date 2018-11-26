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

class FindTestsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filenames: arrayOfNames };
  }

  componentDidMount() {
    // this.filenames = [Math.random().toString(36).substring(7), 'name2', 'name3', 'name4', Math.random().toString(36).substring(7)];
    // this.timerId = setInterval(() => this.tick(), 1000);
    this.state.filenames = [...arrayOfNames];
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filenames !== arrayOfNames) {
      this.onUpdate();
    }
  }

  componentWillUnmount() {
    // clearInterval(this.timerId);
  }

  onUpdate() {
    this.setState({ filenames: arrayOfNames });
  }
  // tick() {
  // this.setState({
  // filenames: [Math.random().toString(36).substring(7), 'name2', 'name3', 'name4', Math.random().toString(36).substring(7)]
  // });
  // }

  render() {
    const { filenames } = this.state;
    return React.createElement(
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
      ),
      React.createElement(
        'tr',
        null,
        React.createElement('td', null, 'All'),
        React.createElement('td', null, 'convert'),
        React.createElement('td', null, 'delete')
      )
    );
  }
}
