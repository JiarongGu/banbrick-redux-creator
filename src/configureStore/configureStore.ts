import { createStore, applyMiddleware, compose, Middleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyReduxCreatorStore, buildReducers } from '../redux-registry';
import { ReduxCreatorStoreConfiguration } from '../types';
import { configureReduxCreator } from './configureReduxCreator';

type configureStoreDefault<TState = any> = (reducers: { [key: string]: any }, middlewares: Array<Middleware>, preloadedState?: TState, devTool?: boolean) => Store;

export function configureStore<TState = any>(config?: ReduxCreatorStoreConfiguration<TState>, configureStoreAction?: configureStoreDefault) {
  const { middlewares, reducers } = configureReduxCreator(config);
  const devTool = config && config.devTool || false;
  let preloadedState = config && config.preloadedState;
  const configureAction = configureStoreAction || configureStoreDefault;
  const store = configureAction(reducers, middlewares, preloadedState, devTool);
  applyReduxCreatorStore(store);
  return store;
}

function configureStoreDefault(reducers, middlewares, preloadedState, devTool = false) {
  const combinedMiddleware = applyMiddleware(...middlewares);
  const composedMiddlewares = devTool ? composeWithDevTools(combinedMiddleware) : compose(combinedMiddleware);
  const combinedReducer = buildReducers(reducers);
  if (preloadedState == undefined)
    return createStore(combinedReducer as any, composedMiddlewares);
  return createStore(combinedReducer as any, preloadedState, composedMiddlewares);
}

