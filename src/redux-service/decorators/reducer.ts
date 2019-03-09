import { ReduxService } from '../ReduxService';
import { getReduxServiceBuilder } from '../reduxServiceRegistry';
import { createReducer } from '../../creators';

export function reducer(target: ReduxService<any>, name: string, descriptor: PropertyDescriptor) {
  const namespace = target.namespace();
  const serviceBuilder = getReduxServiceBuilder(namespace);
  const action = serviceBuilder.actions[name];

  if(action) {
    descriptor.value = action;
    return descriptor;
  }

  // build reducer event
  const handler = descriptor.value;
  const reducer = (state: any, payload: any) => {
    const newState = handler.bind(target)(payload);
    target.state = newState;

    return newState;
  };
  const event = createReducer(reducer , `@@Reducer:${namespace}-${name}`);
  serviceBuilder.reducers.push(event);

  // build dispatch action
  const dispatchAction = (payload: any) => target.dispatch(event.action(payload));
  serviceBuilder.actions[name] = dispatchAction;
  descriptor.value = dispatchAction;

  return descriptor;
}