import { ReduxService } from '../ReduxService';
import { getReduxService } from '../reduxServiceRegistry';
import { ReduxServiceInitializer } from '../ReduxServiceInitializer';

export function begin(target: ReduxService<any>, name: string, descriptor: PropertyDescriptor) {
  const namespace = target.namespace();
  const service = getReduxService(namespace);
  
  if (!service) {
    if (!target._initializer)
      target._initializer = new ReduxServiceInitializer();
      
    target._initializer.initalState = descriptor.value();
  }

  return descriptor;
}