import { ReducerEvent, PromiseMiddlewareHandlerEvent, ActionFunctionAny } from '../types';
import { registerReducer } from '../redux-registry';
import { registerEffectEvents } from '../redux-effects-middleware';

export class ReduxServiceBuilder {
  initalState?: any;
  reducers: Array<ReducerEvent<any, any>>;
  effects: Array<PromiseMiddlewareHandlerEvent<any>>;
  location: Array<PromiseMiddlewareHandlerEvent<Location>>;
  actions: { [key: string]: ActionFunctionAny };
  built: boolean;

  constructor() {
    this.reducers = [];
    this.effects = [];
    this.location = [];
    this.actions = {};
    this.built = false;
  }

  build(namespace: string) {
    if(this.built) 
      return;
    
    const initalState = this.initalState === undefined ? null : this.initalState;
    registerReducer({ namespace, initalState, reducerEvents: this.reducers });
    registerEffectEvents(this.effects);
    this.built = true;
  }
}