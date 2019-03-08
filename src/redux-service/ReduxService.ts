import { AnyAction, Store } from 'redux';
import { getCurrentStore, registerReducer } from '../redux-registry';
import { ReduxServiceInitializer } from './ReduxServiceInitializer';
import { getReduxService, setReduxService } from './reduxServiceRegistry';
import { registerEffectEvents } from '../redux-effects-middleware';

export class ReduxService<TState> {
  state!: TState;
  _initializer?: ReduxServiceInitializer;

  constructor() {
    this.build();
  }
  
  namespace() {
    return this.constructor.name;
  }

  build() {
    const namespace = this.namespace();
    const initializer = this._initializer;
    if(getReduxService(namespace)) 
      return;
    
    if(!initializer)
      return;
    
    const initalState = initializer.initalState === undefined ? null : initializer.initalState;

    registerReducer({ namespace, initalState: initalState, reducerEvents: initializer.reducers });
    registerEffectEvents(initializer.effects);
    
    setReduxService(namespace, initializer.actions);
  }

  dispatch(action: AnyAction) {
    return getCurrentStore().dispatch(action);
  }

  getRootState() {
    return getCurrentStore().getState();
  }

  getState(): TState {
    return getCurrentStore().getState()[this.namespace()];
  }
}