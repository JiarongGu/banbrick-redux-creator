import { createStore, applyMiddleware, compose, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyReduxCreatorStore, buildReducers, getDynamicReducers } from '../redux-registry';
import { ReduxCreatorStoreConfiguration } from '../types';
import { effectsMiddleware } from '../redux-effects-middleware';
import { createLocationMiddleware } from '../redux-location-middleware';

export function configureCreatorStore<TState = any>(config?: ReduxCreatorStoreConfiguration<TState>) {
  let reducers = getDynamicReducers();
  let middlewares = [effectsMiddleware];
  let applyHistoryListener;

  if (config && config.locationMiddleware) {
    middlewares.push(config.locationMiddleware);
  } else if (config && config.history) {
    const history = config.history;
    const locationAction = '@@LOCATION_CHANGE';
    const locationMiddleware = createLocationMiddleware(history.location, locationAction);

    middlewares.push(locationMiddleware);
    applyHistoryListener = (store: Store) => {
      history.listen((location) => {
        store.dispatch({ type: locationAction, payload: location });
      });
    }
  }

  if (config && config.reducers)
    reducers = { ...reducers, ...config.reducers };

  if (config && config.middlewares)
    middlewares = middlewares.concat(config.middlewares);

  const store = configureStore({ ...config, reducers, middlewares });
  
  if (applyHistoryListener)
    applyHistoryListener(store);
  
  applyReduxCreatorStore(store);

  return store;
}

export function configureStore<TState = any>(config?: ReduxCreatorStoreConfiguration<TState>) {
  const reducers = config && config.reducers || [];
  const middlewares = config && config.middlewares || [];
  const preloadedState = config && config.preloadedState;
  const devTool = config && config.devTool || false;

  const combinedMiddleware = applyMiddleware(...middlewares);
  const composedMiddlewares = devTool ? composeWithDevTools(combinedMiddleware) : compose(combinedMiddleware);
  const combinedReducer = buildReducers(reducers);

  if (preloadedState == undefined)
    return createStore(combinedReducer as any, composedMiddlewares);
  return createStore(combinedReducer as any, preloadedState, composedMiddlewares);
}

