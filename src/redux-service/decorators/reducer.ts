import { ReduxService } from '../ReduxService';
import { getReduxService } from '../reduxServiceRegistry';
import { createReducer } from '../../creators';
import { ReduxServiceInitializer } from '../ReduxServiceInitializer';

export function reducer(target: ReduxService<any>, name: string, descriptor: PropertyDescriptor) {
  const namespace = target.namespace();
  const service = getReduxService(namespace);
  
  if(service) {
    descriptor.value = service[name];
  } else {
    const handler = descriptor.value;
    const reducer = (state: any, payload: any) => {
      target.state = state;
      return handler.bind(target)(payload);
    };
    const event = createReducer(reducer , `@@Reducer:${namespace}-${name}`);

    if (!target._initializer)
      target._initializer = new ReduxServiceInitializer();
    
    target._initializer.reducers.push(event);
    const action = (payload: any) => target.dispatch(event.action(payload));
    target._initializer.actions[name] = action;
    descriptor.value = action;
  }

  return descriptor;
}