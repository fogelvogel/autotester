import { configureStore } from './store/configureStore';

let initialState;

const store = configureStore();

export function getStore() {
  return store;
}

export default (initialState = {
  mode: 0,
  testBody: []
});
console.log(initialState);
