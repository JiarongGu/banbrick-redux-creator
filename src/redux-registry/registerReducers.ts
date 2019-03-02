import { replaceReducer } from './reducerRegistry';
import { ReducerRegistration, Reducer, ReducerEvent } from '../types';

function combineReducerEvents<TState>(initalState: TState, ...events: Array<ReducerEvent<TState, any>>): Reducer<TState, any> 
{
  const actions: { [key: string]: Reducer<TState, any> } = events.reduce((root, next) => {
    return Object.assign(root, { [next.action.toString()]: next.reducer });
  }, {});
  return (state, action) => {
    if(!actions[action.type]) 
      return state || initalState;
    return actions[action.type](state, action)
  }
}

export function registerReducer<TState>(registration: ReducerRegistration<TState>) {
  var combinedReducer = combineReducerEvents(registration.initalState, ...registration.reducerEvents);
  replaceReducer(registration.namespace, combinedReducer);
}