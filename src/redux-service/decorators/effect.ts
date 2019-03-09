
import { ReduxService } from '../ReduxService';
import { getReduxServiceBuilder } from '../reduxServiceRegistry';
import { createPromiseHandler } from '../../creators';

export function effect(target: ReduxService<any>, name: string, descriptor: PropertyDescriptor) {
  const namespace = target.namespace();
  const serviceBuilder = getReduxServiceBuilder(namespace);
  const action = serviceBuilder.actions[name];

  if(action) {
    descriptor.value = action;
    return descriptor;
  }

  // create effect event
  const handler = descriptor.value.bind(target);
  const effectHandler = (store: any, payload: any) => handler(...payload);
  const event = createPromiseHandler(effectHandler, `@@Effect:${namespace}-${name}`);
  serviceBuilder.effects.push(event);

  // create dispatch action
  const dispatchAction = (...args: any[]) => target.dispatch(event.action(args));
  serviceBuilder.actions[name] = dispatchAction;
  descriptor.value = dispatchAction;

  return descriptor;
}
