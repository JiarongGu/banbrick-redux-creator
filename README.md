# [@banbrick/redux-creator](https://www.npmjs.com/package/@banbrick/redux-creator)  
redux creator for less boilerplate

## Install
```npm i @banbrick/redux-creator```  
  
## How to use
### Configure store
create a store can use ReduxCreator with configureStore
```
import { configureStore } from '@banbrick/redux-creator';
// its also possible to add reducers and middlewares through this api
const store = configureStore({ reducers, initalState, middlewares, devTool: true });
```
  
### Add state and redcuers
#### build reducers and state with ReduxCreator
```
import { ReduxCreator } from '@banbrick/redux-creator';

// build reducers with namespace and inital state
const actions = new ReduxCreator('test', initalState)
  .addReducer((state, payload) => ({ ...state, payload }))
  .build();
  
export testActions = { testAction: actions[0] }
```
  
#### name your actions
actions will return by a object, you can name it or default by index start with 0
```
const actions = new ReduxCreator('test', initalState)
  .addReducer((state, payload) => ({ ...state, payload }), 'testAction')
  .build();
  
export testActions = { testAction: actions.testAction }
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
#### add location event to history
```
const history = createBrowserHistory();
history.listen((location) => {
  store.dispatch({ type: 'Location_Change', payload: history });
});
```

#### config location middleware
```
// convert payload to location for location middleware;
const locationFormatter: (payload) => payload.location;

// location middleware config
const locationMiddleware = { 
  actionType: 'Location_Change'
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
  
### Explicitly Process Location Events
```
import { processLocationEvents } from '@banbrick/redux-creator';
```
this will alloed you to run location events explicitly
  
### Get running Effect Tasks
```
import { getEffectTasks } from '@banbrick/redux-creator';
```
this will allowed you to get current running effects, can be useful when doing SSR
  
