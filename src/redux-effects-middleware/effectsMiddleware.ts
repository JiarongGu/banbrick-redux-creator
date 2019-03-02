import { MiddlewareAPI, Dispatch, AnyAction } from 'redux';
import { PromiseMiddlewareHandler, PromiseMiddlewareHandlerEvent } from '../types';

const effectsHandlerMap = new Map<string, PromiseMiddlewareHandler<any>>();
const effectTasks: Array<Promise<any>> = [];

export const effectsMiddleware: any = (store: MiddlewareAPI<any>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  const handler = effectsHandlerMap.get(action.type);

  if (handler) {
    const task = handler(store, action.payload);

    effectTasks.push(task);

    task.finally(() => {
      const index = effectTasks.indexOf(task);
      effectTasks.splice(index, 1);
    });
  }
  return next(action);
};

export function registerEffectEvent(handlerEvent: PromiseMiddlewareHandlerEvent<any>) {
  effectsHandlerMap.set(handlerEvent.action.toString(), handlerEvent.handler);
}

export function getEffectTasks() {
  return effectTasks;
}