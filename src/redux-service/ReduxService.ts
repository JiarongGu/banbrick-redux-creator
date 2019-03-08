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

    if(getReduxService(namespace)) 
      return;
    
    if(!this._initializer)
      return;
    
    registerReducer({ namespace, initalState: this._initializer.initalState || null, reducerEvents: this._initializer.reducers });
    registerEffectEvents(this._initializer.effects);
    
    setReduxService(namespace, this._initializer.actions);
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