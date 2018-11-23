import ReactDOM from 'react-dom';
import React from 'react';

// class FindTestsPage extends React.Component{

//     constructor(props) {
//     super(props);
//     this.state = {filenames: ['name1', 'name2', 'name3', 'name4', 'name5']};
//     }

//     componentDidMount() {
//     this.filenames = [Math.random().toString(36).substring(7), 'name2', 'name3', 'name4', 'name5'];
//     this.timerId = setInterval(
//     () => this.tick(),
//     1000
//     );
//     }

//     componentWillUnmount() {
//     clearInterval(this.timerId);
//     }

//     tick() {
//     this.setState({
//     filenames: [Math.random().toString(36).substring(7), 'name2', 'name3', 'name4', Math.random().toString(36).substring(7)]
//     });
//     }

//     render() {
//     const {filenames} = this.state;
//     return (
//     <table border="1">
//     <tr>
//     <td>№</td>
//     <td>file name</td>
//     <td>edit</td>
//     <td>convert</td>
//     <td>delete</td>
//     </tr>
//     {filenames.map((v, index) => (
//     <tr>
//     <td>{index + 1}</td>
//     <td>{`${v}`}</td>
//     <td><button
//     data-tclass="btn"
//     type="button"
//     >
//     edit
//     </button></td>
//     <td><button
//     data-tclass="btn"
//     type="button"
//     >
//     convert
//     </button></td>
//     <td>
//     <button
//     data-tclass="btn"
//     type="button"
//     >
//     delete
//     </button>
//     </td>
//     </tr>
//     ))}
//     </table>
//     )
//     }
//     }
ReactDOM.render(<h1>dgj</h1>, document.getElementById('findroot'));
