import { Store, createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLocationMiddleware } from '../redux-location-middleware';
import { effectsMiddleware } from '../redux-effects-middleware';
import { buildRootReducer, registerStore } from '../redux-registry';
import { StoreConfiguration } from '../types';

export function configureStore<TState>(config?: StoreConfiguration<TState, any>): Store<TState> {
  const initalState = config && config.initalState;
  const configReducers = config && config.reducers || [];
  const configMiddlewares = config && config.middlewares || [];
  const devTool = !!(config && config.devTool);
  const locationConfig = config && config.locationMiddleware;

  const locationMiddleware = locationConfig && createLocationMiddleware(
    locationConfig.actionType, 
    locationConfig.initalLocation, 
    locationConfig.locationFormatter, 
    locationConfig.reload
  );
  
  const applyMiddlewares = configMiddlewares.concat([effectsMiddleware]);
  if (locationMiddleware) 
    applyMiddlewares.push(locationMiddleware);

  const middlewares = applyMiddleware(...applyMiddlewares);
  const composedMiddlewares = devTool ? composeWithDevTools(middlewares): compose(middlewares);

  const combinedReducer = buildRootReducer<TState>({ ...configReducers });
  const store = createStore(combinedReducer as any, initalState, composedMiddlewares) as Store<TState>;
  registerStore(store);
  return store;
}