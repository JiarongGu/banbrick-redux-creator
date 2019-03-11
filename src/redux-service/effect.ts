
import { createPromiseHandler } from '../creators';
import { getReduxServiceBuilder } from './ReduxServiceBuilder';

export function effect(target: any, name: string, descriptor: PropertyDescriptor) {
  const serviceBuilder = getReduxServiceBuilder(target);

  if(serviceBuilder.built) {
    descriptor.value = serviceBuilder.actions[name];
    return descriptor;
  }

  // create effect event
  const handler = descriptor.value.bind(target);
  const effectHandler = (store: any, payload: any) => handler(...payload);
  const event = createPromiseHandler(effectHandler);
  serviceBuilder.effects.push(event);

  // create dispatch action
  const dispatchAction = (...payloads: any[]) => serviceBuilder.dispatch(event.action(payloads));
  serviceBuilder.actions[name] = dispatchAction;
  descriptor.value = dispatchAction;

  return descriptor;
}
