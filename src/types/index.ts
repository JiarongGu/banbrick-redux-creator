import { MiddlewareAPI, Middleware } from 'redux';
import { Location } from 'history';

export interface Action<Payload> {
  type: string;
  payload?: Payload;
  error?: boolean;
}

export interface Action<Payload> {
  type: string;
  payload?: Payload;
  error?: boolean;
}

export type Reducer<TState, TPayload> = (state: TState, action: Action<TPayload>) => TState;
export type ActionFunction0Base<R> = () => R;
export type ActionFunction1Base<T1, R> = (t1: T1) => R;
export type ActionFunction2Base<T1, T2, R> = (t1: T1, t2: T2) => R;
export type ActionFunction3Base<T1, T2, T3, R> = (t1: T1, t2: T2, t3: T3) => R;
export type ActionFunction4Base<T1, T2, T3, T4, R> = (t1: T1, t2: T2, t3: T3, t4: T4) => R;

export type ActionFunction0<R> = ActionFunction0Base<Action<R>>;
export type ActionFunction1<T1> = ActionFunction1Base<T1, Action<T1>>;
export type ActionFunctionAny = (...args: any[]) => any;

export type ReducerHandler<TState, TPayload> = (state: TState, payload: TPayload) => TState;

export interface ReducerEventParameters<TState> {
  name?: string;
  action?: ActionFunctionAny;
  reducer: Reducer<TState, any>;
}

export interface ReducerEvent<TState, TPayload> {
  action: ActionFunctionAny;
  reducer: Reducer<TState, TPayload>;
}

export type PromiseMiddlewareHandler<TPayload> = (store: MiddlewareAPI<any>, payload: TPayload) => Promise<any>;

export interface PromiseMiddlewareHandlerEvent<TPayload> {
  action: ActionFunction1<TPayload>;
  handler: PromiseMiddlewareHandler<TPayload>;
  priority?: number;
};

export interface ReducerRegistration<TState> {
  namespace: string;
  initalState: TState;
  reducerEvents: Array<ReducerEvent<TState, any>>;
  serviceStateUpdater?: (state: TState) => void;
}

export interface DynamicReducerMap {
  namespace: string;
  reducer: Reducer<any, any>;
  serviceStateUpdater?: (state) => void;
}

export interface LocationMiddlewareConfig<TPayload> {
  actionType: string;
  initalLocation: Location;
  locationFormatter?: (payload: TPayload) => Location;
}

export interface ReduxCreatorConfiguration {
  reducers?: { [key: string]: any };
  middlewares?: Middleware[];
  locationMiddleware?: LocationMiddlewareConfig<any>;
}

export interface ReduxCreatorStoreConfiguration<TState = any> extends ReduxCreatorConfiguration{
  preloadedState?: TState;
  devTool?: boolean;
}

export type Constructor<T = any, A = any> = { new(...args: Array<A>): T };