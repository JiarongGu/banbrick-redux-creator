# ReduxService
using decorators to create redux service class, can access redux state using class from everywhere you want.
- decorators: `@service`, `@state`, `@reducer`, `@effect`, `@location`, `@connect`.  

hint: all instance created by service class will shared in the same scope of its prototype.

## @service
```javascript
@service('CounterService')
class CounterService { ... }
```
set the class as redux service, the name of service use to locate the service in props

## @state
```javascript
@state
state = { 
  increment: 0, 
  decrement: 0, 
  total: 0 
};
```
configure inital state, can access state in service class by `this.state`,
inital state created based on this property or inheritant from current store

## @reducer
reducer will only return state
```javascript
@reducer
increment(value: number) {
  return { ...this.state, increment: this.state.increment + number };
}
```
setup reducer logic, `@reducer` function will dispatch changes to state without using `dispatch`
warning: do not call reducer function in side reducer, use effect to do it

## @effect
effect will only return promise or void.
```javascript
@effect
updateAll(value: number) {
  this.decrement(value);
  this.increment(value);
}
```
`@effect` is used to trigger multiple reducer functions

## @location
location function will triggered by `Path` or `PathProps` from react-router, location events can be defined by location middleware settings.
only 2 paramters will be accepted by this function which is matches and location.
if reload option is true, the location process will be triggered when the time the function gets added to events

```javascript
@location('/weather-forecast/:index?', true)
async loadOnWeatherUrl(matches: match<{ index?: string}>, location: Location) {
  const index = parseInt(matches.params.index || '') || 0;
  await this.loadWeatherForecast(index);
}
```

## @connect / connectService
```javascript
@connect(CounterService, OtherService1, OtherService2)
class Counter extends React.Component {
 ...
}

connectService(CounterService, OtherService1, OtherService2)(Component)
```
use `@connect` or `connectService` to connect service to component,
connected component will get all the actions and state, other properties and function will not be mapped to component

## Properties
```javascript
class CounterService { 
  property1 = 0;
  property2 = 'property2 string';
}
```
properties can be used by class property or through constructor, can be accessed by reducers and effects but will not map to component by connect


## Example
### Create ReduxService class
```javascript
import { service, state, reducer, effect, connect } from '@banbrick/react-creator'

@service('CounterService')
class CounterService {
  @state
  state = { 
    increment: 0, 
    decrement: 0, 
    total: 0 
  };

  @reducer
  increment(value: number) {
    const increment = this.state.increment + value;
    const total = this.state.total + value;
    return { ...this.state, increment, total };
  }

  @reducer
  decrement(value: number) {
    const decrement = this.state.decrement - value;
    const total = this.state.total - value;
    return { ...this.state, decrement, total };
  }

  @effect
  updateAll(value: number) {
    this.decrement(value);
    this.increment(value);
  }
}
```

### Connect to component
```javascript
@connect(CounterService)
class Counter extends React.Component {
  render() {
    const counterService = this.props.CounterService;
    return (
      <div>
        <h1>Counter</h1>
        <p>Current Increment: <strong>{counterService.state.increment}</strong></p>
        <p>Current Decrement: <strong>{counterService.state.decrement}</strong></p>
        <p>Current Total: <strong>{counterService.state.total}</strong></p>
        <button onClick={() => counterService.increment(2)}>Increment</button>
        <button onClick={() => counterService.decrement(2)}>Decrement</button>
      </div>
    )
  }
}
```

### Use outside of component
```javascript
const counterService = new CounterService();
const counterState = counterService.increment(10);
```
