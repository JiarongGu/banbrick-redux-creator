
import { Dispatch, AnyAction } from 'redux';
import { ReducerEvent, PromiseMiddlewareHandlerEvent, ActionFunctionAny } from '../types';
import { registerReducer, getCurrentStore } from '../redux-registry';
import { registerEffectEvents } from '../redux-effects-middleware';
import { registerLocationEvents } from '../redux-location-middleware';
import { Location } from 'history';

export class ReduxServiceBuilder {
  namespace!: string;
  stateProp?: string;
  locationReload: boolean;
  properties: { [key: string]: any};

  reducers: Array<ReducerEvent<any, any>>;
  effects: Array<PromiseMiddlewareHandlerEvent<any>>;
  locations: Array<PromiseMiddlewareHandlerEvent<Location>>;
  actions: { [key: string]: ActionFunctionAny };
  linkedServices: Array<ReduxServiceBuilder>;

  dispatch!: Dispatch<AnyAction>;
  built: boolean;
  
  constructor() {
    this.reducers = [];
    this.effects = [];
    this.locations = [];
    this.linkedServices = [];
    this.actions = {};
    this.properties = {};
    this.locationReload = false;
    this.built = false;
  }

  build(namespace: string, prototype: any) {    
    // set dispatch function
    this.dispatch = (...args) => getCurrentStore().dispatch(...args);

    // set default prototype values;
    Object.keys(this.properties).forEach((key) => {
      prototype[key] = this.properties[key];
    });

    const stateProps = this.stateProp;

    // if there is no reducers, do not add to store
    if (stateProps && this.reducers.length > 0) {
      const currentStore = getCurrentStore();
      const currentState = currentStore && currentStore.getState();
      const serviceState = currentState && currentState[namespace] || this.properties[stateProps];
      const initalState = serviceState === undefined ? null : serviceState;
      
      // match the prototype state to initalState
      prototype[stateProps] = initalState;

      // create updater that can update service state
      const serviceStateUpdater = (state: any) => {
        prototype[stateProps]= state 
      };

      registerReducer({ 
        namespace, initalState, reducerEvents: this.reducers, serviceStateUpdater
      });
    }

    registerEffectEvents(this.effects);
    registerLocationEvents(this.locations, this.locationReload);
    
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