import { AnyAction } from 'redux';
import { getCurrentStore } from '../redux-registry';
import { getReduxServiceBuilder } from './reduxServiceRegistry';

export class ReduxService<TState> {
  state!: TState;

  constructor() {
    const namespace = this.namespace();
    const serviceBuilder = getReduxServiceBuilder(namespace);
    serviceBuilder.build(namespace);
  }
  
  namespace() {
    return this.constructor.name;
  }

  dispatch(action: AnyAction) {
    return getCurrentStore().dispatch(action);
  }

  getRootState() {
    return getCurrentStore().getState();
  }
}