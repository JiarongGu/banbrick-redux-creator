import { createLocationMiddleware } from '../redux-location-middleware';
import { effectsMiddleware } from '../redux-effects-middleware';
import { getDynamicReducers } from '../redux-registry';
import { ReduxCreatorConfiguration } from '../types';

export function configureReduxCreator(config?: ReduxCreatorConfiguration) {
  const configReducers = config && config.reducers || [];
  const configMiddlewares = config && config.middlewares || [];
  const locationMiddlewareConfig = config && config.locationMiddleware;

  // get existing middlewares and reducers
  const middlewares = configMiddlewares.concat([effectsMiddleware]);
  const reducers = { ...configReducers, ...getDynamicReducers() };

  // add location middleware if the config exist
  if (locationMiddlewareConfig) {
    const locationMiddleware = createLocationMiddleware(
      locationMiddlewareConfig.actionType,
      locationMiddlewareConfig.initalLocation,
      locationMiddlewareConfig.locationFormatter
    );
    middlewares.push(locationMiddleware);
  }

  return { middlewares, reducers };
}