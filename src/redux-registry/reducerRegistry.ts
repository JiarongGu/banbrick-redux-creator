import { ReducersMapObject, Store } from 'redux';
import { Reducer } from '../types';
import { buildReducer, updateReducers } from './updateReducers';

const dynamicReducers: ReducersMapObject<any, any> = {};
const stateUpdaters: Array<(state: any) => void> = [];
let staticStore: Store;
let staticReducers: ReducersMapObject<any, any> = {};

export function buildRootReducer<TRootState>(initalState: any, reducers: ReducersMapObject<any, any>): Reducer<TRootState, any> {
  staticReducers = reducers;
  const combinedReducer = buildReducer(staticReducers, dynamicReducers) || (() => ({})) as any;
  if (initalState) {
    // if initalState supplied, update existing service state
    stateUpdaters.forEach(update => update(initalState));
  }
  return combinedReducer;
}

export function addReducer(namespace: string, reducer: Reducer<any, any>, serviceStateUpdater?: (state: any) => void) {
  if (!dynamicReducers[namespace]) {
    dynamicReducers[namespace] = reducer;
    updateReducers(staticStore, staticReducers, dynamicReducers);

    if (serviceStateUpdater) {
      const stateUpdater = (state) => serviceStateUpdater(state && state[namespace]);
      stateUpdaters.push(stateUpdater);
    }
  }
}

export function registerStore(store: Store) {
  staticStore = store;
}

export function getCurrentStore() {
  return staticStore;
}