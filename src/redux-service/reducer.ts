import { createReducer } from '../creators';
import { getReduxServiceBuilder } from './ReduxServiceBuilder';

export function reducer(target: any, name: string, descriptor: PropertyDescriptor) {
  const serviceBuilder = getReduxServiceBuilder(target);
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

  // build dispatch action, using prototype's dispatch method
  const dispatchAction = (payload: any) => serviceBuilder.dispatch(event.action(payload));
  serviceBuilder.actions[name] = dispatchAction;
  descriptor.value = dispatchAction;

  return descriptor;
}