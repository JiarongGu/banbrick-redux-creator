import { unregisterEffectEvents } from '../redux-effects-middleware';
import { unregisterLocationEvents } from '../redux-location-middleware';
import { ActionFunctionAny } from 'types';

export class ReduxAdjuster {
  removeEffectHandler(action: ActionFunctionAny) {
    unregisterEffectEvents([action]);
    return this;
  }

  removeLocationHandler(action: ActionFunctionAny) {
    unregisterLocationEvents([action]);
    return this;
  }
}