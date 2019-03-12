import { MiddlewareAPI, Dispatch, AnyAction } from 'redux';
import { Location } from 'history';
import { getCurrentStore } from '../redux-registry';
import { PromiseMiddlewareHandlerEvent, ActionFunctionAny } from '../types';

const locationHanlderMap = new Map<string, PromiseMiddlewareHandlerEvent<Location>>();
let locationHanlderEvents: Array<PromiseMiddlewareHandlerEvent<Location>> | undefined;
let locationState: Location;

// create location middleware which will process location events
export function createLocationMiddleware<TPayload>(
  initalLocation: Location,
  locationActionType: string,
  locationFormatter?: (payload: TPayload) => Location
) {
  locationState = initalLocation;

  return (store: MiddlewareAPI<any>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    if (action.type == locationActionType) {
      const location = locationFormatter ? locationFormatter(action.payload) : action.payload;
      processLocationTasks(store, location);
    }
    return next(action);
  };
}

// process location task, return task array
export async function processLocationTasks(store: MiddlewareAPI<any>, location: Location) {
  if (!store) return;

  locationState = location;
  await Promise.all(getLocationHandlerEvents().map(handlerEvent => handlerEvent.handler(store, location)));
}

// add new location event and run location tasks after
export async function registerLocationEvents(handlerEvents: Array<PromiseMiddlewareHandlerEvent<Location>>, locationReload: boolean) {
  handlerEvents.forEach(handlerEvent => {
    locationHanlderMap.set(handlerEvent.action.toString(), handlerEvent);
  });
  
  locationHanlderEvents = undefined;

  if (locationReload)
    await processLocationTasks(getCurrentStore(), locationState);
}

export function unregisterLocationEvents(actions: Array<ActionFunctionAny>) {
  actions.forEach(action => {
    locationHanlderMap.delete(action.toString());
  });
}

// get location events by priorities, higher will go first
const getLocationHandlerEvents = () => {
  if (locationHanlderEvents)
    return locationHanlderEvents;

  locationHanlderEvents = Array.from(locationHanlderMap.values()).sort((a, b) => (b.priority || 0) - (a.priority || 0));
  return locationHanlderEvents;
}