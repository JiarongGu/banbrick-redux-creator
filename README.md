# [@banbrick/redux-creator](https://www.npmjs.com/package/@banbrick/redux-creator)  
redux creator for less boilerplate, also allow redux to be loaded by code split.    

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
  devTool: true // enable redux-dev-tool
});
```
    
### Configure Reducers
- [ReduxCreator](https://github.com/JiarongGu/banbrick-redux-creator/blob/master/doc/ReduxCreator.md) using functions
- [ReduxService](https://github.com/JiarongGu/banbrick-redux-creator/blob/master/doc/ReduxService.md) using decorators
    
### Others
- [Advanced](https://github.com/JiarongGu/banbrick-redux-creator/blob/master/doc/Advanced.md)
