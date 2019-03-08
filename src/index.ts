export { ReduxCreator } from './redux-creator';
export { ReduxAdjuster } from './redux-adjuster';
export { configureStore } from './configureStore';
export { processLocationTasks } from './redux-location-middleware';
export { getEffectTasks } from './redux-effects-middleware';
export * from './types';

import { ReduxService, reducer, effect, defaultState, connectService  } from './redux-service';
export const reduxService = {
  ReduxService, reducer, effect, defaultState, connectService
}