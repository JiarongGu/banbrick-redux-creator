import { replaceReducer } from './reducerRegistry';
import { ReducerRegistration, Reducer, ReducerEvent } from '../types';

type Actions<TState> = { [key: string]: Reducer<TState, any> };

function combineReducerEvents<TState>(initalState: TState, ...events: Array<ReducerEvent<TState, any>>): Reducer<TState, any> 
{
  const actions: Actions<TState> = events.reduce((root, next) => {
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