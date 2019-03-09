import { ReducerEvent, PromiseMiddlewareHandlerEvent, ActionFunctionAny } from '../types';
import { registerReducer } from '../redux-registry';
import { registerEffectEvents } from '../redux-effects-middleware';

export class ReduxService {
  stateProp?: string;
  reducers: Array<ReducerEvent<any, any>>;
  effects: Array<PromiseMiddlewareHandlerEvent<any>>;
  location: Array<PromiseMiddlewareHandlerEvent<Location>>;
  actions: { [key: string]: ActionFunctionAny };
  built: boolean;
  namespace!: string;
  properties: { [key: string]: any};

  constructor() {
    this.reducers = [];
    this.effects = [];
    this.location = [];
    this.actions = {};
    this.properties = {};
    this.built = false;
  }

  build(namespace: string, prototype: any) {
    // set default prototype values;
    Object.keys(this.properties).forEach((key) => {
      prototype[key] = this.properties[key];
    });

    // if there is no reducers, do not add to store
    if (this.stateProp && this.reducers.length > 0) {
      const stateValue = this.properties[this.stateProp];
      const initalState = stateValue === undefined ? null : stateValue;
      
      registerReducer({ 
        namespace, initalState, reducerEvents: this.reducers 
      });
    }

    registerEffectEvents(this.effects);
    this.namespace = namespace;
    this.built = true;
  }
}

export function getReduxService(prototype: any): ReduxService {
  if (!prototype._serviceBuilder) {
    prototype._serviceBuilder = new ReduxService();
  }
  return prototype._serviceBuilder;
}