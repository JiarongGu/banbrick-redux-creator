import { MiddlewareAPI, Dispatch, AnyAction } from 'redux';
import { Location } from 'history';
import { getCurrentStore } from '../redux-registry';
import { PromiseMiddlewareHandlerEvent } from '../types';

const locationHanlderMap = new Map<string, PromiseMiddlewareHandlerEvent<Location>>();
let locationHanlderEvents: Array<PromiseMiddlewareHandlerEvent<Location>> | undefined;
let locationState: Location;

// create location middleware which will process location events
export function createLocationMiddleware<TPayload>(
  locationActionType: string, locationFormatter?: (payload: TPayload) => Location
) {
  return (store: MiddlewareAPI<any>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    if (action.type == locationActionType) {
      const location = locationFormatter ? locationFormatter(action.payload): action.payload;
      processLocationTasks(store, location);
    }
    return next(action);
  };
}

// process location task, return task array
export async function processLocationTasks(store: MiddlewareAPI<any>, location: Location) {
  if(!store) return; 
  locationState = location;

  const handlerEvents = getLocationHandlerEvents();
  await Promise.all(handlerEvents.map(handlerEvent => handlerEvent.handler(store, location)));
}

// add new location event and run location tasks after
export async function registerLocationEvent(handlerEvent: PromiseMiddlewareHandlerEvent<Location>) {
  locationHanlderMap.set(handlerEvent.action.toString(), handlerEvent);
  locationHanlderEvents = undefined;
  await processLocationTasks(getCurrentStore(), locationState);
}

// get location events by priorities, higher will go first
const getLocationHandlerEvents = () => {
  if (locationHanlderEvents) 
    return locationHanlderEvents;
  locationHanlderEvents = Array.from(locationHanlderMap.values()).sort((a, b) => (b.priority || 0) - (a.priority || 0));
  return locationHanlderEvents;
}