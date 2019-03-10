
import { createPromiseHandler } from '../creators';
import { getCurrentStore } from '../redux-registry';
import { getReduxService } from './ReduxService';

export function effect(target: any, name: string, descriptor: PropertyDescriptor) {
  const serviceBuilder = getReduxService(target);

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
  const dispatchAction = (...args: any[]) => getCurrentStore().dispatch(event.action(args));
  serviceBuilder.actions[name] = dispatchAction;
  descriptor.value = dispatchAction;

  return descriptor;
}
