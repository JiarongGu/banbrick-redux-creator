import { ReducerEvent, PromiseMiddlewareHandlerEvent, ActionFunctionAny } from '../types';

export class ReduxServiceInitializer {
  initalState?: any;
  reducers: Array<ReducerEvent<any, any>>;
  effects: Array<PromiseMiddlewareHandlerEvent<any>>;
  location: Array<PromiseMiddlewareHandlerEvent<Location>>;
  actions: { [key: string]: ActionFunctionAny };

  constructor() {
    this.reducers = [];
    this.effects = [];
    this.location = [];
    this.actions = {};
  }
}