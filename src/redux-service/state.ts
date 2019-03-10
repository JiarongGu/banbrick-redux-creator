import { getReduxService } from './ReduxService';

export function state(target: any, name: string) {
  const serviceBuilder = getReduxService(target);
  if(!serviceBuilder.built) {
    if (serviceBuilder.stateProp == undefined) {
      serviceBuilder.stateProp = name;
    }
  }
}