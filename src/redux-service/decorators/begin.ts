import { ReduxService } from '../ReduxService';
import { getReduxServiceBuilder } from '../reduxServiceRegistry';

export function begin(target: ReduxService<any>, name: string, descriptor: PropertyDescriptor) {
  const namespace = target.namespace();
  const serviceBuilder = getReduxServiceBuilder(namespace);
  
  if (serviceBuilder.initalState == undefined) {
    const initalState = descriptor.value();
    serviceBuilder.initalState = initalState;

    if (target.state == undefined)
      target.state = initalState;
  }
  return descriptor;
}