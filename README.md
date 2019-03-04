# [@banbrick/redux-creator](https://www.npmjs.com/package/@banbrick/redux-creator)  
redux creator for less boilerplate, also allow redux to be loaded by code split

## Install
```npm i @banbrick/redux-creator```  

## Example
[ReactCoreTemplate](https://github.com/JiarongGu/ReactCoreTemplate/tree/master/ReactCoreTemplate/ClientApp)

## How to use
### Configure store
create a store can use ReduxCreator with configureStore
```javascript
import { configureStore } from '@banbrick/redux-creator';
// its also possible to add reducers and middlewares through this api
const store = configureStore({ 
  reducers, // static reducers, built without creator
  initalState, // inital state
  middlewares, // addtional middlewares
  devTool: true // true to use redux-dev-tool
});
```
  
### Add state and redcuers
#### build reducers and state with ReduxCreator
```javascript
import { ReduxCreator } from '@banbrick/redux-creator';

// create a reducer function
const setPayload = (state, payload) => ({ ...state, payload });

// build reducers with namespace and inital state
const actions = new ReduxCreator('test', initalState)
  .addReducer(setPayload)
  .build();

// export action to be used by dispatch 
export testActions = { testAction: actions[0] }
```
  
#### name your actions
actions will return by a object, you can name it or default by index start with 0
```javascript
const setPayload = (state, payload) => ({ ...state, payload });

const actions = new ReduxCreator('test', initalState)
  .addReducer(setPayload, 'testAction') //set action name
  .build();
  
export testActions = { testAction: actions.testAction }
```
  
#### add effect handler
effect handler to process async effects and dispatch action to reducers
```javascript
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
```javascript
const history = createBrowserHistory();
history.listen((location) => {
  store.dispatch({ type: 'Location_Change', payload: history });
});
```

#### config location middleware
```javascript
// convert payload to location for location middleware;
const locationFormatter: (payload) => payload.location;

// location middleware config
const locationMiddleware = { 
  actionType: 'Location_Change',
  initalLocation: history.location,
  reload: true // reload when location handler async-loaded by code-split
};

// set up location middleware when using configureStore
const store = configureStore({ locationMiddleware, devTool: true });
```
  
#### add location handler
effect handler to process async effects and dispatch action to reducers
```javascript
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
```javascript
import { processLocationEvents } from '@banbrick/redux-creator';
```
this will alloed you to run location events explicitly
  
### Get running Effect Tasks
```javascript
import { getEffectTasks } from '@banbrick/redux-creator';
```
this will allowed you to get current running effects, can be useful when doing SSR
  
