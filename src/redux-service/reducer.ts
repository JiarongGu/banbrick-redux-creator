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
  const handler = descriptor.value.bind(target);
  const reducer = (state: any, payloads: Array<any>) => {
    const newState = handler(...payloads);
    target[serviceBuilder.stateProp!] = newState;
    return newState;
  };
  const event = createReducer(reducer);
  serviceBuilder.reducers.push(event);

  // build dispatch action, using prototype's dispatch method
  const dispatchAction = (...payloads: Array<any>) => serviceBuilder.dispatch(event.action(payloads));
  serviceBuilder.actions[name] = dispatchAction;
  descriptor.value = dispatchAction;

  return descriptor;
}