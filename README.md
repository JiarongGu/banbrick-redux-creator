# @banbrick/redux-creator
for easier life on redux ``npm version 1.0.2``

## NPM Install
```npm i @banbrick/redux-creator```
  
  
## Main APIs
``configureStore``: create a store can use ReduxCreator  
``ReduxCreator``: main creator class to config store  
   
  
## Create store
```
import { configureStore } from '@banbrick/redux-creator';
const store = configureStore({ reducers, initalState, middlewares, devTool: true });
```
its also possible to add reducers and middlewares through this api
  
  
## Use Redux Creator
  
### create state and reducers
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
  
#### name your reducer actions
actions will return by a object, you can name it or default by index start with 0

```
const actions = new ReduxCreator('test', initalState)
  .addReducer((state, payload) => ({ ...state, payload }), 'testAction')
  .build();

export testActions = {
  testAction = actions.testAction
}
```
  
### add effect handler
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
#### set up
set up location middleware when using configureStore
```
const locationMiddleware = { actionType: 'Location_Change_Action' };
const store = configureStore({ locationMiddleware, devTool: true });
```
  
#### config formatter
convert payload to location for location middleware
```
locationFormatter: (payload) => payload.location;
const locationMiddleware = { actionType: 'Location_Change_Action', locationFormatter };
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
  
