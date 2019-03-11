
import { Dispatch, AnyAction } from 'redux';
import { ReducerEvent, PromiseMiddlewareHandlerEvent, ActionFunctionAny } from '../types';
import { registerReducer, getCurrentStore } from '../redux-registry';
import { registerEffectEvents } from '../redux-effects-middleware';
import { ReactReduxContext } from 'react-redux';

export class ReduxServiceBuilder {
  stateProp?: string;
  reducers: Array<ReducerEvent<any, any>>;
  effects: Array<PromiseMiddlewareHandlerEvent<any>>;
  location: Array<PromiseMiddlewareHandlerEvent<Location>>;
  actions: { [key: string]: ActionFunctionAny };
  built: boolean;
  properties: { [key: string]: any};
  namespace!: string;
  dispatch!: Dispatch<AnyAction>
  
  constructor() {
    this.reducers = [];
    this.effects = [];
    this.location = [];
    this.actions = {};
    this.properties = {};
    this.built = false;
  }

  build(namespace: string, prototype: any) {
    const currentStore = getCurrentStore();
    
    // set dispatch function
    this.dispatch = currentStore.dispatch;

    // set default prototype values;
    Object.keys(this.properties).forEach((key) => {
      prototype[key] = this.properties[key];
    });

    // if there is no reducers, do not add to store
    if (this.stateProp && this.reducers.length > 0) {
      const currentState = currentStore.getState()[namespace];
      const serviceState = currentState || this.properties[this.stateProp];
      const initalState = serviceState === undefined ? null : serviceState;
      
      // match the prototype state to initalState
      prototype[this.stateProp] = initalState;

      registerReducer({ 
        namespace, initalState, reducerEvents: this.reducers 
      });
    }

    registerEffectEvents(this.effects);
    this.namespace = namespace;
    this.built = true;
  }
}

export function getReduxServiceBuilder(prototype: any): ReduxServiceBuilder {
  if (!prototype._serviceBuilder) {
    prototype._serviceBuilder = new ReduxServiceBuilder();
  }
  return prototype._serviceBuilder;
}