import { ReducersMapObject, combineReducers, Store } from "redux";

export function updateReducers(store: Store, staticReducers: ReducersMapObject<any, any>, dynamicReducers: ReducersMapObject<any, any>) {
    if (store) {
      const reducer = buildReducer(staticReducers, dynamicReducers);
      if (reducer)
        store.replaceReducer(reducer);
    }
}

export function buildReducer(staticReducers: ReducersMapObject<any, any>, dynamicReducers: ReducersMapObject<any, any>) {
  let reducers = Object.assign({}, { ...staticReducers, ...dynamicReducers }) as ReducersMapObject<any, any>;
  if (Object.keys(reducers).length === 0) {
    return undefined;
  }
  return combineReducers(reducers);
}