let initialState;

export default (initialState = {
  mode: 0,
  url: `file://${__dirname}/tools.html`,
  testBody: []
});
console.log(initialState);
// function testingApp(state, action: Action) {
//     if (typeof state === 'undefined') {
//         return initialState
//     }
//     return state;
// }
