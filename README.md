# @banbrick/redux-creator
for easier life on redux ``npm version 1.0.0``

## Getting Started

### Install
```npm i @banbrick/redux-creator```

### Create store
this will create a store with registration ability

```
import { ConnectedRouter, configureStore } from '@banbrick/redux-creator';
const store = configureStore<ApplicationState>({ reducers, initalState, middlewares, devTool: true });
```

### Setup Location Middleware
```
const locationMiddleware = { actionType: 'Location_Change_Action' };
const store = configureStore<ApplicationState>({ locationMiddleware, devTool: true });
```

#### Config formatter to convert payload to location for location middleware
```
locationFormatter: (payload) => payload.location;
const locationMiddleware = { actionType: 'Location_Change_Action', locationFormatter };
```


### Build redux
```
...
import { ReduxCreator } from '@banbrick/react-utils';

// build redux events, and get actions to tigger
const actions = new ReduxCreator<Number>('count', 0)
  .addReducer((state) => ++state, 'increment')
  .build();

@connect(
  state => ({ count: state.count }),
  dispatch => ({ increment: () => dispatch(actions.increment()) })
)
export class Counter extends React.Component<any> {
  render() {
    return (
      <div>
        <h1>Counter</h1>
        <p>Current count: <strong>{this.props.count}</strong></p>
        <button onClick={this.props.increment}>Increment</button>
      </div>
    )
  }
}
```

### Advanced Usage
#### Effect handlers:  
using ``AddEffectHanlder`` from creator, add an async promise effect process, will return in action as well
  

#### location handlers:    
```
export class WatherForecastState {
  forecasts: any[];
}

const locationHanlder = async (store: Store<ApplicationState>, location: Location) => {
  var matches = matchPath(location.pathname,  { path: '/weather-forecast/:startDateIndex?'});

  if (matches) {
    const startDateIndex = (matches.params as any).startDateIndex;
    const httpConfig = store.getState().httpConfig.config;
    const forecasts = await new WeatherForecastSource(httpConfig).fetchdata(startDateIndex);

    store.dispatch(watherForecastActions.setForcasts(forecasts));
  }
};

export const watherForecastActions = 
  new ReduxCreator<WatherForecastState>('watherForecast', new WatherForecastState())
  .addReducer((state, forecasts) => ({ ...state, forecasts }), 'setForcasts')
  .addLocationHandler(locationHanlder)
  .build();
```

by adding location handler you can run actions based on location change, reqiure to use ``ConnctedRouter``
this will alloed you to call ``processLocationEvents`` to run location events explicitly
