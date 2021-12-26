import { compose, createStore, applyMiddleware } from 'redux';
import requester from 'common/reduxMiddlewares/requester';

export default function createReduxStore(initialState, rootReducer, initialReq) {
  let createMiddlewaredStore;
  const client = requester(initialReq);
  if (__DEV__ && __DEVTOOLS__) {
    const composers = [];
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ === 'function') {
      composers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
    }
    createMiddlewaredStore = compose(applyMiddleware(client), ...composers)(createStore);
  } else {
    createMiddlewaredStore = applyMiddleware(client)(createStore);
  }
  const store = createMiddlewaredStore(rootReducer, initialState);

  return store;
}
