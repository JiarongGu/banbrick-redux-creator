import { createReducer } from '../creators';
import { getReduxService } from './ReduxService';
import { getCurrentStore } from '../redux-registry';

export function reducer(target: any, name: string, descriptor: PropertyDescriptor) {
  const serviceBuilder = getReduxService(target);
  const action = serviceBuilder.actions[name];

  if(serviceBuilder.built) {
    descriptor.value = action;
    return descriptor;
  }

  // build reducer event
  const handler = descriptor.value;
  const reducer = (state: any, payload: any) => {
    const newState = handler.bind(target)(payload);
    target[serviceBuilder.stateProp!] = newState;
    return newState;
  };
  const event = createReducer(reducer);
  serviceBuilder.reducers.push(event);

  // build dispatch action
  const dispatchAction = (payload: any) => getCurrentStore().dispatch(event.action(payload));
  serviceBuilder.actions[name] = dispatchAction;
  descriptor.value = dispatchAction;

  return descriptor;
}