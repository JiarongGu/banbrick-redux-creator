#ReduxCreator

## Build reducers with inital state
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
  
## Name your actions
actions will return by a object, you can name it or default by index start with 0
```javascript
const setPayload = (state, payload) => ({ ...state, payload });

const actions = new ReduxCreator('test', initalState)
  .addReducer(setPayload, 'testAction') //set action name
  .build();
  
export testActions = { testAction: actions.testAction }
```
  
## Add effect handler
effect handler to process async effects and dispatch action to reducers
```javascript
const effectHandler = async (store, payload) {
  // your effect logic, you can dispath store events by effect handler
  store.dispatch(actions.setLoading(true));
  const response = await axios.request('https://data');
  store.dispatch(actions.setData(data));
  store.dispatch(actions.setLoading(false));
}

// add effect handler
const actions = new ReduxCreator()
  .addEffectHandler(effectHandler)
  .build();
```
  
effect handlers behaves as same as reducer actions, you can name it or get by index    
    
## Accessor
accessor will autogenrate a list of reducers based on initalstate or the property given.  
```javascript
const actions = new ReduxCreator('test', {
    name: '',
    value: '',
  })
  .addAccessor()
  .build();

export testActions = { accessor: actions[0] }
```
or
```javascript
const actions = new ReduxCreator('test', {})
  .addAccessor(['name', 'value'], 'accessor')
  .build();

export testActions = { accessor: actions.accessor }
```
accessor is a key value pair for action function.  
```javascript
// create action by accessor to dispatch action for name value changes
dispatch(accessor['name']('test name'));
dispatch(accessor['value']('test value'));
```  
  