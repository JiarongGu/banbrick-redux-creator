import { getReduxServiceBuilder } from './ReduxServiceBuilder';

export function state(target: any, name: string) {
  const serviceBuilder = getReduxServiceBuilder(target);
  if(!serviceBuilder.built) {
    if (serviceBuilder.stateProp == undefined) {
      serviceBuilder.stateProp = name;
    }
  }
}