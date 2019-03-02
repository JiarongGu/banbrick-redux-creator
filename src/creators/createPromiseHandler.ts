import { PromiseMiddlewareHandler, PromiseMiddlewareHandlerEvent, ActionFunction1 } from '../types';
import { uniqueId } from '../uniqueId';

export function createPromiseHandler<TPayload>(
  promisehandler: PromiseMiddlewareHandler<TPayload>, actionType?: string, priority?: number
): PromiseMiddlewareHandlerEvent<TPayload> {
  const hanlderActionType = actionType || uniqueId();
  const createdAction = function (payload: TPayload) {
    return ({ type: hanlderActionType, payload: payload });
  };
  createdAction.toString = () => hanlderActionType;

  return {
    action: createdAction as ActionFunction1<TPayload>,
    handler: promisehandler,
    priority: priority || 0
  };
}