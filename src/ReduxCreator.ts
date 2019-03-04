import { Location } from 'history';
import { PromiseMiddlewareHandlerEvent, ReducerEvent, ReducerHandler, PromiseMiddlewareHandler } from './types';
import { registerReducer } from './redux-registry';
import { registerEffectEvents } from './redux-effects-middleware';
import { registerLocationEvents } from './redux-location-middleware';
import { createReducer, createPromiseHandler } from './creators';

export class ReduxCreator<TState> {
  private namespace?: string;
  private initalState?: TState;
  private actions: any;
  private reducerEvents: Array<ReducerEvent<TState, any>>;
  private effectEvents: Array<PromiseMiddlewareHandlerEvent<any>>;
  private locationEvents: Array<PromiseMiddlewareHandlerEvent<Location>>;
  private actionCounter: number;

  constructor(namespace?: string, initalState?: TState) {
    this.namespace = namespace;
    this.initalState = initalState;

    this.actions = {};
    this.actionCounter = 0;
    this.reducerEvents = [];
    this.effectEvents = [];
    this.locationEvents = [];
  }

  addReducer<TPayload>(handler: ReducerHandler<TState, TPayload>, actionName?: string, actionType?: string): ReduxCreator<TState> {
    const event = createReducer(handler, actionType);
    this.reducerEvents.push(event);

    if (actionName)
      this.actions[actionName] = event.action;

    this.actions[this.actionCounter] = event.action;
    this.actionCounter++;
    
    return this;
  }

  addEffectHandler<TPayload>(handler: PromiseMiddlewareHandler<TPayload>, actionName?: string, actionType?: string): ReduxCreator<TState> {
    const event = createPromiseHandler(handler, actionType);
    this.effectEvents.push(event);

    if (actionName)
      this.actions[actionName] = event.action;

    this.actions[this.actionCounter] = event.action;
    this.actionCounter++;

    return this;
  }

  addLocationHandler(handler: PromiseMiddlewareHandler<Location>, priority?: number, actionType?: string): ReduxCreator<TState> {
    const event = createPromiseHandler(handler, actionType, priority);
    this.locationEvents.push(event);

    this.actions[this.actionCounter] = event.action;
    this.actionCounter++;

    return this;
  }

  build() {
    if (this.namespace) {
      registerReducer<TState>({
        namespace: this.namespace,
        initalState: this.initalState as any,
        reducerEvents: this.reducerEvents
      });
    }

    registerEffectEvents(this.effectEvents);

    registerLocationEvents(this.locationEvents);

    return this.actions;
  }
}

