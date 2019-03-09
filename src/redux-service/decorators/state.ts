import { getReduxService } from '../ReduxService';

export function state<TValue>(value: TValue) {
  return function (target: any, name: string) {
    const serviceBuilder = getReduxService(target);
    if(!serviceBuilder.built) {
      if (serviceBuilder.stateProp == undefined) {
        serviceBuilder.state = value;
        serviceBuilder.stateProp = name;
      }
    }
  }
}