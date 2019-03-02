# [@banbrick/redux-creator](https://www.npmjs.com/package/@banbrick/redux-creator)  
redux creator for less boilerplate

## Install
```npm i @banbrick/redux-creator```  
  
## How to use
### configure store
create a store can use ReduxCreator with configureStore
```
import { configureStore } from '@banbrick/redux-creator';
// its also possible to add reducers and middlewares through this api
const store = configureStore({ reducers, initalState, middlewares, devTool: true });
```
  
### build redcuers
##### build reducers and state with ReduxCreator
```
import { ReduxCreator } from '@banbrick/redux-creator';

// build reducers with namespace and inital state
const actions = new ReduxCreator('test', initalState)
  .addReducer((state, payload) => ({ ...state, payload }))
  .build();

export testActions = {
  testAction = actions[0]
}
```
  
##### name your reducer actions
actions will return by a object, you can name it or default by index start with 0
```
const actions = new ReduxCreator('test', initalState)
  .addReducer((state, payload) => ({ ...state, payload }), 'testAction')
  .build();

export testActions = {
  testAction = actions.testAction
}
```
  
#### add effect handler
effect handler to process async effects and dispatch action to reducers

```
const effectHandler = async (store, payload) {
  // your effect logic, you can dispath store events by effect handler
}

const actions = new ReduxCreator()
  .addEffectHandler(effectHandler)
  .build();

```
  
effect handlers behaves as same as reducer actions, you can name it or get by index 
<br>
  
## Advanced Usage
### Location Middleware
#### config location middleware
```
// convert payload to location for location middleware;
const locationFormatter: (payload) => payload.location;

// location middleware config
const locationMiddleware = { 
  actionType: 'Location_Change_Action',
  locationFormatter 
};

// set up location middleware when using configureStore
const store = configureStore({ locationMiddleware, devTool: true });
```
  
#### add location handler
effect handler to process async effects and dispatch action to reducers
```
const locationHandler = async (store, location) {
  // add your location handling logic
  // for example::
  // if (location.pathname == '/')
  //   store.dispatch(action);
}

const actions = new ReduxCreator()
  .addLocationHandler(locationHandler)
  .build();

```
  
### processLocationEvents
this will alloed you to run location events explicitly
  
### getEffectTasks
this will allowed you to get current running effects, can be useful when doing SSR
  
