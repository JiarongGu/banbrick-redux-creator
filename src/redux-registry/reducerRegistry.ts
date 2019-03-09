import { ReducersMapObject, Store, combineReducers } from 'redux';
import { Reducer } from '../types';

const reducerCollection: ReducersMapObject<any, any> = {}
let staticStore: Store;
let staticReducers: ReducersMapObject<any, any> = {};

export function replaceReducer(name: string, reducer: Reducer<any, any>) {
  if (!reducerCollection[name]) {
    reducerCollection[name] = reducer;

    if (staticStore) {
      const reducer = buildReducer();
      if (reducer)
        staticStore.replaceReducer(reducer);
    }
  }
}

export function registerStore(store: Store) {
  staticStore = store;
}

export function getCurrentStore() {
  return staticStore;
}

export function buildRootReducer<TRootState>(reducers: ReducersMapObject<any, any>): Reducer<TRootState, any> {
  staticReducers = reducers;
  return buildReducer() || (() => ({})) as any;
}

function buildReducer<TRootState>(): Reducer<TRootState, any> | undefined {
  let reducers = Object.assign({}, { ...reducerCollection, ...staticReducers }) as ReducersMapObject<any, any>;
  if (Object.keys(reducers).length === 0) {
    return undefined;
  }
  return combineReducers<TRootState>(reducers);
}