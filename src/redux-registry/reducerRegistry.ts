import { ReducersMapObject, Store } from 'redux';
import { Reducer } from '../types';
import { buildReducer, updateReducers } from './updateReducers';

const dynamicReducers: ReducersMapObject<any, any> = {}
let staticStore: Store;
let staticReducers: ReducersMapObject<any, any> = {};

export function buildRootReducer<TRootState>(reducers: ReducersMapObject<any, any>): Reducer<TRootState, any> {
  staticReducers = reducers;
  return buildReducer(staticReducers, dynamicReducers) || (() => ({})) as any;
}

export function addReducer(name: string, reducer: Reducer<any, any>) {
  if (!dynamicReducers[name]) {
    dynamicReducers[name] = reducer;
    updateReducers(staticStore, staticReducers, dynamicReducers);
  }
}

export function registerStore(store: Store) {
  staticStore = store;
}

export function getCurrentStore() {
  return staticStore;
}