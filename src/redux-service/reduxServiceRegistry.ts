import { ActionFunctionAny } from '../types';

const services = new Map<string, { [key: string]: ActionFunctionAny }>();

export function getReduxService(key: string){
  return services.get(key);
}

export function setReduxService(key:string, value: { [key: string]: ActionFunctionAny }) {
  return services.set(key, value);
}