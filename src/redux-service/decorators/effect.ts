
import { ReduxService } from '../ReduxService';
import { getReduxService } from '../reduxServiceRegistry';
import { createPromiseHandler } from '../../creators';
import { ReduxServiceInitializer } from '../ReduxServiceInitializer';

export function effect(target: ReduxService<any>, name: string, descriptor: PropertyDescriptor) {
  const namespace = target.namespace();
  const service = getReduxService(namespace);
  
  if(service) {
    descriptor.value = service[name];
  } else {
    const handler = descriptor.value.bind(target);
    const effectHandler = (store: any, payload: any) => handler(...payload);
    const event = createPromiseHandler(effectHandler, `${namespace}-${name}`);

    if (!target._initializer)
      target._initializer = new ReduxServiceInitializer();
    
    target._initializer.effects.push(event);
    const action = (...args: any[]) => target.dispatch(event.action(args));
    target._initializer.actions[name] = action;
    descriptor.value = action;
  }

  return descriptor;
}
