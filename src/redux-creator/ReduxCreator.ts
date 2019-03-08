import { Location } from 'history';
import { PromiseMiddlewareHandlerEvent, ReducerEvent, ReducerHandler, PromiseMiddlewareHandler, ActionFunctionAny } from '../types';
import { registerReducer } from '../redux-registry';
import { registerEffectEvents } from '../redux-effects-middleware';
import { registerLocationEvents } from '../redux-location-middleware';
import { createReducer, createPromiseHandler } from '../creators';

export class ReduxCreator<TState> {
  private namespace?: string;
  private initalState?: TState;
  private reducerEvents: Array<ReducerEvent<TState, any>>;
  private effectEvents: Array<PromiseMiddlewareHandlerEvent<any>>;
  private locationEvents: Array<PromiseMiddlewareHandlerEvent<Location>>;
  private actionCounter: number;
  private actions: any;

  constructor(namespace?: string, initalState?: TState) {
    this.namespace = namespace;
    this.initalState = initalState;

    this.actions = {};
    this.actionCounter = 0;
    this.reducerEvents = [];
    this.effectEvents = [];
    this.locationEvents = [];
  }

  addAccessor(setters?: Array<string>, actionName?: string): ReduxCreator<TState> {
    let setterNames: Array<string> = [];

    // get setter names
    if(setters) {
      setterNames = setters;
    } else {
      setterNames = Object.keys(this.initalState || {});
    }

    if (setterNames.length == 0) 
      return this;

    // get reducer events
    const reducerEvents = setterNames.map(x => ({ 
      name: x, 
      event: createReducer((state: TState, payload: any): any => ({ ...state, [x]: payload }))
    }));

    // add reducer events to list, wait for reducer generation
    this.reducerEvents.push(...reducerEvents.map(x => x.event));

    // create state accessor
    const accessor = reducerEvents.reduce<{ [key: string]: ActionFunctionAny }>(
      (a, c) => { 
        a[c.name] = c.event.action; 
        return a;
      }, {}
    ); 

    if (actionName)
      this.actions[actionName] = accessor;

    this.actions[this.actionCounter] = accessor;
    
    this.actionCounter++;

    return this;
  }

  addReducer<TPayload>(reducerAction: ReducerHandler<TState, TPayload>, actionName?: string, actionType?: string): ReduxCreator<TState> {
    const event = createReducer(reducerAction, actionType);
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

