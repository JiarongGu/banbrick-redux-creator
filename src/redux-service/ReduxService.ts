import { ReducerEvent, PromiseMiddlewareHandlerEvent, ActionFunctionAny } from '../types';
import { registerReducer } from '../redux-registry';
import { registerEffectEvents } from '../redux-effects-middleware';

export class ReduxService {
  state?: any;
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
    // if there is no reducers, do not add to store
    if (this.reducers.length > 0) {
      const initalState = this.state === undefined ? null : this.state;
      registerReducer({ 
        namespace, initalState, reducerEvents: this.reducers 
      });
    }

    registerEffectEvents(this.effects);
    this.namespace = namespace;

    // set default prototype values;
    if(this.stateProp) {
      prototype[this.stateProp] = this.state;
    }
    Object.keys(this.properties).forEach((key) => {
      prototype[key] = this.properties[key];
    });
    this.built = true;
  }
}

export function getReduxService(prototype: any): ReduxService {
  if (!prototype._serviceBuilder) {
    prototype._serviceBuilder = new ReduxService();
  }
  return prototype._serviceBuilder;
}