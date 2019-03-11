import { MiddlewareAPI, Dispatch, AnyAction } from 'redux';
import { PromiseMiddlewareHandler, PromiseMiddlewareHandlerEvent, ActionFunctionAny } from '../types';

const effectsHandlerMap = new Map<string, PromiseMiddlewareHandler<any>>();
const effectTasks: Array<Promise<any>> = [];

export const effectsMiddleware: any = (store: MiddlewareAPI<any>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  const handler = effectsHandlerMap.get(action.type);

  if (handler) {
    // if we found effect instead call next middleware, process the handler and return the result
    const task = handler(store, action.payload);

    if(task && task.then) {
      // push promise task to queue
      effectTasks.push(task.then((res) => {
        effectTasks.splice(effectTasks.indexOf(task), 1);
        return res;
      }));
    }
    return task;
  }
  return next(action);
};

export function registerEffectEvents(handlerEvents: Array<PromiseMiddlewareHandlerEvent<any>>) {
  handlerEvents.forEach(handlerEvent => {
    effectsHandlerMap.set(handlerEvent.action.toString(), handlerEvent.handler);
  });
}

export function unregisterEffectEvents(actions: Array<ActionFunctionAny>) {
  actions.forEach(action => {
    effectsHandlerMap.delete(action.toString());
  });
}

export function getEffectTasks() {
  return effectTasks;
}