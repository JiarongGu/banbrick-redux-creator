import { ReducerHandler, ReducerEvent, ReducerEventParameters, ActionFunction1, Reducer } from 'types';
import { uniqueId } from 'uniqueId';

export function createReducer<TState, TPayload>(handler: ReducerHandler<TState, TPayload>, name?: string): ReducerEvent<TState, TPayload> 
{
  const reducer = ((state: TState, { payload }) => handler(state, payload as any)) as Reducer<TState, any>;
  return createComplexReducer<TState, TPayload>({ reducer, name });
}

export function createComplexReducer<TState, TPayload>(event: ReducerEventParameters<TState>): ReducerEvent<TState, TPayload> 
{
  const name = event.name || uniqueId();
  const action = event.action || ((payload: TPayload) => payload);
  
  const createdAction = function(payload: TPayload) {
    return ({type: name, payload: action(payload)})
  };
  createdAction.toString = () => name;
  const createdReducer = event.reducer;
  return {
    action: createdAction as ActionFunction1<TPayload>,
    reducer: createdReducer
  };
}