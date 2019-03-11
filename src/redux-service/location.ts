
import { createPromiseHandler } from '../creators';
import { getReduxServiceBuilder } from './ReduxServiceBuilder';
import { matchPath, RouteProps } from 'react-router';
import { Location } from 'history';

export function location(route: RouteProps | string, reload: boolean = false, priority?: number) {
  const props: RouteProps = {};
  
  if (typeof route === 'string') {
    props.path = route
  } else {
    props == route;
  }

  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    const serviceBuilder = getReduxServiceBuilder(target);
  
    if(!serviceBuilder.built) {
      // create location event
      const handler = descriptor.value.bind(target);
      const locationHandler = (store: any, payload: Location) =>{  
        const matches = matchPath<any>(payload.pathname, props);
        if (matches)
          return handler(matches, payload);
      };
      const event = createPromiseHandler<Location>(locationHandler, undefined, priority);
      serviceBuilder.locations.push(event);

      if (reload)
        serviceBuilder.locationReload = true;
    }
    return descriptor;
  }  
}